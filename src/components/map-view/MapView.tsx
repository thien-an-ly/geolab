import { useState, useEffect, useRef } from "react";
import Map, { NavigationControl, useMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { MapLayer } from "../../types";
import { DATA_SOURCES } from "../../config/dataSources";
import "./MapView.css";

interface MapViewProps {
  layers: MapLayer[];
  onFeatureClick?: (feature: { properties: Record<string, unknown> }) => void;
}

// Component to initialize all layers once on map load
function LayerInitializer({
  layers,
  onFeatureClick,
}: {
  layers: MapLayer[];
  onFeatureClick?: (feature: { properties: Record<string, unknown> }) => void;
}) {
  const { current: mapRef } = useMap();
  const initializationAttempted = useRef(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Prevent re-initialization (especially for React Strict Mode double-mounting)
    if (!mapRef || initializationAttempted.current) return;

    // Mark that we've attempted initialization
    initializationAttempted.current = true;

    const map = mapRef.getMap();

    // Load all layers in the order defined in DATA_SOURCES
    const loadAllLayers = async () => {
      for (const config of DATA_SOURCES) {
        const sourceId = `${config.id}-source`;
        const fillLayerId = `${config.id}-fill`;
        const lineLayerId = `${config.id}-line`;

        try {
          // Skip if source already exists (double-mount protection)
          if (map.getSource(sourceId)) {
            console.log(`Source ${sourceId} already exists, skipping...`);
            continue;
          }

          // Skip if layers already exist
          if (map.getLayer(fillLayerId) || map.getLayer(lineLayerId)) {
            console.log(`Layers for ${config.name} already exist, skipping...`);
            continue;
          }

          // Fetch data
          const response = await fetch(config.dataUrl);
          if (!response.ok) {
            console.error(`Failed to fetch ${config.dataUrl}`);
            continue;
          }
          const data = await response.json();

          // Add source only if it doesn't exist
          if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
              type: "geojson",
              data: data,
            });
          }

          // Find visibility state from layers prop
          const layer = layers.find((l) => l.type === config.layerType);
          const visibility = layer?.visible ? "visible" : "none";

          // Add fill layer only if it doesn't exist
          if (!map.getLayer(fillLayerId)) {
            map.addLayer({
              id: fillLayerId,
              type: "fill",
              source: sourceId,
              layout: {
                visibility: visibility,
              },
              paint: {
                "fill-color": config.style.fillColor,
                "fill-opacity": config.style.fillOpacity,
              },
            });
          }

          // Add line layer only if it doesn't exist
          if (!map.getLayer(lineLayerId)) {
            map.addLayer({
              id: lineLayerId,
              type: "line",
              source: sourceId,
              layout: {
                visibility: visibility,
              },
              paint: {
                "line-color": config.style.lineColor,
                "line-width": config.style.lineWidth,
              },
            });
          }

          // Add click handler if provided (only add once)
          if (onFeatureClick && map.getLayer(fillLayerId)) {
            const handleClick = (e: mapboxgl.MapMouseEvent) => {
              if (e.features && e.features.length > 0) {
                onFeatureClick({
                  properties: e.features[0].properties as Record<
                    string,
                    unknown
                  >,
                });
              }
            };

            const handleMouseEnter = () => {
              map.getCanvas().style.cursor = "pointer";
            };

            const handleMouseLeave = () => {
              map.getCanvas().style.cursor = "";
            };

            // Remove any existing handlers first to prevent duplicates
            map.off("click", fillLayerId, handleClick);
            map.off("mouseenter", fillLayerId, handleMouseEnter);
            map.off("mouseleave", fillLayerId, handleMouseLeave);

            // Add new handlers
            map.on("click", fillLayerId, handleClick);
            map.on("mouseenter", fillLayerId, handleMouseEnter);
            map.on("mouseleave", fillLayerId, handleMouseLeave);
          }

          console.log(`✓ ${config.name} loaded`);
        } catch (error) {
          console.error(`Error loading ${config.name}:`, error);
        }
      }
      setInitialized(true);
    };

    loadAllLayers();
  }, [mapRef, layers, onFeatureClick]);

  // Update visibility when layers prop changes
  useEffect(() => {
    if (!mapRef || !initialized) return;

    const map = mapRef.getMap();

    DATA_SOURCES.forEach((config) => {
      const fillLayerId = `${config.id}-fill`;
      const lineLayerId = `${config.id}-line`;
      const layer = layers.find((l) => l.type === config.layerType);
      const visibility = layer?.visible ? "visible" : "none";

      if (map.getLayer(fillLayerId)) {
        map.setLayoutProperty(fillLayerId, "visibility", visibility);
      }
      if (map.getLayer(lineLayerId)) {
        map.setLayoutProperty(lineLayerId, "visibility", visibility);
      }
    });
  }, [mapRef, initialized, layers]);

  return null;
}

export function MapView({ layers, onFeatureClick }: MapViewProps) {
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
          <LayerInitializer layers={layers} onFeatureClick={onFeatureClick} />
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
