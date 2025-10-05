# Component Architecture Guide

## Overview

This guide documents the component architecture conventions used in the Kakadu Wetlands Sentinel project. It provides clear instructions for creating new components that follow the established patterns.

---

## Component Structure Convention

### Directory Layout

Every component follows a **three-file pattern**:

```
component-name/
├── index.ts              # Barrel export (re-export)
├── ComponentName.tsx     # Component implementation
└── ComponentName.css     # Component styles
```

### Current Component Inventory

```
src/components/
├── index.ts                      # Central barrel export
├── bottom-sidebar/
│   ├── index.ts
│   ├── BottomSidebar.tsx
│   └── BottomSidebar.css
├── control-sidebar/
│   ├── index.ts
│   ├── ControlSidebar.tsx
│   └── ControlSidebar.css
├── dashboard/
│   ├── index.ts
│   ├── Dashboard.tsx
│   └── Dashboard.css
├── layer-control/
│   ├── index.ts
│   ├── LayerControl.tsx
│   └── LayerControl.css
├── legend/
│   ├── index.ts
│   ├── Legend.tsx
│   └── Legend.css
├── map-view/
│   ├── index.ts
│   ├── MapView.tsx
│   └── MapView.css
├── navigation/
│   ├── index.ts
│   ├── Navigation.tsx
│   └── Navigation.css
├── time-series-chart/
│   ├── index.ts
│   ├── TimeSeriesChart.tsx
│   └── TimeSeriesChart.css
└── time-slider/
    ├── index.ts
    ├── TimeSlider.tsx
    └── TimeSlider.css
```

---

## Naming Conventions

### 1. Directory Names

**Pattern:** `kebab-case`

```
✅ CORRECT:
time-slider/
control-sidebar/
map-view/

❌ WRONG:
TimeSlider/
controlSidebar/
MapView/
```

### 2. Component File Names

**Pattern:** `PascalCase` matching component name

```
✅ CORRECT:
TimeSlider.tsx
ControlSidebar.tsx
MapView.tsx

❌ WRONG:
timeSlider.tsx
controlSidebar.tsx
index.tsx (except for barrel exports)
```

### 3. CSS File Names

**Pattern:** `PascalCase` matching component name

```
✅ CORRECT:
TimeSlider.css
ControlSidebar.css
MapView.css

❌ WRONG:
timeSlider.css
time-slider.css
styles.css
```

### 4. Component Function Names

**Pattern:** `PascalCase` matching file name

```typescript
// In TimeSlider.tsx
export function TimeSlider({ ... }) { ... }  // ✅

// In MapView.tsx
export function MapView({ ... }) { ... }     // ✅
```

---

## File Templates

### 1. Component Implementation (ComponentName.tsx)

```typescript
import "./ComponentName.css";

interface ComponentNameProps {
  // Define props with clear types
  title: string;
  isActive: boolean;
  onAction?: () => void;
}

/**
 * Brief description of what this component does.
 *
 * @param title - Description of this prop
 * @param isActive - Description of this prop
 * @param onAction - Optional callback description
 */
export function ComponentName({
  title,
  isActive,
  onAction,
}: ComponentNameProps) {
  return (
    <div className="component-name">
      <h2>{title}</h2>
      {isActive && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```

**Key Points:**

- ✅ Import CSS at the top
- ✅ Define props interface above component
- ✅ Use named export (not default)
- ✅ Add JSDoc comment for complex components
- ✅ Destructure props in function signature

### 2. Barrel Export (index.ts)

```typescript
export { ComponentName } from "./ComponentName";
```

**Key Points:**

- ✅ Single line re-export
- ✅ Use named export (not default)
- ✅ Matches component file name exactly

### 3. Component Styles (ComponentName.css)

```css
/* ComponentName Component Styles */

.component-name {
  /* Container styles */
  display: flex;
  flex-direction: column;
  background: var(--color-background-panel);
  border: 1px solid var(--color-border-primary);
}

.component-name__header {
  /* Block__Element naming (BEM-inspired) */
  padding: 1rem;
  border-bottom: 1px solid var(--color-border-primary);
}

.component-name__title {
  color: var(--color-text-primary);
  font-family: var(--font-display);
}

.component-name--active {
  /* Block--Modifier naming */
  border-color: var(--color-border-accent);
}
```

**Key Points:**

- ✅ Use kebab-case for class names
- ✅ Prefix with component name for scoping
- ✅ Use CSS variables from `theme.css`
- ✅ Follow BEM-inspired naming (Block\_\_Element--Modifier)
- ✅ Add header comment

---

## Step-by-Step: Creating a New Component

### Example: Adding a "StatusPanel" Component

#### Step 1: Create Directory

```bash
mkdir src/components/status-panel
```

