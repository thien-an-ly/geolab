# CSS Architecture Documentation

## Overview

The project uses a **component-colocated CSS architecture** where each component has its own CSS file in the same directory. Global styles and design tokens are managed centrally.

---

## Current Architecture

### ✅ Implemented Structure

```
src/
├── main.tsx                          # Entry point - imports global CSS
│   ├── theme.css                     # 🎨 Design tokens (CSS variables)
│   └── index.css                     # 📄 Base HTML/reset styles
│
├── App.tsx                           # Root component
│   └── styles.css                    # 🌍 Global layout & utilities
│
└── components/
    ├── navigation/
    │   ├── Navigation.tsx
    │   └── Navigation.css            # ✅ Component-scoped
    │
    ├── control-sidebar/
    │   ├── ControlSidebar.tsx
    │   └── ControlSidebar.css        # ✅ Component-scoped
    │
    ├── dashboard/
    │   ├── Dashboard.tsx
    │   └── Dashboard.css             # ✅ Component-scoped
    │
    ├── bottom-sidebar/
    │   ├── BottomSidebar.tsx
    │   └── BottomSidebar.css         # ✅ Component-scoped
    │
    ├── map-view/
    │   ├── MapView.tsx
    │   └── MapView.css               # ✅ Component-scoped
    │
    ├── time-slider/
    │   ├── TimeSlider.tsx
    │   └── TimeSlider.css            # ✅ Component-scoped
    │
    ├── time-series-chart/
    │   ├── TimeSeriesChart.tsx
    │   └── TimeSeriesChart.css       # ✅ Component-scoped
    │
    ├── legend/
    │   ├── Legend.tsx
    │   └── Legend.css                # ✅ Component-scoped
    │
    └── layer-control/
        ├── LayerControl.tsx
        └── LayerControl.css          # ✅ Component-scoped
```

---

## CSS Import Chain

### 1. Global Styles (main.tsx)

```typescript
import "./theme.css"; // 1️⃣ Design tokens first
import "./index.css"; // 2️⃣ Base HTML/reset styles
import App from "./App.tsx";
```

**Order matters**: Design tokens must be loaded before other styles that reference them.

### 2. App-Level Styles (App.tsx)

```typescript
import "./styles.css"; // Global layout & utilities
```

### 3. Component-Level Styles (Example: MapView.tsx)

```typescript
import "mapbox-gl/dist/mapbox-gl.css"; // External library CSS
import "./MapView.css"; // Component-specific styles
```

---

## File Purposes

### 🎨 `theme.css` - Design System

**Purpose:** Single source of truth for design tokens (CSS variables)

**Contains:**

- Color palette (derived from logo.svg)
- Typography scales
- Spacing system
- Semantic color mappings
- Component-specific tokens

**Key Sections:**

```css
:root {
  /* Primary Brand Colors */
  --color-navy: #213468;
  --color-cyan: #63c9d6;
  --color-medium-blue: #2984b7;

  /* Typography */
  --font-display: "Montserrat", ...;
  --font-body: "Open Sans", ...;

  /* Semantic Colors */
  --color-background-primary: ...;
  --color-text-primary: ...;
  --color-border-primary: ...;
}
```

**Usage in components:**

```css
.component {
  color: var(--color-text-primary);
  background: var(--color-background-panel);
  border: 1px solid var(--color-border-accent);
}
```

---

### 📄 `index.css` - Base Styles

**Purpose:** HTML element resets and foundational typography

**Contains:**

- CSS reset (`*, body, html`)
- Default font settings
- Line heights
- Text rendering optimizations
- Heading defaults

**Example:**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  font-family: system-ui, ...;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

---

### 🌍 `styles.css` - Global Utilities

**Purpose:** Application-wide layout and utility classes

**Contains:**

- Root layout (`#root` flexbox setup)
- Body styles (font-family inheritance from theme)
- Global utilities
- Full-height layout rules

**Example:**

```css
html,
body,
#root {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

body {
  font-family: var(--font-body);
}

#root {
  display: flex;
  flex-direction: column;
}
```

---

### 🧩 Component CSS Files

