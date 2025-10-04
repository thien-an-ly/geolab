import { useState } from "react";
import MapView from "./components/MapView";
import TimeSeriesChart from "./components/TimeSeriesChart";
import LayerControl from "./components/LayerControl";
import { mockTimeSeriesData } from "./utils/mockData";
import type { MapLayer } from "./types";
import "./App.css";

function App() {
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: "mangrove", name: "Mangrove Zones", visible: true, type: "mangrove" },
    { id: "forest", name: "Degraded Forests", visible: true, type: "forest" },
    { id: "water", name: "Hydrological Shifts", visible: true, type: "water" },
    { id: "carbon", name: "Carbon Loss Areas", visible: false, type: "carbon" },
  ]);

  const handleToggleLayer = (layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header
        style={{
          background: "#1a1a1a",
          color: "white",
          padding: "1rem 2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
          🌿 Kakadu Wetlands Sentinel
        </h1>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", opacity: 0.8 }}>
          Ecological indicators and carbon degradation analysis
        </p>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: "1 1 60%", position: "relative" }}>
          <MapView layers={layers} />
          <LayerControl layers={layers} onToggleLayer={handleToggleLayer} />
        </div>

        <div
          style={{
            flex: "1 1 40%",
            overflowY: "auto",
            background: "#f5f5f5",
            padding: "1rem",
          }}
        >
          <TimeSeriesChart
            data={mockTimeSeriesData}
            title="Seasonal Trends - Kakadu National Park"
          />

          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              marginTop: "1rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#333" }}>About This Tool</h3>
            <p style={{ lineHeight: 1.6, color: "#666" }}>
              Kakadu Wetlands Sentinel visualizes satellite-derived ecological
              indicators including:
            </p>
            <ul style={{ color: "#666", lineHeight: 1.8 }}>
              <li>📊 NDVI from Landsat (vegetation health)</li>
              <li>💧 Flood/drought signals from Sentinel-1 SAR</li>
              <li>🌲 Mangrove zones and degraded forests</li>
              <li>⚠️ Carbon loss correlation (Sentinel-5P + IPCC)</li>
            </ul>
            <p style={{ lineHeight: 1.6, color: "#666", fontSize: "0.9rem" }}>
              <strong>Note:</strong> This tool visualizes correlations to
              support early-stage environmental analysis. Add your Mapbox token
              in <code>MapView.tsx</code> to enable the map.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