#### Step 2: Create Component File

**File:** `src/components/status-panel/StatusPanel.tsx`

```typescript
import "./StatusPanel.css";

interface StatusPanelProps {
  status: "loading" | "success" | "error";
  message?: string;
}

/**
 * Displays application status with visual indicators.
 */
export function StatusPanel({ status, message }: StatusPanelProps) {
  const statusIcons = {
    loading: "⏳",
    success: "✅",
    error: "❌",
  };

  return (
    <div className={`status-panel status-panel--${status}`}>
      <span className="status-panel__icon">{statusIcons[status]}</span>
      {message && <p className="status-panel__message">{message}</p>}
    </div>
  );
}
```

#### Step 3: Create Barrel Export

**File:** `src/components/status-panel/index.ts`

```typescript
export { StatusPanel } from "./StatusPanel";
```

#### Step 4: Create Styles

**File:** `src/components/status-panel/StatusPanel.css`

```css
/* StatusPanel Component Styles */

.status-panel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--color-background-panel);
  border-radius: 8px;
}

.status-panel__icon {
  font-size: 1.5rem;
}

.status-panel__message {
  color: var(--color-text-primary);
  margin: 0;
}

.status-panel--loading {
  border-left: 4px solid var(--color-info);
}

.status-panel--success {
  border-left: 4px solid var(--color-success);
}

.status-panel--error {
  border-left: 4px solid var(--color-error);
}
```

#### Step 5: Add to Central Barrel Export

**File:** `src/components/index.ts`

```typescript
export { BottomSidebar } from "./bottom-sidebar";
export { ControlSidebar } from "./control-sidebar";
export { Dashboard } from "./dashboard";
export { LayerControl } from "./layer-control";
export { Legend } from "./legend";
export { MapView } from "./map-view";
export { Navigation } from "./navigation";
export { StatusPanel } from "./status-panel"; // ← Add this
export { TimeSeriesChart } from "./time-series-chart";
export { TimeSlider } from "./time-slider";
```

**Note:** Keep alphabetically sorted for easy reference.

#### Step 6: Use in Parent Component

**File:** `src/App.tsx`

```typescript
import { StatusPanel, MapView, Navigation } from "./components";

function App() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  return (
    <div>
      <Navigation {...props} />
      <StatusPanel status={status} message="Loading data..." />
      <MapView {...props} />
    </div>
  );
}
```

---

## Import Patterns

### ✅ Correct: Barrel Import (Preferred)

```typescript
// Import from central barrel
import { MapView, Navigation, TimeSlider } from "./components";

// Import from component barrel
import { StatusPanel } from "./components/status-panel";
```

**Benefits:**

- Clean, concise imports
- Hides internal structure
- Easy to refactor

### ❌ Incorrect: Direct Import

```typescript
// Don't import directly from implementation files
import { MapView } from "./components/map-view/MapView";
import { Navigation } from "./components/navigation/Navigation.tsx";
```

**Problems:**

- Exposes internal structure
- Harder to refactor
- More verbose

---

## TypeScript Conventions

### Props Interface

**Pattern:** `ComponentNameProps`

```typescript
interface StatusPanelProps {
  status: "loading" | "success" | "error";
  message?: string; // Optional props use ?
}
```

**Guidelines:**

1. Define interface above component
2. Use union types for enums
3. Mark optional props with `?`
4. Document complex props with JSDoc

### Type Imports

```typescript
// Import types from central location
import type { MapLayer } from "../../types";

// Use `type` keyword for type-only imports
import type { ReactNode } from "react";
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
}

export function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>;
}
```

---

## CSS Scoping Conventions

### BEM-Inspired Naming

```css
/* Block */
.component-name {
}

/* Block__Element */
.component-name__header {
}
.component-name__title {
}
.component-name__button {
}

/* Block--Modifier */
.component-name--active {
}
.component-name--disabled {
}

/* Block__Element--Modifier */
.component-name__button--primary {
}
.component-name__button--secondary {
}
```

### Prefixing for Scope

Always prefix class names with component name:

```css
/* ✅ GOOD - Scoped to component */
.status-panel {
}
.status-panel__icon {
}

/* ❌ BAD - Too generic, conflicts likely */
.panel {
}
.icon {
}
```

### Using Design Tokens

```css
.component-name {
  /* ✅ Use CSS variables from theme.css */
  color: var(--color-text-primary);
  background: var(--color-background-panel);
  border: 1px solid var(--color-border-primary);
  font-family: var(--font-body);
}

/* ❌ Don't hard-code colors */
.component-name {
  color: #ffffff;
  background: #213468;
  border: 1px solid #63c9d6;
}
```

---

## Component Categories

### 1. Layout Components

**Purpose:** Structure the application layout