**Purpose:** Scoped styles for individual components

**Pattern:**

```
ComponentName.tsx
ComponentName.css  ← Same directory, same name
```

**Import Convention:**

```typescript
// In ComponentName.tsx
import "./ComponentName.css";

export function ComponentName() { ... }
```

**Guidelines:**

- Use design tokens from `theme.css`
- Avoid global class names (scope to component)
- Keep selectors shallow (avoid deep nesting)
- Comment complex layouts

**Example (Navigation.css):**

```css
.navigation {
  background: var(--color-background-secondary);
  border-bottom: 2px solid var(--color-border-accent);
  padding: 1rem 2rem;
}

.navigation__logo {
  height: 40px;
  width: auto;
}

.navigation__title {
  color: var(--color-text-primary);
  font-family: var(--font-display);
}
```

---

## CSS Architecture Principles

### 1. **Component Colocation** ✅

CSS lives next to the component that uses it.

**Benefits:**

- Easy to find and update styles
- Clear ownership
- Better maintainability
- Can delete component + CSS together

### 2. **Design Tokens** ✅

Use CSS variables from `theme.css` instead of hard-coded values.

```css
/* ❌ BAD - Hard-coded */
.button {
  background: #213468;
  color: #63c9d6;
}

/* ✅ GOOD - Design tokens */
.button {
  background: var(--color-navy);
  color: var(--color-cyan);
}
```

### 3. **Cascade Hierarchy** ✅

```
theme.css (design tokens)
    ↓
index.css (HTML resets)
    ↓
styles.css (global utilities)
    ↓
Component CSS (scoped styles)
```

### 4. **No CSS Modules** ℹ️

Currently using **plain CSS** with manual scoping via naming conventions.

**Future consideration:** Migrate to CSS Modules for automatic scoping:

```typescript
import styles from "./Component.module.css";
<div className={styles.container} />;
```

---

## Naming Conventions

### Current Pattern: BEM-inspired

```css
/* Block */
.navigation {
}

/* Block__Element */
.navigation__logo {
}
.navigation__title {
}

/* Block--Modifier */
.navigation--collapsed {
}

/* Block__Element--Modifier */
.navigation__title--highlighted {
}
```

### Guidelines

1. **Use descriptive class names**

   - `.map-container` not `.mc`
   - `.legend-item` not `.li`

2. **Avoid generic names**

   - `.sidebar-header` not `.header`
   - `.map-controls` not `.controls`

3. **Prefix component-specific classes**

   ```css
   /* In MapView.css */
   .mapview-container {
   }
   .mapview-controls {
   }
   ```

4. **Use kebab-case**
   - `.control-sidebar` not `.controlSidebar`
   - `.time-slider` not `.timeSlider`

---

## Common Patterns

### Layout Containers

```css
.component-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-background-primary);
}
```

### Overlays & Panels

```css
.panel {
  background: var(--color-background-panel);
  border: 1px solid var(--color-border-primary);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px var(--color-shadow-default);
}
```

### Interactive Elements

```css
.button {
  background: var(--color-button-primary);
  color: var(--color-text-primary);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.button:hover {
  background: var(--color-button-primary-hover);
}
```

### Scrollable Areas

```css
.scrollable {
  overflow-y: auto;
  max-height: 400px;
}

.scrollable::-webkit-scrollbar {
  width: 8px;
}

.scrollable::-webkit-scrollbar-thumb {
  background: var(--color-border-primary);
  border-radius: 4px;
}
```

---

## External CSS Dependencies

### Mapbox GL JS

```typescript
// In MapView.tsx
import "mapbox-gl/dist/mapbox-gl.css";
```

**Purpose:** Mapbox controls, markers, popups styling

**Customization:** Override in `MapView.css`:

```css
/* Customize Mapbox controls */
.mapboxgl-ctrl-group {
  background: var(--color-background-panel) !important;
  border: 1px solid var(--color-border-primary) !important;
}
```

---

## Performance Considerations

### Load Order Optimization

1. **Critical CSS first** (theme.css, index.css)
2. **Layout CSS second** (styles.css)
3. **Component CSS on-demand** (bundled with component)

