# MapView Component Architecture

## Overview

The MapView component implements a robust, race-condition-free architecture for managing Mapbox GL layers with dynamic data loading. The design uses **transitive guarantees** and **sync locks** to ensure operations execute in the correct order without race conditions.

---

## Architecture Principles

### 1. **Separation of Concerns**

Each custom hook has a single, well-defined responsibility:

- `useInitMap` - Provides map instance access
- `useLayerDataUpdate` - Manages data loading/updates
- `useLayerVisibility` - Controls layer visibility
- `useLayerClickHandlers` - Attaches event handlers

### 2. **Transitive Guarantees**

State flags create guarantee chains that eliminate redundant null checks:

```
useInitMap succeeds
    ↓
initialized = true  (guarantees map is valid)
    ↓
useLayerDataUpdate runs
    ↓
dataLoaded = true  (guarantees map AND initialized are valid)
    ↓
useLayerClickHandlers runs
```

### 3. **Type-Driven Design**

TypeScript types encode architectural guarantees:

- `map: Map | null` → Hook must handle null case
- `map: Map` → Caller guarantees non-null (via flag)

---

## Component Hierarchy

```
MapView (manages map container)
  └── LayerInitializer (orchestrates hooks)
      ├── useInitMap()
      ├── useLayerDataUpdate()
      ├── useLayerVisibility()
      └── useLayerClickHandlers()
```

---

## Data Flow

### Initial Load Sequence

```
1. Map Component Loads
   └─> isLoaded = true (React state)

2. LayerInitializer Mounts
   └─> useInitMap() called
       └─> useMap() hook retrieves map reference
       └─> initialized = true

3. initialized = true triggers:
   ├─> useLayerDataUpdate()
   │   ├─> previousYear.current = null (first run)
   │   ├─> Fetch GeoJSON for currentYear
   │   ├─> Create sources + layers
   │   └─> dataLoaded = true
   │
   └─> useLayerVisibility()
       └─> Apply initial visibility state

4. dataLoaded = true triggers:
   └─> useLayerClickHandlers()
       └─> Attach click/hover handlers to all layers
```

### Year Change Sequence

```
User changes year → currentYear prop updates

1. useLayerDataUpdate() re-runs
   ├─> previousYear.current !== currentYear (condition met)
   ├─> dataLoaded = false (sync lock engaged)
   ├─> Fetch new GeoJSON data
   ├─> Update existing sources OR recreate if removed
   └─> dataLoaded = true (sync lock released)

2. dataLoaded = true triggers:
   └─> useLayerClickHandlers() re-runs
       └─> Re-attach handlers (handles layer changes)
```

### Visibility Toggle Sequence

```
User toggles layer visibility → layers prop updates

1. useLayerVisibility() re-runs
   └─> Update layer visibility via Mapbox setLayoutProperty

Note: Does NOT trigger data reload (efficient!)
```

---

## Custom Hooks Reference

### `useInitMap()`

**Purpose:** Provides map instance and signals when ready for layer operations.

**Returns:**

```typescript
{ map: Map, initialized: boolean }
```

**Dependencies:** `[mapRef, initialized]`

**Guarantees:**

- When `initialized = true`, `map` is guaranteed non-null
- Runs only once per map instance (prevents double-initialization)

**Implementation Notes:**

- Uses `react-map-gl`'s `useMap()` hook internally
- Encapsulates map instance retrieval

---

### `useLayerDataUpdate()`

**Purpose:** Loads/updates GeoJSON data when year changes (handles initial load too).

**Props:**

```typescript
{
  map: Map;           // Non-null: guaranteed by initialized
  initialized: boolean;
  currentYear: number;
  layers: MapLayer[];  // For visibility state
}
```

**Returns:**

```typescript
{
  dataLoaded: boolean;
}
```

**Dependencies:** `[initialized, currentYear]`

**Guarantees:**

- When `dataLoaded = true`, all layers are loaded and ready
- `map` is guaranteed non-null (enforced by `initialized` guard)

**Algorithm:**

```typescript
if (!initialized) return;  // Early guard

if (previousYear !== null && previousYear === currentYear) return;  // Skip duplicate

setDataLoaded(false);  // Sync lock engaged

for each layer config:
  fetch GeoJSON data
  if source exists:
    update data
  else:
    create source + layers with visibility state

setDataLoaded(true);  // Sync lock released
previousYear = currentYear;
```

**Race Condition Prevention:**

- `previousYear` ref prevents duplicate requests
- `dataLoaded` flag synchronizes with click handlers
- `initialized` dependency ensures first run after map ready

---

### `useLayerVisibility()`

**Purpose:** Updates layer visibility when user toggles layers.

**Props:**

```typescript
{
  map: Map;           // Non-null: guaranteed by initialized
  initialized: boolean;
  layers: MapLayer[];
}
```

**Dependencies:** `[initialized, layers]`

**Guarantees:**

- `map` is guaranteed non-null (enforced by `initialized` guard)
- Does not depend on `currentYear` (layer IDs are stable)

**Implementation:**

