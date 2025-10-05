# Data Architecture Guide

## Overview

This guide explains how geospatial data flows through the Kakadu Wetlands Sentinel application. It's designed for users who want to understand the data structure, add new datasets, or modify existing visualizations.

---

## Data Sources

### Current Datasets

The application visualizes the following GeoJSON datasets:

| Dataset            | Type              | Years Available | Location                                            |
| ------------------ | ----------------- | --------------- | --------------------------------------------------- |
| **Mangrove Gain**  | Vegetation gain   | Static          | `public/data/TestGain.geojson`                      |
| **Mangrove Loss**  | Vegetation loss   | Static          | `public/data/TestLoss.geojson`                      |
| **Mangrove Zones** | Mangrove coverage | 2014-2015       | `public/data/mangrove/M_{year}.geojson`             |
| **Flood Zones**    | Hydrological data | 2016-2024       | `public/data/flood/Kakadu_FloodOnly_{year}.geojson` |

### Data Structure

```
public/data/
├── TestGain.geojson          # Vegetation gain areas
├── TestLoss.geojson          # Vegetation loss areas
├── TestMangrove.geojson      # Static mangrove reference (legacy)
├── flood/                    # Time-series flood data
│   ├── Kakadu_FloodOnly_2016.geojson
│   ├── Kakadu_FloodOnly_2017.geojson
│   ├── Kakadu_FloodOnly_2018.geojson
│   ├── Kakadu_FloodOnly_2019.geojson
│   ├── Kakadu_FloodOnly_2020.geojson
│   ├── Kakadu_FloodOnly_2021.geojson
│   ├── Kakadu_FloodOnly_2022.geojson
│   ├── Kakadu_FloodOnly_2023.geojson
│   └── Kakadu_FloodOnly_2024.geojson
└── mangrove/                 # Time-series mangrove data
    ├── M_2014.geojson
    └── M_2015.geojson
```

---

## GeoJSON Format

All datasets use the standard GeoJSON format:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[longitude, latitude], ...]]
      },
      "properties": {
        "id": "unique-identifier",
        "name": "Feature Name",
        // ... additional properties
      }
    }
  ]
}
```

### Supported Geometry Types

- **Polygon** - Area-based features (mangrove zones, flood extents)
- **MultiPolygon** - Multiple disconnected areas
- **LineString** - Linear features (rivers, boundaries)
- **Point** - Point locations (sampling sites, markers)

---

## Data Configuration

### Central Configuration File

All data sources are configured in **`src/config/dataSources.ts`**:

```typescript
export const DATA_SOURCES: DataSourceConfig[] = [
  {
    id: "mangrove-gain", // Unique identifier
    name: "Mangrove Gain", // Display name
    layerType: "gain", // Type for filtering/grouping
    dataUrl: "/data/TestGain.geojson", // Path to GeoJSON file
    style: {
      fillColor: "#00ff00", // Fill color (hex)
      fillOpacity: 0.4, // Transparency (0-1)
      lineColor: "#00aa00", // Border color
      lineWidth: 2, // Border width (pixels)
    },
    metadata: {
      description: "Areas showing increased mangrove coverage",
      year: "2020-2024",
      source: "Landsat analysis",
    },
  },
  // ... more data sources
];
```

### Year-Based Data Sources

For time-series data, use the `updateDataSourcesForYear()` function:

```typescript
export function updateDataSourcesForYear(year: number): DataSourceConfig[] {
  return DATA_SOURCES.map((source) => ({
    ...source,
    dataUrl: getDataUrlForYear(source.layerType, year),
  }));
}
```

This automatically switches between files like:

- `flood/Kakadu_FloodOnly_2016.geojson`
- `flood/Kakadu_FloodOnly_2017.geojson`
- etc.

---

## Data Flow Architecture

### Loading Process

```
1. User opens application
   ↓
2. MapView component initializes
   ↓
3. useInitMap() gets map reference
   ↓