### Vite Bundling

Vite automatically:

- ✅ Bundles CSS with components
- ✅ Tree-shakes unused CSS
- ✅ Minifies in production
- ✅ Generates source maps

### Best Practices

1. **Avoid @import in CSS** (use TypeScript imports instead)
2. **Keep selectors shallow** (max 3 levels deep)
3. **Use CSS variables** (browser-native, no runtime cost)
4. **Minimize specificity wars** (avoid `!important`)

---

## Development Workflow

### Adding a New Component

1. Create component directory:

   ```
   src/components/my-component/
   ```

2. Create files:

   ```
   MyComponent.tsx
   MyComponent.css
   index.ts (re-export)
   ```

3. Import CSS in component:

   ```typescript
   import "./MyComponent.css";
   ```

4. Use design tokens:
   ```css
   .my-component {
     background: var(--color-background-panel);
   }
   ```

### Modifying Styles

1. **Component-specific?** → Edit `ComponentName.css`
2. **Global utility?** → Add to `styles.css`
3. **Design token?** → Update `theme.css`
4. **HTML reset?** → Modify `index.css`

### Debugging Styles

**Browser DevTools:**

```
1. Inspect element
2. Check "Computed" tab for final values
3. Check "Styles" tab for source file
4. Look for CSS variable values in :root
```

**Common Issues:**

- Specificity conflicts → Use more specific selector
- Variable not defined → Check `theme.css` import order
- Style not applying → Check CSS import in component

---

## Testing Styles

### Visual Regression Testing (Future)

Consider adding:

- Chromatic (Storybook)
- Percy
- Playwright screenshots

### Manual Testing Checklist

- [ ] Light/dark mode (if applicable)
- [ ] Responsive breakpoints
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Print styles (if needed)
- [ ] Color contrast (accessibility)

---

## Maintenance

### Regular Audits

1. **Unused CSS**

   - Search for class names in `.tsx` files
   - Remove if no matches found

2. **Duplicate Styles**

   - Extract common patterns to `styles.css`
   - Create shared utility classes

3. **Design Token Consistency**
   - Ensure all colors come from `theme.css`
   - No hard-coded hex values in component CSS

### Refactoring Strategy

**When to extract:**

- Style used in 3+ components → Move to `styles.css`
- Color used in 2+ files → Add to `theme.css`
- Complex selector → Simplify or add comment

**When to inline:**

- One-off styles → Keep in component CSS
- Highly specific → Don't over-generalize

---

## Future Enhancements

### Potential Improvements

1. **CSS Modules**

   ```typescript
   import styles from "./Component.module.css";
   <div className={styles.container} />;
   ```

   **Benefits:** Automatic scoping, type safety

2. **Tailwind CSS**

   - Utility-first approach
   - Smaller bundle sizes
   - Faster development

3. **CSS-in-JS** (Styled Components, Emotion)

   - Dynamic styles
   - Theme context
   - TypeScript integration

4. **Design System Library**
   - Shared component library
   - Documented patterns
   - Storybook integration

---

## Troubleshooting

### Styles Not Applying

**Check:**

1. CSS import in component? (`import "./Component.css"`)
2. Class name typo? (Check DevTools)
3. Specificity conflict? (More specific selector needed)
4. CSS variable defined? (Check `:root` in theme.css)

### Variable Not Found

```css
/* ❌ Variable undefined */
color: var(--color-doesnt-exist);

/* ✅ Check theme.css */
:root {
  --color-doesnt-exist: #000; /* Add if missing */
}
```

### Import Order Issues

```typescript
// ❌ BAD - Component CSS before theme
import "./Component.css";
import "./theme.css";

// ✅ GOOD - Theme loaded in main.tsx first
// main.tsx imports theme.css
// Component imports Component.css
```

---

## Summary

### Architecture Strengths

✅ **Colocated styles** - Easy to find and maintain  
✅ **Design tokens** - Consistent theming  
✅ **Modular** - Each component self-contained  
✅ **Scalable** - Easy to add new components  
✅ **Type-safe** (with future CSS Modules)

### Key Principles

