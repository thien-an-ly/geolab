import { useState } from "react";
import {
  MapView,
  ControlSidebar,
  Navigation,
  Dashboard,
  TimeSlider,
  BottomSidebar,
} from "./components";
import {} from "./components/time-slider";
import type { MapLayer } from "./types";
import "./styles.css";

function App() {
  const [activeTab, setActiveTab] = useState<"map" | "dashboard">("map");
  const [currentYear, setCurrentYear] = useState(2024);
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
    { id: "flood", name: "Flood Inundation", visible: false, type: "flood" },
    { id: "carbon", name: "Carbon Loss Areas", visible: false, type: "carbon" },
  ]);

  const [controlSidebarOpen, setControlSidebarOpen] = useState(false);
  const [timeSliderOpen, setTimeSliderOpen] = useState(false);
  const [bottomSidebarOpen, setBottomSidebarOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
    null
  );

  const handleToggleLayer = (layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleFeatureClick = (feature: Record<string, unknown>) => {
    setSelectedFeature(feature);
    console.log("Feature clicked:", selectedFeature);

    const featureId = (feature.id ||
      feature.fid ||
      feature.objectid ||
      feature.FID ||
      feature.OBJECTID ||
      "unknown") as string;

    // some features have no ID to visualize over time -> don't show bottom sidebar
    if (featureId === "unknown") {
      console.warn("Unable to extract feature ID from feature");
      return;
    } else console.log("Extracted Feature ID:", featureId);

    // Close time slider if open
    if (timeSliderOpen) {
      setTimeSliderOpen(false);
    }

    setSelectedFeatureId(featureId);
    setBottomSidebarOpen(true);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    console.log(`Year changed to ${year}`);
  };

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "map" ? (
        <>
          <div id="map">
            <ControlSidebar
              layers={layers}
              onToggleLayer={handleToggleLayer}
              isOpen={controlSidebarOpen}
              onToggle={() => setControlSidebarOpen(!controlSidebarOpen)}
            />
            <MapView
              layers={layers}
              currentYear={currentYear}
              onFeatureClick={handleFeatureClick}
            />
            <TimeSlider
              isOpen={timeSliderOpen}
              onToggle={() => setTimeSliderOpen(!timeSliderOpen)}
              initialYear={currentYear}
              onYearChange={handleYearChange}
            />
            <BottomSidebar
              isOpen={bottomSidebarOpen}
              onClose={() => setBottomSidebarOpen(false)}
              featureId={selectedFeatureId}
            />
          </div>
        </>
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;
