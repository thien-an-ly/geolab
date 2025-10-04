import { useState } from "react";
import MapView from "./components/MapView";
import LayerControl from "./components/LayerControl";
import Legend from "./components/Legend";
import Sidebar from "./components/Sidebar";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import type { MapLayer } from "./types";
import "./style.css";

function App() {
  const [activeTab, setActiveTab] = useState<"map" | "dashboard">("map");
  const [layers, setLayers] = useState<MapLayer[]>([
    {
      id: "gain",
      name: "Mangrove Gain (2020-2024)",
      visible: false,
      type: "gain",
    },
    { id: "loss", name: "Mangrove Loss (2025)", visible: false, type: "loss" },
    {
      id: "mangrove",
      name: "Mangrove Zones",
      visible: false,
      type: "mangrove",
    },
    { id: "forest", name: "Degraded Forests", visible: false, type: "forest" },
    { id: "water", name: "Hydrological Shifts", visible: false, type: "water" },
    { id: "carbon", name: "Carbon Loss Areas", visible: false, type: "carbon" },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<{
    properties: Record<string, unknown>;
  } | null>(null);

  const handleToggleLayer = (layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleFeatureClick = (feature: {
    properties: Record<string, unknown>;
  }) => {
    setSelectedFeature(feature);
    setSidebarOpen(true);
  };

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "map" ? (
        <>
          <div id="map">
            <MapView layers={layers} onFeatureClick={handleFeatureClick} />
          </div>

          <LayerControl layers={layers} onToggleLayer={handleToggleLayer} />
          <Legend />
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            featureData={selectedFeature}
          />
        </>
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;
