# Quick Start: Adding New Datasets

## Simple 4-Step Process

### 1️⃣ Add your GeoJSON file

```
public/data/YourData.geojson
```

### 2️⃣ Configure in `src/config/dataSources.ts`

```typescript
{
  id: "your-data",
  name: "Your Dataset Name",
  layerType: "yourtype",
  dataUrl: "/data/YourData.geojson",
  style: {
    fillColor: "#FF6B6B",
    fillOpacity: 0.5,
    lineColor: "#C92A2A",
    lineWidth: 2,
  },
}
```

### 3️⃣ Update types in `src/types/index.ts`

```typescript
type: "mangrove" | "forest" | "water" | "carbon" | "gain" | "loss" | "yourtype";
```

### 4️⃣ Add to layer control in `src/App.tsx`

```typescript
{ id: "your", name: "Your Dataset", visible: true, type: "yourtype" }
```

**Done!** Your data will automatically load and render on the map. 🎉

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      App.tsx                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Layer State: [                                  │   │
│  │   { id: "gain", visible: true, type: "gain" }  │   │
│  │   { id: "loss", visible: true, type: "loss" }  │   │
│  │ ]                                                │   │
│  └──────────────────────┬──────────────────────────┘   │
└─────────────────────────┼────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    MapView.tsx                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │ useMapLayers(layers)                             │ │
│  │   ├─ Combines layer state with data configs     │ │
│  │   └─ Returns: layersWithVisibility               │ │
│  └──────────────────────┬───────────────────────────┘ │
│                         │                              │
│  ┌──────────────────────▼───────────────────────────┐ │
│  │ {layersWithVisibility.map(config => (           │ │
│  │   <GeoJSONLayer config={config} visible={...}   │ │
│  │ ))}                                              │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────┬────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              GeoJSONLayer.tsx (×N instances)            │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 1. Fetch GeoJSON from config.dataUrl            │ │
│  │ 2. Add Mapbox source                             │ │
│  │ 3. Add fill + line layers                        │ │
│  │ 4. Apply styling from config                     │ │
│  │ 5. Toggle visibility when prop changes           │ │
│  │ 6. Cleanup on unmount                            │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│           config/dataSources.ts (Config)                │
│  ┌───────────────────────────────────────────────────┐ │
│  │ DATA_SOURCES = [                                 │ │
│  │   { id, name, layerType, dataUrl, style, ... }, │ │
│  │   { id, name, layerType, dataUrl, style, ... }, │ │
│  │ ]                                                 │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Before vs After

### ❌ Before (Monolithic)

```typescript
// MapView.tsx - 150+ lines
useEffect(() => {
  // Manual loading for dataset 1
  fetch("/data/TestGain.geojson")
    .then(res => res.json())
    .then(data => {
      map.addSource("gain-source", { type: "geojson", data });
      map.addLayer({ id: "gain-fill", ... });
      map.addLayer({ id: "gain-outline", ... });
    });

  // Manual loading for dataset 2
  fetch("/data/TestLoss.geojson")
    .then(res => res.json())
    .then(data => {
      map.addSource("loss-source", { type: "geojson", data });
      map.addLayer({ id: "loss-fill", ... });
      map.addLayer({ id: "loss-outline", ... });
    });

  // ... repeat for every dataset
}, [isLoaded]);

useEffect(() => {
  // Manual visibility management
  layers.forEach(layer => {
    if (layer.type === "gain") {
      map.setLayoutProperty("gain-fill", "visibility", ...);
      map.setLayoutProperty("gain-outline", "visibility", ...);
    }
    if (layer.type === "loss") {
      map.setLayoutProperty("loss-fill", "visibility", ...);
      map.setLayoutProperty("loss-outline", "visibility", ...);
    }
    // ... repeat for every dataset
  });
}, [layers]);
```

### ✅ After (Modular)

```typescript
// MapView.tsx - 40 lines
export default function MapView({ layers }: MapViewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const mapLayersWithVisibility = useMapLayers(layers);

  return (
    <Map {...mapProps}>
      {isLoaded && mapLayersWithVisibility.map(config => (
        <GeoJSONLayer key={config.id} config={config} visible={config.visible} />
      ))}
    </Map>
  );
}

// dataSources.ts - Just add config
{ id: "new", name: "New", layerType: "new", dataUrl: "/data/New.geojson", ... }
```

---

## Real-World Example

Let's say you receive new mangrove data. Here's how you add it:

### File: `public/data/Mangroves2025.geojson`

```json
{
  "type": "FeatureCollection",
  "features": [...]
}
```

### Config: `src/config/dataSources.ts`

```typescript
{
  id: "mangrove-2025",
  name: "Mangrove Zones 2025",
  layerType: "mangrove",
  dataUrl: "/data/Mangroves2025.geojson",
  style: {
    fillColor: "#2E7D32",     // Dark green
    fillOpacity: 0.5,
    lineColor: "#1B5E20",     // Darker green
    lineWidth: 1.5,
  },
  metadata: {
    description: "Mangrove coverage areas identified via Sentinel-2",
    year: "2025",
    source: "Sentinel-2 MSI L2A",
  },
}
```

### Type: `src/types/index.ts`

```typescript
// Add "mangrove" if not already present
type: "mangrove" | "forest" | "water" | "carbon" | "gain" | "loss";
```

### UI: `src/App.tsx`

```typescript
const [layers, setLayers] = useState<MapLayer[]>([
  {
    id: "mangrove",
    name: "Mangrove Zones 2025",
    visible: true,
    type: "mangrove",
  },
  // ... other layers
]);
```

**Result:** Mangrove zones appear on the map in dark green with a toggle control. Total time: ~2 minutes!

---

## Tips & Best Practices

### 🎨 Color Schemes

Use semantic colors that match the data:

- 🟢 Green: Vegetation gain, healthy areas
- 🔴 Red: Vegetation loss, degraded areas
- 🔵 Blue: Water bodies, floods
- 🟤 Brown: Soil, degraded forests
- 🟡 Yellow: Transition zones, warnings

### 📊 Opacity Guidelines

- Background context layers: 0.2-0.3
- Important features: 0.4-0.6
- Critical alerts: 0.7-0.8

### 🏷️ Naming Conventions

- **id**: kebab-case, descriptive (`vegetation-gain-2024`)
- **name**: Human-readable (`Vegetation Gain (2024)`)
- **layerType**: lowercase, short (`gain`, `loss`, `mangrove`)

### 📁 File Organization

Keep data organized by type and date:

```
public/data/
  ├── vegetation/
  │   ├── TestGain.geojson
  │   └── TestLoss.geojson
  ├── mangroves/
  │   └── Mangroves2025.geojson
  └── hydrology/
      └── FloodZones.geojson
```

### 🔄 Data Updates

To update a dataset, just replace the GeoJSON file. The layer will reload automatically on next map load.
