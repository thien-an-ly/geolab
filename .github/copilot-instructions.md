# Project GeoLab - Copilot Instructions

## Project Overview

Project GeoLab is a static web-based visualization tool for classifying ecological indicators and exploring their correlation with carbon degradation in Australia's Kakadu National Park.

## Tech Stack

- TypeScript
- React
- Vite (build tool)
- Mapbox GL JS (geospatial visualization)
- Python (for data preprocessing)

## Key Features

- Satellite-derived data visualization (NDVI from Landsat)
- Flood/drought signals from Sentinel-1 SAR
- Mangrove zones, degraded forests, and hydrological shifts classification
- Time-series line charts for seasonal trends
- Carbon loss correlation analysis (Sentinel-5P and IPCC coefficients)

## Development Principles

- Simplicity and clarity over complexity
- Portability and ease of usage
- Minimalism and interpretability in UI
- Focus on visualizing correlations rather than modeling them

## Communication Guidelines

- **Do NOT create documentation files** (e.g., `.md` files in `docs/`) unless explicitly requested
- **Keep summaries brief** - focus on what was changed, not extensive explanations
- Only provide detailed explanations when asked

## Architecture Documentation

**IMPORTANT:** Always refer to existing documentation before making architectural changes:

1. **`docs/MAPVIEW_ARCHITECTURE.md`** - Complete MapView component architecture

   - Custom hooks design patterns
   - Data flow and initialization order
   - Race condition prevention strategies
   - Dependency management rules
   - Type safety guarantees

2. **`docs/MAP_ARCHITECTURE.md`** - Map layer system and data sources

   - Centralized data source configuration
   - Layer management utilities
   - Adding new data sources

3. **`docs/CSS_ARCHITECTURE.md`** - Styling conventions and patterns

### Architectural Guidelines

- **Before proposing changes:** Review relevant documentation to understand existing patterns
- **When deviating from established norms:**
  - Clearly explain the rationale for the change
  - Discuss trade-offs and impacts
  - Seek user confirmation before implementing
- **Preserve guarantees:** Maintain type safety and race condition prevention patterns
- **Document changes:** Update relevant docs when architecture evolves

## Project Status

✅ Project successfully scaffolded
✅ Vite + React + TypeScript setup complete
✅ Mapbox GL JS and Recharts installed
✅ Core components refactored into custom hooks architecture
✅ Race-condition-free data loading with sync locks
✅ Type-safe map layer management
✅ Development server running on http://localhost:5173

## Component Structure

### Core Architecture

- `MapView.tsx` - Orchestrates map initialization and layer management
- `useInitMap` - Provides map instance and initialization status
- `useLayerDataUpdate` - Handles all GeoJSON data loading/updates
- `useLayerVisibility` - Manages layer visibility toggles
- `useLayerClickHandlers` - Attaches event handlers after data loads

### Supporting Components

- `TimeSeriesChart.tsx` - Recharts time-series for NDVI, flood/drought signals
- `LayerControl.tsx` - Toggle visibility of map layers
- `types/index.ts` - TypeScript interfaces for ecological data
- `config/dataSources.ts` - Centralized data source configuration
- `utils/mapLayerUtils.ts` - Reusable map layer operations

## Coding Standards

### React Hooks

- **Single responsibility:** Each hook has one clear purpose
- **Dependency arrays:** Only include values that should trigger the effect
- **Early return guards:** Check prerequisites before executing logic
- **Include guard dependencies:** If a value is used in an early return, include it in deps
- **Cleanup functions:** Always return cleanup for side effects

### Type Safety

- Use non-null types (`Map`) when runtime guarantees exist (enforced by flags)
- Use nullable types (`Map | null`) when no guarantee exists
- Assert non-null (`map!`) only when architectural guarantees are documented

### Example Pattern

```typescript
useEffect(() => {
  if (!initialized) return; // Early guard
  // ... work ...
  return () => {
    // ... cleanup ...
  };
}, [initialized, triggerValue]); // Include guard value + trigger
```
