import { useState, useEffect, useRef } from "react";
import Map, { NavigationControl, useMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { MapLayer } from "../../types";
import { updateDataSourcesForYear } from "../../config/dataSources";
import "./MapView.css";

interface MapViewProps {
  layers: MapLayer[];
  currentYear: number;
  onFeatureClick?: (feature: { properties: Record<string, unknown> }) => void;
}

// Component to initialize all layers once on map load
function LayerInitializer({
  layers,
  currentYear,
  onFeatureClick,
}: {
  layers: MapLayer[];
  currentYear: number;
  onFeatureClick?: (feature: { properties: Record<string, unknown> }) => void;
}) {
  const { current: mapRef } = useMap();
  const initializationAttempted = useRef(false);
  const [initialized, setInitialized] = useState(false);
  const previousYear = useRef(currentYear);

  // Initial load of all layers
  useEffect(() => {
    // Prevent re-initialization (especially for React Strict Mode double-mounting)
    if (!mapRef || initializationAttempted.current) return;

    // Mark that we've attempted initialization
    initializationAttempted.current = true;

    const map = mapRef.getMap();

    // Get data sources for the current year
    const DATA_SOURCES = updateDataSourcesForYear(currentYear);

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
          let data;
          try {
            const response = await fetch(config.dataUrl);
            data = await response.json();
          } catch (jsonError) {
            console.warn(
              `Failed to fetch JSON from ${config.dataUrl} - might be genuine error or data lacks this time point:`,
              jsonError
            );
            continue;
          }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, layers, onFeatureClick]); // currentYear handled in separate effect

  // Handle year changes - update data sources without remounting
  useEffect(() => {
    if (!mapRef || !initialized || previousYear.current === currentYear) return;

    const map = mapRef.getMap();
    const DATA_SOURCES = updateDataSourcesForYear(currentYear);

    console.log(`Updating map data for year ${currentYear}...`);

    const updateDataSources = async () => {
      for (const config of DATA_SOURCES) {
        const sourceId = `${config.id}-source`;
        const fillLayerId = `${config.id}-fill`;
        const lineLayerId = `${config.id}-line`;

        try {
          // Fetch new data for the year
          const response = await fetch(config.dataUrl);
          if (!response.ok) {
            console.warn(
              `No data available for ${config.name} in year ${currentYear} - removing layers`
            );

            // Remove layers if data is not available
            if (map.getLayer(fillLayerId)) {
              map.removeLayer(fillLayerId);
            }
            if (map.getLayer(lineLayerId)) {
              map.removeLayer(lineLayerId);
            }
            if (map.getSource(sourceId)) {
              map.removeSource(sourceId);
            }

            continue;
          }
          const data = await response.json();

          // If source exists, update it
          const source = map.getSource(sourceId);
          if (source && source.type === "geojson") {
            (source as mapboxgl.GeoJSONSource).setData(data);
            console.log(`✓ Updated ${config.name} for year ${currentYear}`);
          } else {
            // If source doesn't exist (was removed), recreate it
            map.addSource(sourceId, {
              type: "geojson",
              data: data,
            });

            // Find visibility state from layers prop
            const layer = layers.find((l) => l.type === config.layerType);
            const visibility = layer?.visible ? "visible" : "none";

            // Re-add fill layer
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

            // Re-add line layer
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

            console.log(`✓ Re-added ${config.name} for year ${currentYear}`);
          }
        } catch (error) {
          console.warn(
            `Failed to update ${config.name} for year ${currentYear}:`,
            error
          );

          // Remove layers on error as well
          if (map.getLayer(fillLayerId)) {
            map.removeLayer(fillLayerId);
          }
          if (map.getLayer(lineLayerId)) {
            map.removeLayer(lineLayerId);
          }
          if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
          }
        }
      }
    };

    updateDataSources();
    previousYear.current = currentYear;
  }, [mapRef, initialized, currentYear, layers]);

  // Update visibility when layers prop changes
  useEffect(() => {
    if (!mapRef || !initialized) return;

    const map = mapRef.getMap();
    const DATA_SOURCES = updateDataSourcesForYear(currentYear);

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
  }, [mapRef, initialized, layers, currentYear]);

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
