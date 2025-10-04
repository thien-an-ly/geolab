import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { MapLayer } from "../types";

// TODO: Add your Mapbox access token here
mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

interface MapViewProps {
  layers: MapLayer[];
}

export default function MapView({ layers }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Kakadu National Park coordinates
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [132.5, -12.5], // Kakadu center
      zoom: 8,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update layer visibility
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    layers.forEach((layer) => {
      const visibility = layer.visible ? "visible" : "none";
      if (map.current?.getLayer(layer.id)) {
        map.current.setLayoutProperty(layer.id, "visibility", visibility);
      }
    });
  }, [layers, mapLoaded]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      {!mapLoaded && (
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
          }}
        >
          Loading map...
        </div>
      )}
    </div>
  );
}