4. User selects year (e.g., 2024)
   ↓
5. useLayerDataUpdate() triggered
   ├─ Reads DATA_SOURCES config
   ├─ Fetches GeoJSON from URLs
   ├─ Creates Mapbox sources
   ├─ Adds fill + line layers
   └─ Sets dataLoaded = true
   ↓
6. useLayerClickHandlers() attaches interactions
   ↓
7. Map displays data with styling
```

### Component Hierarchy

```
App.tsx
  └─ MapView.tsx
      ├─ useInitMap()           # Get map instance
      ├─ useLayerDataUpdate()   # Load GeoJSON data
      ├─ useLayerVisibility()   # Toggle layer visibility
      └─ useLayerClickHandlers()# Attach click events
```

---

## Adding New Data

### Quick Start: 4 Steps

#### 1️⃣ Add GeoJSON File

Place your file in `public/data/`:

```bash
public/data/MyNewData.geojson
```

#### 2️⃣ Configure Data Source

Edit `src/config/dataSources.ts`:

```typescript
{
  id: "my-new-data",
  name: "My New Dataset",
  layerType: "custom",
  dataUrl: "/data/MyNewData.geojson",
  style: {
    fillColor: "#FF6B6B",
    fillOpacity: 0.5,
    lineColor: "#C92A2A",
    lineWidth: 2,
  },
  metadata: {
    description: "Description of what this data shows",
    year: "2024",
    source: "Data source name",
  },
}
```

#### 3️⃣ Update Type Definitions

Edit `src/types/index.ts` to add your layer type:

```typescript
export type MapLayerType = "mangrove" | "flood" | "gain" | "loss" | "custom"; // ← Add your type
```

#### 4️⃣ Add to Layer Control

Edit `src/App.tsx` to make it toggleable:

```typescript
const [layers, setLayers] = useState<MapLayer[]>([
  { id: "custom", name: "My New Dataset", visible: true, type: "custom" },
  // ... existing layers
]);
```

**Done!** Your data will appear on the map. 🎉

---

## Time-Series Data

### Adding Multi-Year Datasets

For data that changes over time (like flood or mangrove evolution):

#### 1. Organize Files by Year

```
public/data/my-dataset/
  ├── MyData_2020.geojson
  ├── MyData_2021.geojson
  ├── MyData_2022.geojson
  └── MyData_2023.geojson
```

#### 2. Update `getDataUrlForYear()` Function

Edit `src/config/dataSources.ts`:

```typescript
function getDataUrlForYear(layerType: MapLayerType, year: number): string {
  const yearMappings: Record<MapLayerType, string> = {
    flood: `/data/flood/Kakadu_FloodOnly_${year}.geojson`,
    mangrove: `/data/mangrove/M_${year}.geojson`,
    custom: `/data/my-dataset/MyData_${year}.geojson`, // ← Add this
    // Static datasets (no year variation)
    gain: "/data/TestGain.geojson",
    loss: "/data/TestLoss.geojson",
  };

  return yearMappings[layerType] || "/data/default.geojson";
}
```

#### 3. Set Available Years

Update the year range in `src/App.tsx`:

```typescript
const [currentYear, setCurrentYear] = useState(2024);
const minYear = 2020; // ← Adjust based on your data
const maxYear = 2024; // ← Adjust based on your data
```

**Result:** The TimeSlider component will automatically switch between years.

---

## Styling Guidelines

### Color Schemes

Use semantic colors that match the data type:

| Data Type           | Color Palette | Example                              |
| ------------------- | ------------- | ------------------------------------ |
| **Vegetation Gain** | Green shades  | `#00ff00` (bright), `#00aa00` (dark) |
| **Vegetation Loss** | Red shades    | `#ff0000` (bright), `#aa0000` (dark) |
| **Water/Flood**     | Blue shades   | `#0099ff` (bright), `#0066cc` (dark) |
| **Mangrove**        | Teal/cyan     | `#00ffaa` (bright), `#00aa77` (dark) |
| **Degradation**     | Brown/orange  | `#cc6600` (bright), `#994400` (dark) |

