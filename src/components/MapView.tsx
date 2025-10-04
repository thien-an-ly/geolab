import { useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { MapLayer } from "../types";

interface MapViewProps {
  layers: MapLayer[];
}

export default function MapView({ layers }: MapViewProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  console.log(
    "Active layers:",
    layers
      .filter((l) => l.visible)
      .map((l) => l.name)
      .join(", ")
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Map
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
