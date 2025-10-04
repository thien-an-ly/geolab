# 🌿 Kakadu Wetlands Sentinel

A static web-based visualization tool for classifying ecological indicators and exploring their correlation with carbon degradation in Australia's Kakadu National Park.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-000000?logo=mapbox&logoColor=white)

## 🎯 Overview

Kakadu Wetlands Sentinel simplifies complex Earth observation data into interpretable visuals that support early-stage environmental analysis. By highlighting potential links between wetland dynamics and carbon loss, the project encourages further exploration into climate-sensitive ecosystems.

### Key Features

- **📊 Satellite Data Visualization**: NDVI from Landsat for vegetation health monitoring
- **💧 Hydrological Analysis**: Flood/drought signals from Sentinel-1 SAR
- **🌲 Ecological Classification**: Mangrove zones, degraded forests, and hydrological shifts
- **📈 Time-Series Analysis**: Interactive charts for seasonal trend tracking
- **⚠️ Carbon Loss Correlation**: Analysis using Sentinel-5P and IPCC coefficients

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

   Open `src/components/MapView.tsx` and replace `YOUR_MAPBOX_TOKEN` with your actual Mapbox access token:

   ```typescript
   mapboxgl.accessToken = "your_actual_token_here";
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**

   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
GeoLab/
├── src/
│   ├── components/          # React components
│   │   ├── MapView.tsx     # Mapbox geospatial visualization
│   │   ├── TimeSeriesChart.tsx  # Recharts time-series display
│   │   └── LayerControl.tsx     # Map layer toggle controls
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions and mock data
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
└── package.json
```

## 📦 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Mapping**: Mapbox GL JS
- **Charts**: Recharts
- **Data Sources**: Landsat (NDVI), Sentinel-1 (SAR), Sentinel-5P (Carbon)

## 🎨 Development Principles

- **Simplicity**: Focus on clarity over complexity
- **Portability**: Easy to deploy and use
- **Minimalism**: Clean, interpretable UI
- **Visualization**: Show correlations, not models

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🗺️ Data Sources

The application visualizes:

- **NDVI** (Normalized Difference Vegetation Index) from Landsat
- **Flood/Drought Signals** from Sentinel-1 SAR
- **Mangrove Zones** and degraded forest classification
- **Carbon Loss Estimates** using Sentinel-5P and IPCC coefficients

_Note: Currently using mock data. Replace with actual satellite data preprocessing pipeline._

## 🌏 About Kakadu National Park

Kakadu National Park is a climate-sensitive ecosystem in Australia's Northern Territory, known for its unique wetlands, mangrove forests, and rich biodiversity. This tool aims to support environmental monitoring and conservation efforts.

## 🤝 Contributing

This project was developed with a focus on accessibility and educational value. Contributions that enhance data interpretation, add new visualization types, or improve performance are welcome.

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Earth observation data from ESA Copernicus and NASA
- IPCC for carbon estimation coefficients
- Traditional owners of Kakadu National Park

---

Built with ❤️ for environmental conservation

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