### Opacity Best Practices

```typescript
style: {
  fillOpacity: 0.4,   // ✅ Good for overlapping layers
  fillOpacity: 0.8,   // ✅ Good for critical alerts
  fillOpacity: 0.1,   // ⚠️ Too subtle, hard to see
  fillOpacity: 1.0,   // ❌ Blocks underlying map features
}
```

### Line Width Guidelines

```typescript
lineWidth: 1,    // Subtle borders
lineWidth: 2,    // Standard borders (recommended)
lineWidth: 3-4,  // Emphasis (important features)
lineWidth: 5+,   // Too thick, clutters map
```

---

## Data Loading Performance

### Optimization Tips

1. **Keep files small** (< 5MB recommended)

   - Simplify geometries using tools like [mapshaper](https://mapshaper.org/)
   - Remove unnecessary properties
   - Use appropriate precision (5-6 decimal places for coordinates)

2. **Use appropriate coordinate precision**

   ```json
   // ❌ Too precise (unnecessary bytes)
   [132.123456789, -12.987654321]

   // ✅ Appropriate (±1m accuracy)
   [132.12346, -12.98765]
   ```

3. **Compress GeoJSON** (optional)
   - Enable gzip compression on your server
   - Vite automatically compresses files in production

### File Size Guidelines

| Dataset Size | Performance | Recommendation                  |
| ------------ | ----------- | ------------------------------- |
| < 1MB        | Excellent   | ✅ No optimization needed       |
| 1-5MB        | Good        | ✅ Monitor load times           |
| 5-10MB       | Fair        | ⚠️ Consider simplification      |
| > 10MB       | Poor        | ❌ Simplify or split into tiles |

---

## Data Validation

### Checking GeoJSON Validity

Before adding data, validate it:

1. **Online tools:**

   - [geojson.io](https://geojson.io/) - Visual editor and validator
   - [GeoJSONLint](https://geojsonlint.com/) - Syntax validator

2. **Command line:**
   ```bash
   # Using Node.js
   node -e "JSON.parse(require('fs').readFileSync('data.geojson'))"
   ```

### Common Issues

| Error                 | Cause              | Solution                              |
| --------------------- | ------------------ | ------------------------------------- |
| "Unexpected token"    | Invalid JSON       | Check for missing commas, brackets    |
| "Invalid coordinate"  | Wrong format       | Use `[lon, lat]` not `[lat, lon]`     |
| "Geometry not closed" | Polygon not closed | First and last coordinates must match |
| "Self-intersecting"   | Overlapping edges  | Fix geometry in GIS software          |

---

## Data Properties

### Required Properties

Minimal GeoJSON structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { ... },
      "properties": {}  // Can be empty
    }
  ]
}
```

### Recommended Properties

For richer interactivity:

```json
"properties": {
  "id": "unique-id-123",
  "name": "Feature Name",
  "description": "Detailed description",
  "area_hectares": 150.5,
  "classification": "mangrove",
  "confidence": 0.95,
  "date_observed": "2024-03-15"
}
```

These properties appear in:

- Click popups
- Feature details sidebar
- Export/analysis tools

---

## Coordinate Systems

### Required Format

**EPSG:4326 (WGS84)** - Standard GPS coordinates

```json
"coordinates": [
  [
    [132.5, -12.5],  // [longitude, latitude]
    [132.6, -12.5],
    [132.6, -12.6],
    [132.5, -12.6],
    [132.5, -12.5]   // Closes the polygon
  ]
]
```

### Converting Coordinates

If your data uses a different projection:

**Using QGIS:**

1. Open layer
2. Right-click → Export → Save Features As
3. Set CRS to "EPSG:4326 - WGS 84"
4. Format: GeoJSON

**Using ogr2ogr (command line):**

```bash
ogr2ogr -t_srs EPSG:4326 output.geojson input.shp
```

---

## Data Updates

### Updating Existing Datasets

To update a dataset with new observations:

1. Replace the GeoJSON file in `public/data/`
2. Keep the same filename
3. Refresh the browser (hard refresh: Ctrl+F5)

**No code changes needed!** The application automatically loads the new data.

### Adding New Years

For time-series data:

1. Add new file following naming convention:

   ```
   public/data/flood/Kakadu_FloodOnly_2025.geojson
   ```

2. Update year range in `src/App.tsx`:

   ```typescript
   const maxYear = 2025; // Update this
   ```

3. TimeSlider will automatically include the new year

---

## Troubleshooting

### Data Not Appearing

**Check these common issues:**

1. **File path correct?**

   - URL in `dataSources.ts` matches actual file location
   - Use absolute paths starting with `/data/`

2. **GeoJSON valid?**

   - Test at [geojsonlint.com](https://geojsonlint.com/)
   - Check browser console for errors

3. **Style visible?**

   - Opacity not too low (`fillOpacity < 0.1`)
   - Color contrasts with map background

4. **Layer enabled?**
   - Check layer control panel
   - Ensure `visible: true` in App.tsx

### Performance Issues

**If map loads slowly:**

1. Check file sizes (browser DevTools → Network tab)
2. Simplify large geometries
3. Consider splitting into multiple smaller files
4. Use appropriate zoom levels for detail

### Browser Console Errors

```javascript
// "Failed to fetch data from /data/..."
→ Check file exists and path is correct