**Examples:** Navigation, BottomSidebar, ControlSidebar

**Characteristics:**

- Position and size other components
- Manage responsive behavior
- Often contain CSS Grid or Flexbox

**Template:**

```typescript
export function LayoutComponent({ children }: { children: ReactNode }) {
  return (
    <div className="layout-component">
      <header className="layout-component__header">...</header>
      <main className="layout-component__content">{children}</main>
      <footer className="layout-component__footer">...</footer>
    </div>
  );
}
```

### 2. Feature Components

**Purpose:** Implement specific features

**Examples:** MapView, TimeSeriesChart, Dashboard

**Characteristics:**

- Contain business logic
- Manage local state
- Use custom hooks
- Handle data fetching/processing

**Template:**

```typescript
export function FeatureComponent({ data, onAction }: FeatureProps) {
  const [state, setState] = useState(initialState);
  const { result } = useCustomHook(data);

  return (
    <div className="feature-component">{/* Feature implementation */}</div>
  );
}
```

### 3. UI Components

**Purpose:** Reusable interface elements

**Examples:** TimeSlider, LayerControl, Legend

**Characteristics:**

- Highly reusable
- Minimal business logic
- Controlled by props
- Emit events via callbacks

**Template:**

```typescript
export function UIComponent({ value, onChange }: UIProps) {
  return (
    <div className="ui-component">
      <button onClick={() => onChange(newValue)}>{value}</button>
    </div>
  );
}
```

---

## State Management Patterns

### 1. Local State (useState)

For component-specific state:

```typescript
export function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  return <div onClick={() => setIsOpen(!isOpen)}>...</div>;
}
```

### 2. Props Drilling (Lift State Up)

For shared state across siblings:

```typescript
// App.tsx (parent)
function App() {
  const [currentYear, setCurrentYear] = useState(2024);

  return (
    <>
      <TimeSlider currentYear={currentYear} onYearChange={setCurrentYear} />
      <MapView currentYear={currentYear} />
    </>
  );
}
```

### 3. Custom Hooks

For reusable stateful logic:

```typescript
// hooks/useInitMap.ts
export function useInitMap() {
  const [map, setMap] = useState<Map | null>(null);
  const [initialized, setInitialized] = useState(false);

  // ... initialization logic

  return { map, initialized };
}

// Component usage
export function MapView() {
  const { map, initialized } = useInitMap();
  // ...
}
```

---

## Event Handling Conventions

### Callback Props

**Pattern:** `onEventName`

```typescript
interface ComponentProps {
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (value: string) => void;
  onSubmit?: (data: FormData) => void;
}

export function Component({ onOpen, onChange }: ComponentProps) {
  return (
    <div>
      <button onClick={onOpen}>Open</button>
      <input onChange={(e) => onChange?.(e.target.value)} />
    </div>
  );
}
```

**Guidelines:**

1. Prefix with `on` (onClick, onChange, onSubmit)
2. Make callbacks optional with `?`
3. Use optional chaining when calling: `onAction?.()`
4. Pass data as function argument, not in object

### Event Handler Functions

**Pattern:** `handleEventName`

```typescript
export function Component() {
  const handleClick = () => {
    console.log("Clicked!");
  };

  const handleChange = (value: string) => {
    console.log("Changed:", value);
  };

  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <input onChange={(e) => handleChange(e.target.value)} />
    </div>
  );
}
```

---

## Component Communication

### Parent → Child (Props)

```typescript
// Parent
<MapView currentYear={2024} layers={layers} />;

// Child
interface MapViewProps {
  currentYear: number;
  layers: MapLayer[];
}

export function MapView({ currentYear, layers }: MapViewProps) {
  // Use props
}
```

### Child → Parent (Callbacks)

```typescript
// Parent
<TimeSlider onYearChange={(year) => setCurrentYear(year)} />;

// Child
interface TimeSliderProps {
  onYearChange?: (year: number) => void;
}

export function TimeSlider({ onYearChange }: TimeSliderProps) {
  const handleChange = (year: number) => {
    onYearChange?.(year);
  };
}
```

### Sibling → Sibling (Lift State Up)

```typescript
function App() {
  // Shared state lives in common parent
  const [year, setYear] = useState(2024);

  return (
    <>
      {/* Both siblings access same state */}
      <TimeSlider currentYear={year} onYearChange={setYear} />
      <MapView currentYear={year} />
    </>
  );
}
```

---

## Custom Hooks Integration

### Hook Directory Structure

```
src/hooks/
├── index.ts                      # Barrel export
├── useInitMap.ts                 # Hook implementation
├── useLayerDataUpdate.ts
├── useLayerVisibility.ts
└── useLayerClickHandlers.ts
```

### Creating a New Hook

