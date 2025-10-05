import { useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { MapLayer } from "../../types";
import {
  useInitMap,
  useDataSourceUpdate,
  useLayerVisibility,
  useLayerClickHandlers,
} from "../../hooks";
import "./MapView.css";

interface MapViewProps {
  layers: MapLayer[];
  currentYear: number;
  onFeatureClick?: (feature: Record<string, unknown>) => void;
}

// Component to initialize all layers once on map load
function LayerInitializer({
  layers,
  currentYear,
  onFeatureClick,
}: {
  layers: MapLayer[];
  currentYear: number;
  onFeatureClick?: (feature: Record<string, unknown>) => void;
}) {
  // Get map instance and initialization status
  const { map, initialized } = useInitMap();

  // Update layer data when year changes (handles initial load too)
  const { dataLoaded } = useDataSourceUpdate({
    map,
    initialized,
    currentYear,
  });

  // Update layer visibility when layers prop changes (after data loads)
  useLayerVisibility({
    map,
    initialized,
    dataLoaded,
    layers,
  });

  // Manage click handlers for all layers (waits for data to load)
  useLayerClickHandlers({
    map,
    dataLoaded,
    onFeatureClick,
  });

  return null;
}

export function MapView({ layers, currentYear, onFeatureClick }: MapViewProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Map
        id="main-map"
        initialViewState={{
          longitude: 132.5,
          latitude: -12.5,
          zoom: 8,
        }}
        onLoad={() => {
          console.log("✓ Map loaded successfully!");
          setIsLoaded(true);
        }}
        onError={(evt) => {
          console.error("✗ Mapbox error:", evt);
        }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />

        {/* Initialize all layers once on map load */}
        {isLoaded && (
          <LayerInitializer
            layers={layers}
            currentYear={currentYear}
            onFeatureClick={onFeatureClick}
          />
        )}
      </Map>

      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "1rem",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            borderRadius: "4px",
            zIndex: 1000,
          }}
        >
          Loading map...
        </div>
      )}
    </div>
  );
}
