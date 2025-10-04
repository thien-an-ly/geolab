# Kakadu Wetlands Sentinel - Copilot Instructions

## Project Overview

Kakadu Wetlands Sentinel is a static web-based visualization tool for classifying ecological indicators and exploring their correlation with carbon degradation in Australia's Kakadu National Park.

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

## Project Status

✅ Project successfully scaffolded
✅ Vite + React + TypeScript setup complete
✅ Mapbox GL JS and Recharts installed
✅ Core components created (MapView, TimeSeriesChart, LayerControl)
✅ Mock data and type definitions in place
✅ Development server running on http://localhost:5173

## Next Steps

1. Add your Mapbox access token in `src/components/MapView.tsx`
2. Replace mock data with actual satellite data preprocessing
3. Implement real-time data fetching from Landsat and Sentinel APIs
4. Add authentication if needed for data access
5. Deploy to static hosting (Netlify, Vercel, GitHub Pages)

## Component Structure

- `MapView.tsx` - Mapbox geospatial visualization with Kakadu bounds
- `TimeSeriesChart.tsx` - Recharts time-series for NDVI, flood/drought signals
- `LayerControl.tsx` - Toggle visibility of map layers
- `types/index.ts` - TypeScript interfaces for ecological data
- `utils/mockData.ts` - Sample time-series data for testing