**File:** `src/hooks/useCustomHook.ts`

```typescript
import { useState, useEffect } from "react";

interface UseCustomHookOptions {
  initialValue: string;
}

/**
 * Custom hook description.
 */
export function useCustomHook({ initialValue }: UseCustomHookOptions) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // Hook logic
  }, [initialValue]);

  return { value, setValue };
}
```

**Add to barrel:** `src/hooks/index.ts`

```typescript
export { useCustomHook } from "./useCustomHook";
export { useInitMap } from "./useInitMap";
// ... other hooks
```

### Using Hooks in Components

```typescript
import { useInitMap, useLayerDataUpdate } from "../../hooks";

export function MapView({ currentYear }: MapViewProps) {
  // Use custom hooks
  const { map, initialized } = useInitMap();
  const { dataLoaded } = useLayerDataUpdate({ map, initialized, currentYear });

  return <div>...</div>;
}
```

---

## Testing Components (Future)

### Test File Location

```
component-name/
├── index.ts
├── ComponentName.tsx
├── ComponentName.css
└── ComponentName.test.tsx        # ← Co-located with component
```

### Test Template

```typescript
import { render, screen } from "@testing-library/react";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName title="Test" />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("handles user interaction", () => {
    const handleClick = vi.fn();
    render(<ComponentName onAction={handleClick} />);
    // ... test interaction
  });
});
```

---

## Common Patterns

### Conditional Rendering

```typescript
export function Component({ isVisible, data }: Props) {
  // Early return for null case
  if (!data) return null;

  return (
    <div>
      {/* Conditional with && */}
      {isVisible && <Content />}

      {/* Ternary for either/or */}
      {data.length > 0 ? <List items={data} /> : <EmptyState />}
    </div>
  );
}
```

### List Rendering

```typescript
export function Component({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Children Props

```typescript
interface Props {
  children: ReactNode;
}

export function Container({ children }: Props) {
  return <div className="container">{children}</div>;
}
```

---

## Best Practices

### ✅ Do's

1. **Use functional components** (not class components)
2. **Export named functions** (not default exports)
3. **Define props interface** above component
4. **Import CSS first** in component file
5. **Use TypeScript** for all components
6. **Prefix CSS classes** with component name
7. **Use design tokens** from theme.css
8. **Co-locate related files** in component directory
9. **Add JSDoc comments** for complex components
10. **Keep components focused** (single responsibility)

### ❌ Don'ts

1. ❌ Don't use default exports
2. ❌ Don't import from implementation files directly
3. ❌ Don't hard-code colors/styles
4. ❌ Don't use generic CSS class names
5. ❌ Don't mix component logic with layout logic
6. ❌ Don't create components over 300 lines
7. ❌ Don't skip TypeScript types
8. ❌ Don't forget to add to barrel exports
9. ❌ Don't use inline styles (use CSS)
10. ❌ Don't duplicate code (extract to utilities)

---

## Refactoring Checklist

When extracting logic into a new component:

- [ ] Create component directory with correct naming
- [ ] Move JSX into new component file
- [ ] Define props interface with types
- [ ] Extract relevant CSS to component CSS file
- [ ] Create barrel export (index.ts)
- [ ] Add to central barrel (components/index.ts)
- [ ] Update parent component imports
- [ ] Test component in isolation
- [ ] Document complex props with JSDoc
- [ ] Verify no TypeScript errors

---

## Quick Reference

### File Creation Commands (PowerShell)

```powershell
# Create component directory and files
$name = "StatusPanel"
$dir = "status-panel"

New-Item -ItemType Directory -Path "src/components/$dir"
New-Item -ItemType File -Path "src/components/$dir/index.ts"
New-Item -ItemType File -Path "src/components/$dir/$name.tsx"
New-Item -ItemType File -Path "src/components/$dir/$name.css"
```

### Component Boilerplate (Copy-Paste)

```typescript
// ComponentName.tsx
import "./ComponentName.css";

interface ComponentNameProps {
  // Define props
}

export function ComponentName({}: ComponentNameProps) {
  return <div className="component-name">{/* Component content */}</div>;
}
```

```typescript
// index.ts
export { ComponentName } from "./ComponentName";
```

```css
/* ComponentName.css */
.component-name {
  /* Component styles */
}
```

---

## Resources

### Related Documentation

- **MAPVIEW_ARCHITECTURE.md** - MapView custom hooks architecture
- **CSS_ARCHITECTURE.md** - Styling conventions and patterns
- **DATA_ARCHITECTURE.md** - Data structure and configuration

### External References

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Patterns](https://reactpatterns.com/)
- [BEM Naming Convention](https://getbem.com/)

---

**Last Updated:** October 5, 2025  
**Version:** 1.0