1. **Global first** - Load theme.css and index.css in main.tsx
2. **Component scoped** - Each component has its own CSS
3. **Use tokens** - Reference design system variables
4. **Keep simple** - Avoid over-engineering
5. **Stay consistent** - Follow naming conventions

---

**Last Updated:** October 5, 2025  
**Status:** ✅ Production architecture - fully implemented

### Phase 1: Component-Level CSS Extraction (High Priority)

#### 1. **Dashboard.css**

Extract dashboard-specific styles from `style.css`:

```css
/* Move these classes: */
- #dashboard
- .dashboard-content
- .dashboard-section
- .dashboard-section h2/h3/p/ul/li/strong
```

**Location**: `src/components/Dashboard.css`  
**Import in**: `src/components/Dashboard.tsx`  
**Lines to extract**: ~60 lines from style.css

---

#### 2. **Sidebar.css** (Feature Details Sidebar)

Extract the right-side feature details sidebar:

```css
/* Move these classes: */
- #sidebar
- #sidebar h3
- #sidebar table
- #sidebar td
- #closeSidebar
```

**Location**: `src/components/Sidebar.css`  
**Import in**: `src/components/Sidebar.tsx`  
**Lines to extract**: ~40 lines from style.css

---

#### 3. **MapView.css**

Extract map container and Mapbox control customizations:

```css
/* Move these classes: */
- #map
- .mapboxgl-ctrl-top-left
- .mapboxgl-ctrl-bottom-right
- .mapboxgl-ctrl-group
- .mapboxgl-ctrl-icon
```

**Location**: `src/components/MapView.css`  
**Import in**: `src/components/MapView.tsx`  
**Lines to extract**: ~30 lines from style.css

---

#### 4. **Legend.css** (Legacy - if needed)

The old standalone legend styles:

```css
/* Move these classes: */
- #leftPanel
- #leftPanel strong
- .legend-section
- .legend-color
- .circle-legend
- .circle-sample
```

**Location**: `src/components/Legend.css`  
**Status**: May be obsolete since legend is now in ControlSidebar  
**Action**: Keep for reference or delete if fully migrated

---

#### 5. **LayerControl.css** (Legacy - if needed)

The old layer control panel styles:

```css
/* Move these classes: */
- #toggleLayersPanel
- .collapsible-section
- .collapsible-header
- .collapsible-content
```

**Location**: `src/components/LayerControl.css`  
**Status**: May be obsolete since controls are now in ControlSidebar  
**Action**: Keep for reference or delete if fully migrated

---

### Phase 2: Create Layout CSS Files (Medium Priority)

#### 6. **base.css**

Global HTML element resets and base typography:

```css
/* Include: */
- body
- html
- *, *::before, *::after
- h1, h2, h3, h4, h5, h6
- p, ul, ol, li
- a, button
```

**Location**: `src/styles/base.css`  
**Purpose**: Foundation styles that apply globally

---

#### 7. **utilities.css**

Reusable utility classes:

```css
/* Include: */
.flex-center .flex-between .text-truncate .visually-hidden .no-scroll .fade-in;
```

**Location**: `src/styles/utilities.css`  
**Purpose**: Single-purpose utility classes for quick styling

---

### Phase 3: Organize by Concern (Low Priority, Future Enhancement)

#### 8. **animations.css**

All keyframe animations and transitions:

```css
@keyframes fadeIn {
  ...;
}
@keyframes slideIn {
  ...;
}
@keyframes pulse {
  ...;
}
```

**Location**: `src/styles/animations.css`

---

#### 9. **scrollbar.css**

Custom scrollbar styles (reusable across components):

```css
.custom-scrollbar::-webkit-scrollbar {
  ...;
}
```

**Location**: `src/styles/scrollbar.css`

---

## 📁 Proposed Final Structure