```typescript
if (!initialized) return;

for each DATA_SOURCE:
  find matching layer in layers array
  set visibility based on layer.visible
```

**Performance:**

- Only re-runs on visibility changes (not year changes)
- Uses static `DATA_SOURCES` (layer IDs don't change with year)

---

### `useLayerClickHandlers()`

**Purpose:** Attaches click/hover handlers to layers after data loads.

**Props:**

```typescript
{
  map: Map;            // Non-null: guaranteed by dataLoaded
  dataLoaded: boolean;
  onFeatureClick?: (feature: Record<string, unknown>) => void;
}
```

**Dependencies:** `[dataLoaded]`

**Guarantees:**

- `map` is guaranteed non-null (enforced by `dataLoaded` flag)
- Only attaches handlers when layers exist
- Cleanup prevents memory leaks

**Algorithm:**

```typescript
if (!dataLoaded || !onFeatureClick) return;

for each layer:
  if layer exists and not already handled:
    attach click handler
    attach mouseenter handler (cursor: pointer)
    attach mouseleave handler (cursor: default)
    store cleanup function

for each existing handler:
  if layer no longer exists:
    call cleanup function
    remove from registry

return cleanup function (for unmount)
```

**Race Condition Prevention:**

- `dataLoaded` dependency ensures layers exist before attaching
- Handler registry prevents duplicate attachments
- Cleanup handles layer removal gracefully

---

## Dependency Strategy

### Why Some Dependencies Are Excluded

Each hook intentionally excludes certain values from its dependency array:

#### `useLayerDataUpdate` excludes `map` and `layers`:

```typescript
// ❌ WRONG: Would cause unnecessary re-runs
}, [map, initialized, currentYear, layers]);

// ✅ CORRECT: Only re-run on meaningful changes
}, [initialized, currentYear]);
```

**Reason:**

- `map` is stable (doesn't change after initialization)
- `layers` visibility handled by separate hook
- Only `initialized` (first run) and `currentYear` (updates) matter

#### `useLayerVisibility` excludes `map`:

```typescript
// ✅ CORRECT
}, [initialized, layers]);
```

**Reason:**

- `map` is stable
- Only visibility toggles (`layers`) should trigger updates

#### `useLayerClickHandlers` excludes `map` and `onFeatureClick`:

```typescript
// ✅ CORRECT
}, [dataLoaded]);
```

**Reason:**

- `map` is stable
- `onFeatureClick` is stable (from parent)
- Only data loading state (`dataLoaded`) should trigger re-attachment

---

## Race Conditions & Solutions

### Problem 1: Click Handlers Before Data Loads

**Scenario:**

```
1. Map initializes
2. Click handlers attach immediately
3. Data still loading → some layers don't exist yet
4. Those layers never get handlers! ❌
```

**Solution:** Sync lock with `dataLoaded` flag

```typescript
useLayerDataUpdate → setDataLoaded(false) → load data → setDataLoaded(true)
useLayerClickHandlers → depends on [dataLoaded] → only runs when true
```

### Problem 2: Duplicate Data Loading

**Original Issue:**

```
1. useMapLayers loads data for year X
2. useLayerDataUpdate immediately re-loads data for year X (duplicate!) ❌
```

**Solution:** `useInitMap` doesn't load data

```typescript
// useInitMap just signals readiness
setInitialized(true);

// useLayerDataUpdate handles ALL data loading
useEffect(() => {
  if (!initialized) return;
  // Load data for currentYear
}, [initialized, currentYear]);
```

### Problem 3: Effect Doesn't Re-run on Guard Change

**Original Issue:**

```typescript
useEffect(() => {
  if (!initialized) return; // Guard uses initialized
  // ... work ...
}, [currentYear]); // But initialized not in deps! ❌

// Result: Effect runs once, hits guard, never runs again when initialized becomes true
```

**Solution:** Include guard values in dependencies

```typescript
}, [initialized, currentYear]);  // ✅ Re-runs when initialized changes
```

### Problem 4: Stale Year Check on First Run

**Original Issue:**

```typescript
const previousYear = useRef(currentYear); // Initialized with current!

if (previousYear.current === currentYear) return; // Always true on first run! ❌
```

**Solution:** Initialize with `null` and check explicitly

```typescript
const previousYear = useRef<number | null>(null);

if (previousYear.current !== null && previousYear.current === currentYear)
  return;
// First run: null !== null → false → continues ✅
// Later: checks year equality
```

---

## Utility Functions

### Core Operations

| Function                                          | Purpose                 | Returns                     |
| ------------------------------------------------- | ----------------------- | --------------------------- |
| `fetchGeoJSONData(url)`                           | Fetch GeoJSON from URL  | `FeatureCollection \| null` |
| `addMapSource(map, id, data)`                     | Add GeoJSON source      | `boolean` (success)         |
| `addMapLayers(map, config, sourceId, visibility)` | Add fill + line layers  | `boolean` (success)         |
| `removeMapLayers(map, id)`                        | Remove layers + source  | `void`                      |
| `updateSourceData(map, id, data)`                 | Update existing source  | `boolean` (exists)          |
| `updateLayerVisibility(map, id, visibility)`      | Toggle layer visibility | `void`                      |
| `getLayerVisibility(layers, type)`                | Get visibility state    | `"visible" \| "none"`       |

### Error Handling

All utilities handle errors gracefully:

- `fetchGeoJSONData` returns `null` on failure (not throw)
- Layer operations check existence before acting
- Console warnings for non-critical failures

---

## Type Safety

### Non-Null Guarantees

The architecture uses TypeScript to encode runtime guarantees:

```typescript
// Hook interfaces reflect guarantees
interface UseLayerDataUpdateOptions {
  map: Map; // ← Non-null type
  initialized: boolean; // ← Enforces the guarantee
}

// Call site must guarantee
useLayerDataUpdate({
  map, // This is safe provided initialized flag is used in early return guard
  initialized,
});
```

### Type Definitions

```typescript
interface MapLayer {
  type: MapLayerType;
  visible: boolean;
}

type MapLayerType = "mangrove" | "flood" | "gain" | "loss" | ...;

interface DataSourceConfig {
  id: string;
  name: string;
  layerType: MapLayerType;
  dataUrl: string;
  style: { fillColor, fillOpacity, lineColor, lineWidth };
}
```

---

## Performance Considerations

### Optimizations

1. **Minimal Re-renders**

   - Each hook only depends on values that should trigger it
   - `map` and callback props excluded (stable references)

2. **Efficient Updates**

   - Visibility changes don't reload data
   - Year changes update existing sources (no full recreation)

3. **Cleanup**
   - All effects return cleanup functions
   - Handlers properly removed on unmount
   - No memory leaks

### Network Efficiency

- Single data fetch per year change
- Failed fetches handled gracefully (layer removed)
- No duplicate requests (previousYear ref)

---

## Testing Considerations

### Key Scenarios to Test

1. **Initial Load**

   - Map initializes → data loads → handlers attach
   - Verify console logs appear in correct order

2. **Year Changes**

   - Verify data updates without full recreation
   - Check `dataLoaded` cycles: true → false → true

3. **Visibility Toggles**

   - Verify no data reload on visibility change
   - Check performance (should be instant)

4. **Race Conditions**

   - Fast year changes (verify no duplicate requests)
   - Toggle visibility during data load (should queue)

5. **Error Cases**
   - Missing data files (layers removed gracefully)
   - Network failures (no crash, console warnings)

---

## Common Pitfalls & Solutions

### ❌ Pitfall 1: Calling `useMap()` Multiple Times

```typescript
// ❌ BAD
const { current: mapRef } = useMap();
const { map, initialized } = useMapLayers({ map: mapRef?.getMap() || null });
```

**Solution:** Let `useInitMap` handle it

```typescript
// ✅ GOOD
const { map, initialized } = useInitMap();
```

### ❌ Pitfall 2: Adding Dependencies That Shouldn't Trigger

```typescript
// ❌ BAD: Re-runs on every render (map reference changes)
useEffect(() => {
  // ...
}, [map, initialized, currentYear]);
```

**Solution:** Only include values that should trigger

```typescript
// ✅ GOOD
useEffect(() => {
  if (!initialized) return;
  // ...
}, [initialized, currentYear]);
```

### ❌ Pitfall 3: Forgetting Non-Null Assertion

```typescript
// ❌ BAD: Type error (map could be null)
useLayerDataUpdate({ map, initialized, currentYear });
```

**Solution:** Assert based on guarantee

```typescript
// ✅ GOOD
useLayerDataUpdate({ map: map!, initialized, currentYear });
// Safe because initialized guarantees map is non-null
```

---

## Future Enhancements

### Potential Improvements

1. **Parallel Data Loading**

   - Currently sequential: `for (const config of DATA_SOURCES)`
   - Could use: `await Promise.all(DATA_SOURCES.map(...))`

2. **Data Caching**

   - Cache fetched GeoJSON by year
   - Instant switching between previously loaded years

3. **Loading States**

   - Per-layer loading indicators
   - Progress tracking for large datasets

4. **Error Recovery**

   - Retry failed requests
   - Fallback data sources

5. **Optimistic Updates**
   - Show cached data immediately
   - Update in background

---

## Summary

### Key Takeaways

1. ✅ **Sync locks prevent race conditions** - `dataLoaded` flag coordinates async operations
2. ✅ **Transitive guarantees eliminate null checks** - Type system encodes runtime guarantees
3. ✅ **Single responsibility per hook** - Clear separation of concerns
4. ✅ **Dependency arrays are intentional** - Each dependency has a documented reason
5. ✅ **Initialization order is critical** - Hooks chain guarantees for correctness

### Architecture Philosophy

> "Make invalid states unrepresentable in the type system, and use sync locks to coordinate async operations."

The MapView architecture demonstrates that complex async UI can be both **type-safe** and **race-condition-free** through careful dependency management and transitive guarantees.

---

**Last Updated:** October 5, 2025  
**Version:** 2.0 (Post-refactoring)
