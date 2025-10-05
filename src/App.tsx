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
import type { MapLayer, FeatureClickData } from "./types";
import { LAYERS } from "./config/layers";
import "./styles.css";

function App() {
  const [activeTab, setActiveTab] = useState<"map" | "dashboard">("map");
  const [currentYear, setCurrentYear] = useState(2024);
  const [layers, setLayers] = useState<MapLayer[]>(LAYERS);

  const [controlSidebarOpen, setControlSidebarOpen] = useState(false);
  const [timeSliderOpen, setTimeSliderOpen] = useState(false);
  const [bottomSidebarOpen, setBottomSidebarOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<FeatureClickData | null>(null);

  const handleToggleLayer = (layerId: string) => {
    setLayers((prevLayers) =>
      prevLayers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleFeatureClick = (data: FeatureClickData) => {
    // Add current year to the feature data
    setSelectedFeature(data);
    // console.log("Feature clicked:", data.properties);

    // Close time slider if open
    if (timeSliderOpen) {
      setTimeSliderOpen(false);
    }

    setBottomSidebarOpen(true);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    // console.log(`Year changed to ${year}`);
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
              feature={selectedFeature}
              year={currentYear}
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
