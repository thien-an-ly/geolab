# CSS Architecture Recommendations

## Kakadu Wetlands Sentinel

### ✅ Current State (After Refactoring)

```
src/
├── colors.css                    # Design tokens & variables
├── index.css                     # Global base styles
├── style.css                     # Legacy global styles (to be broken down)
└── components/
    ├── Navigation.css            # ✅ Modular
    └── ControlSidebar.css        # ✅ Modular (just created!)
```

---

## 🎯 Recommended CSS Modularization Strategy

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
