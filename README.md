# 🌿 Kakadu Wetlands Sentinel

A static web-based visualization tool for classifying ecological indicators and exploring their correlation with carbon degradation in Australia's Kakadu National Park.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?logo=mapbox&logoColor=white)

## 🎯 Overview

Kakadu Wetlands Sentinel simplifies complex Earth observation data into interpretable visuals that support early-stage environmental analysis. By highlighting potential links between wetland dynamics and carbon loss, the project encourages further exploration into climate-sensitive ecosystems.

Built with modern React patterns, custom hooks architecture, and comprehensive TypeScript type safety, this project demonstrates best practices for geospatial web applications.

### Key Features

- **📊 Satellite Data Visualization**: NDVI from Landsat for vegetation health monitoring
- **💧 Hydrological Analysis**: Flood/drought signals from Sentinel-1 SAR
- **🌲 Ecological Classification**: Mangrove zones, degraded forests, and hydrological shifts
- **📈 Time-Series Analysis**: Interactive charts for seasonal trend tracking
- **⚠️ Carbon Loss Correlation**: Analysis using Sentinel-5P and IPCC coefficients
- **🎛️ Interactive Controls**: Layer visibility toggles, time slider, and dynamic data loading
- **🏗️ Modern Architecture**: Custom hooks, type-safe patterns, and race-condition-free data loading

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm 10+
- Mapbox access token ([Get one here](https://account.mapbox.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd GeoLab
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add your Mapbox token**

   Open `src/components/map-view/MapView.tsx` and replace `YOUR_MAPBOX_TOKEN` with your actual Mapbox access token:

   ```typescript
   mapboxgl.accessToken = "your_actual_token_here";
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   Or use the VS Code task: Press `Ctrl+Shift+B` and select "Dev Server"

5. **Open in browser**

   Navigate to `http://localhost:5173`

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[COMPONENT_ARCHITECTURE.md](docs/COMPONENT_ARCHITECTURE.md)** - Component structure conventions, naming patterns, and how to add new components
- **[MAPVIEW_ARCHITECTURE.md](docs/MAPVIEW_ARCHITECTURE.md)** - MapView custom hooks architecture, data flow, and race condition prevention
- **[CSS_ARCHITECTURE.md](docs/CSS_ARCHITECTURE.md)** - Styling conventions, design tokens, and BEM-inspired naming
- **[DATA_ARCHITECTURE.md](docs/DATA_ARCHITECTURE.md)** - Data sources configuration, GeoJSON format, and how to add new datasets

**New to the project?** Start with [COMPONENT_ARCHITECTURE.md](docs/COMPONENT_ARCHITECTURE.md) to understand the codebase structure.

## 🏗️ Project Structure

```
GeoLab/
├── docs/                        # Comprehensive documentation
│   ├── COMPONENT_ARCHITECTURE.md
│   ├── MAPVIEW_ARCHITECTURE.md
│   ├── CSS_ARCHITECTURE.md
│   └── DATA_ARCHITECTURE.md
├── src/
│   ├── components/              # React components (kebab-case directories)
│   │   ├── bottom-sidebar/      # Bottom panel with time-series charts
│   │   ├── control-sidebar/     # Right panel with controls
│   │   ├── dashboard/           # Main dashboard layout
│   │   ├── layer-control/       # Map layer visibility toggles
│   │   ├── legend/              # Map legend component
│   │   ├── map-view/            # Mapbox geospatial visualization
│   │   ├── navigation/          # Top navigation bar
│   │   ├── time-series-chart/   # Recharts time-series display
│   │   ├── time-slider/         # Year selection slider
│   │   └── index.ts             # Central barrel export
│   ├── hooks/                   # Custom React hooks
│   │   ├── useInitMap.ts        # Map initialization hook
│   │   ├── useLayerDataUpdate.ts    # Data loading hook
│   │   ├── useLayerVisibility.ts    # Layer toggle hook
│   │   ├── useLayerClickHandlers.ts # Event handlers hook
│   │   └── index.ts             # Hooks barrel export
│   ├── config/                  # Configuration files
│   │   └── dataSources.ts       # Centralized data sources config
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # Global type definitions
│   ├── utils/                   # Utility functions
│   │   ├── layerHelpers.ts      # Map layer utilities
│   │   └── mockData.ts          # Mock data generators
│   ├── theme.css                # Design tokens (CSS variables)
│   ├── index.css                # Global reset styles
│   ├── styles.css               # Global utility styles
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Application entry point
├── public/
│   └── data/                    # GeoJSON datasets
│       ├── flood/               # Flood data by year
│       └── mangrove/            # Mangrove zone data
└── package.json
```

### Architecture Highlights

- **Custom Hooks Pattern**: MapView logic split into focused, reusable hooks
- **Barrel Exports**: Clean imports via `index.ts` files (e.g., `import { MapView } from "./components"`)
- **Type Safety**: Full TypeScript coverage with non-null guarantees
- **Race Condition Prevention**: Sync lock pattern ensures data loads before event handlers attach
- **Design Tokens**: CSS variables in `theme.css` for consistent styling
- **Component Colocation**: Each component has `.tsx`, `.css`, and `index.ts` in its directory

## 📦 Tech Stack

- **Frontend Framework**: React 19 with TypeScript 5
- **Build Tool**: Vite 6
- **Mapping**: Mapbox GL JS 3.8 with react-map-gl
- **Charts**: Recharts 2.15
- **Data Format**: GeoJSON for geospatial data
- **Styling**: CSS Modules with design tokens
- **Data Sources**: Landsat (NDVI), Sentinel-1 (SAR), Sentinel-5P (Carbon)

## 🎨 Development Principles

- **Simplicity**: Focus on clarity over complexity
- **Portability**: Easy to deploy and use
- **Minimalism**: Clean, interpretable UI
- **Visualization**: Show correlations, not models
- **Type Safety**: Comprehensive TypeScript with non-null guarantees
- **Single Responsibility**: Each hook and component has one clear purpose
- **Documentation**: Extensive inline docs and architecture guides

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🗺️ Data Sources

The application visualizes geospatial data from multiple sources:

- **NDVI** (Normalized Difference Vegetation Index) from Landsat
- **Flood/Drought Signals** from Sentinel-1 SAR
- **Mangrove Zones** and degraded forest classification
- **Carbon Loss Estimates** using Sentinel-5P and IPCC coefficients

### Adding New Data

1. Place GeoJSON files in `public/data/`
2. Add data source configuration to `src/config/dataSources.ts`
3. Map layer utilities automatically handle source/layer creation

See [DATA_ARCHITECTURE.md](docs/DATA_ARCHITECTURE.md) for detailed instructions on adding and configuring new datasets.

_Note: Currently using test/sample data. Replace with actual satellite data preprocessing pipeline._

## 🌏 About Kakadu National Park

Kakadu National Park is a climate-sensitive ecosystem in Australia's Northern Territory, known for its unique wetlands, mangrove forests, and rich biodiversity. This tool aims to support environmental monitoring and conservation efforts.

## 🤝 Contributing

This project was developed with a focus on accessibility and educational value. Contributions that enhance data interpretation, add new visualization types, or improve performance are welcome.

### Before Contributing

1. Read the documentation in `docs/` to understand the architecture
2. Follow the component conventions outlined in [COMPONENT_ARCHITECTURE.md](docs/COMPONENT_ARCHITECTURE.md)
3. Ensure TypeScript compilation passes: `npm run build`
4. Run linting: `npm run lint`

### Adding New Components

See the step-by-step guide in [COMPONENT_ARCHITECTURE.md](docs/COMPONENT_ARCHITECTURE.md#step-by-step-creating-a-new-component) for detailed instructions on creating new components that follow project conventions.

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Earth observation data from ESA Copernicus and NASA
- IPCC for carbon estimation coefficients
- Traditional owners of Kakadu National Park

## 🔧 Architecture Patterns

### Custom Hooks

MapView logic is refactored into focused custom hooks:

- **`useInitMap`**: Provides map instance and initialization status
- **`useLayerDataUpdate`**: Handles all GeoJSON data loading (initial + year changes)
- **`useLayerVisibility`**: Manages layer visibility toggles
- **`useLayerClickHandlers`**: Attaches event handlers after data loads

See [MAPVIEW_ARCHITECTURE.md](docs/MAPVIEW_ARCHITECTURE.md) for detailed data flow and race condition prevention strategies.

### Sync Lock Pattern

The app uses a `dataLoaded` flag to coordinate async operations:

```typescript
const { map, initialized } = useInitMap();
const { dataLoaded } = useLayerDataUpdate({ map, initialized, currentYear });
useLayerClickHandlers({ map, dataLoaded }); // Only runs after data loads
```

This prevents race conditions where event handlers attach before map layers exist.

---

Built with ❤️ for environmental conservation