// "Invalid GeoJSON"
→ Validate at geojsonlint.com

// "Source already exists"
→ Duplicate layer IDs, check dataSources.ts

// "Map not loaded"
→ Wait for map initialization, check Mapbox token
```

---

## Data Export

### Exporting Processed Data

To download currently displayed features:

```javascript
// In browser console
const data = {
  type: "FeatureCollection",
  features: map.queryRenderedFeatures(),
};
console.log(JSON.stringify(data, null, 2));
```

### Batch Processing

For processing multiple files:

```bash
# Example: Simplify all GeoJSON files
for file in public/data/*.geojson; do
  npx @mapbox/geojson-merge "$file" | \
  npx @mapbox/simplify-geojson > "${file%.geojson}_simplified.geojson"
done
```

---

## Best Practices Summary

### ✅ Do's

- **Use semantic colors** that match data meaning
- **Validate GeoJSON** before adding to project
- **Keep files under 5MB** for good performance
- **Use appropriate coordinate precision** (5-6 decimals)
- **Document data sources** in metadata
- **Follow naming conventions** (kebab-case for IDs)

### ❌ Don'ts

- **Don't use high opacity** on overlapping layers
- **Don't include unnecessary properties** (bloats files)
- **Don't use extremely complex geometries** (simplify first)
- **Don't hard-code styles** (use dataSources.ts)
- **Don't forget to update types** when adding new layer types

---

## Resources

### Tools

- **[geojson.io](https://geojson.io/)** - Create/edit GeoJSON visually
- **[GeoJSONLint](https://geojsonlint.com/)** - Validate GeoJSON syntax
- **[Mapshaper](https://mapshaper.org/)** - Simplify/convert geometries
- **[QGIS](https://qgis.org/)** - Professional GIS software (free)

### Documentation

- **[GeoJSON Specification](https://tools.ietf.org/html/rfc7946)** - Official format spec
- **[Mapbox Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/)** - Styling reference
- **[Turf.js](https://turfjs.org/)** - Geospatial analysis library

---

## Support

For issues with:

- **Data format:** Check GeoJSON specification
- **Performance:** See optimization tips above
- **Styling:** Review Mapbox style documentation
- **Application errors:** Check browser console and MAPVIEW_ARCHITECTURE.md

---

**Last Updated:** October 5, 2025  
**Version:** 1.0
