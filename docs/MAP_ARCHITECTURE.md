# Map Architecture Documentation

## Overview

The map visualization system has been refactored into a modular, scalable architecture that makes adding new data sources simple and maintainable.

## Architecture Components

### 1. **Data Source Configuration** (`src/config/dataSources.ts`)

Centralized configuration for all GeoJSON data sources. This is the **single source of truth** for map data.

```typescript
export interface DataSourceConfig {
  id: string; // Unique identifier
  name: string; // Display name
  layerType: string; // Links to MapLayer type
  dataUrl: string; // Path to GeoJSON file
  style: {
    // Mapbox styling
    fillColor: string;
    fillOpacity: number;
    lineColor: string;
    lineWidth: number;
  };
  metadata?: {
    // Optional descriptive info
    description?: string;
    year?: string;
    source?: string;
  };
}
```

**Adding a new dataset is as simple as:**

```typescript
{
  id: "new-dataset",
  name: "New Dataset Name",
  layerType: "newtype",
  dataUrl: "/data/NewData.geojson",
  style: {
    fillColor: "#FF5733",
    fillOpacity: 0.5,
    lineColor: "#C70039",
    lineWidth: 2,
  },
  metadata: {
    description: "Description of the new dataset",
    year: "2025",
    source: "Data source",
  },
}
```

### 2. **GeoJSONLayer Component** (`src/components/GeoJSONLayer.tsx`)

Reusable component that handles the entire lifecycle of a GeoJSON layer:

- ✅ Fetches GeoJSON data from the specified URL
- ✅ Creates Mapbox source
- ✅ Adds fill and line layers with configured styling
- ✅ Manages visibility toggling
- ✅ Handles cleanup on unmount
- ✅ Error handling and logging

**Usage:**

```tsx
<GeoJSONLayer config={dataSourceConfig} visible={true} />
```

### 3. **useMapLayers Hook** (`src/hooks/useMapLayers.ts`)

Custom hook that bridges the gap between:

- App-level layer state (visibility toggles)
- Data source configurations

Returns an array of data sources with their current visibility state.

### 4. **Simplified MapView** (`src/components/MapView.tsx`)

The main map component is now clean and declarative:

```tsx
export default function MapView({ layers }: MapViewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const mapLayersWithVisibility = useMapLayers(layers);

  return (
    <Map {...mapProps}>
      <NavigationControl position="top-right" />

      {isLoaded &&
        mapLayersWithVisibility.map((layerConfig) => (
          <GeoJSONLayer
            key={layerConfig.id}
            config={layerConfig}
            visible={layerConfig.visible}
          />
        ))}
    </Map>
  );
}
```

## How to Add a New Dataset

### Step 1: Add GeoJSON file

Place your GeoJSON file in the `public/data/` directory:

```
public/data/MyNewData.geojson
```

### Step 2: Add data source config

Update `src/config/dataSources.ts`:

```typescript
{
  id: "my-new-data",
  name: "My New Dataset",
  layerType: "mynewtype",  // Must match type in App.tsx
  dataUrl: "/data/MyNewData.geojson",
  style: {
    fillColor: "#3498db",
    fillOpacity: 0.4,
    lineColor: "#2980b9",
    lineWidth: 1.5,
  },
}
```

### Step 3: Update TypeScript types

Add the new layer type to `src/types/index.ts`:

```typescript
export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type:
    | "mangrove"
    | "forest"
    | "water"
    | "carbon"
    | "gain"
    | "loss"
    | "mynewtype";
}
```

### Step 4: Add layer control

Update `src/App.tsx` to include the new layer in the control panel:

```typescript
const [layers, setLayers] = useState<MapLayer[]>([
  // ... existing layers
  { id: "mynew", name: "My New Dataset", visible: true, type: "mynewtype" },
]);
```

**That's it!** The new dataset will automatically:

- Load when the map initializes
- Render with your specified styling
- Toggle on/off with the layer control
- Clean up when unmounted

## Benefits of This Architecture

### ✅ **Separation of Concerns**

- Data config separate from rendering logic
- Each component has a single responsibility
- Easy to test and maintain

### ✅ **Scalability**

- Add unlimited datasets without modifying MapView
- No complex if/else chains for different layer types
- Consistent pattern for all data sources

### ✅ **Maintainability**

- Change styling in one place (config)
- Centralized error handling
- Clear data flow

### ✅ **Developer Experience**

- Simple 4-step process to add datasets
- Self-documenting configuration
- TypeScript ensures type safety

### ✅ **Performance**

- Memoized layer computations
- Efficient visibility toggling
- Proper cleanup prevents memory leaks

## File Structure

```
src/
├── config/
│   └── dataSources.ts        # All GeoJSON data source configs
├── components/
│   ├── GeoJSONLayer.tsx      # Reusable layer component
│   ├── MapView.tsx           # Main map container
│   ├── LayerControl.tsx      # Toggle UI
│   └── TimeSeriesChart.tsx
├── hooks/
│   └── useMapLayers.ts       # Layer state management hook
├── types/
│   └── index.ts              # TypeScript definitions
└── App.tsx                   # App-level state
```

## Advanced Customization

### Custom Layer Styling

You can add more style properties to the config:

```typescript
style: {
  fillColor: "#00ff00",
  fillOpacity: 0.4,
  lineColor: "#00aa00",
  lineWidth: 2,
  // Add custom properties
  fillPattern?: string,
  lineOffset?: number,
}
```

### Conditional Layer Loading

Load layers based on zoom level or other conditions:

```typescript
{isLoaded && zoom > 10 && mapLayersWithVisibility
  .filter(layer => layer.shouldShowAtZoom)
  .map(layerConfig => <GeoJSONLayer ... />)}
```

### Interactive Features

Add click handlers in GeoJSONLayer:

```typescript
map.on("click", fillLayerId, (e) => {
  // Handle feature click
  console.log(e.features[0].properties);
});
```

## Migration from Old Architecture

**Before (100+ lines):**

- Manual source/layer management
- Hardcoded layer IDs
- Visibility logic spread across useEffect hooks
- Difficult to add new datasets

**After (40 lines):**

- Declarative component composition
- Config-driven approach
- Single source of truth
- Add datasets in minutes

## Next Steps

Consider adding:

- Layer ordering/z-index control
- Popup/tooltip components for feature info
- Legend component that reads from config
- Filter/search functionality for features
- Time-based layer animation
- Data refresh/update mechanisms