```
src/
├── styles/
│   ├── colors.css              # Design tokens (colors, fonts, spacing)
│   ├── base.css                # Global HTML/body/reset styles
│   ├── utilities.css           # Utility classes
│   ├── animations.css          # Keyframes and transitions
│   └── scrollbar.css           # Reusable scrollbar styles
│
├── components/
│   ├── Navigation/
│   │   ├── Navigation.tsx
│   │   └── Navigation.css
│   │
│   ├── ControlSidebar/
│   │   ├── ControlSidebar.tsx
│   │   └── ControlSidebar.css
│   │
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   └── Dashboard.css
│   │
│   ├── Sidebar/
│   │   ├── Sidebar.tsx
│   │   └── Sidebar.css
│   │
│   ├── MapView/
│   │   ├── MapView.tsx
│   │   └── MapView.css
│   │
│   ├── Legend/               # (Optional - legacy)
│   │   ├── Legend.tsx
│   │   └── Legend.css
│   │
│   └── LayerControl/         # (Optional - legacy)
│       ├── LayerControl.tsx
│       └── LayerControl.css
│
├── index.css                   # Imports all global styles
├── main.tsx
└── App.tsx
```

---

## 🔧 Implementation Order

### **Immediate Next Steps** (Highest Impact)

1. ✅ **ControlSidebar.css** - DONE!
2. 🎯 **Dashboard.css** - Extract now (clean separation)
3. 🎯 **Sidebar.css** - Extract now (used in map view)
4. 🎯 **MapView.css** - Extract now (Mapbox customizations)

### **Quick Wins** (Can be done in parallel)

5. Create `src/styles/base.css` - Move body, html resets
6. Create `src/styles/animations.css` - Move @keyframes
7. Update `index.css` to import all global styles

### **Future Improvements**

8. Consolidate utilities into `utilities.css`
9. Create component folders (Navigation/, Dashboard/, etc.)
10. Delete legacy components (Legend, LayerControl) if no longer used

---

## 🎨 CSS Import Strategy

### Current Pattern (Good!)

```tsx
// Component-scoped CSS
import "./ComponentName.css";

// In ComponentName.tsx
export default function ComponentName() { ... }
```

### Global CSS Import Chain

```tsx
// main.tsx
import "./styles/colors.css"; // 1. Design tokens first
import "./styles/base.css"; // 2. Base HTML styles
import "./styles/utilities.css"; // 3. Utility classes
import "./styles/animations.css"; // 4. Keyframes
import "./index.css"; // 5. Legacy global styles
import App from "./App.tsx";
```

---

## 📊 Size Reduction Estimates

| File               | Current Size | After Extraction | Reduction   |
| ------------------ | ------------ | ---------------- | ----------- |
| style.css          | ~350 lines   | ~80 lines        | **77%**     |
| ControlSidebar.css | 0            | ~270 lines       | New file ✅ |
| Dashboard.css      | 0            | ~60 lines        | New file 🎯 |
| Sidebar.css        | 0            | ~40 lines        | New file 🎯 |
| MapView.css        | 0            | ~30 lines        | New file 🎯 |

**Total Improvement**: From 1 monolithic file → 5+ focused, maintainable modules

---

## 🚀 Benefits of This Architecture

1. **Component Co-location**: CSS lives next to the component that uses it
2. **Better Maintainability**: Easy to find and update styles
3. **Reduced Cognitive Load**: Smaller files are easier to understand
4. **Better Performance**: Only load CSS needed for active components
5. **Easier Collaboration**: Multiple developers can work on different components
6. **Scalability**: Easy to add new components without bloating global styles
7. **Reusability**: Shared utilities and design tokens in dedicated files

---

## 🔍 Quick Reference Commands

### Check style.css size (PowerShell)

```powershell
(Get-Content "d:\Coding\Projects\Git\GeoLab\src\style.css" | Measure-Object -Line).Lines
```

### Find unused CSS classes (manual audit)

1. Search for class name in all `.tsx` files
2. If no results, mark for deletion
3. Document in `CSS_CLEANUP.md`

---

## 📝 Notes

- Keep `colors.css` as the single source of truth for design tokens
- Use CSS variables extensively for consistency
- Follow BEM or similar naming convention for new classes
- Consider CSS Modules for component-scoped styles (future enhancement)
- Document any breaking changes in component README files

---

**Last Updated**: October 4, 2025  
**Status**: Phase 1 in progress (ControlSidebar.css ✅ completed)
