import { useEffect, useRef } from "react";
import { useMap } from "react-map-gl";
import type { DataSourceConfig } from "../config/dataSources";

interface GeoJSONLayerProps {
  config: DataSourceConfig;
  visible: boolean;
  onFeatureClick?: (feature: { properties: Record<string, unknown> }) => void;
}

/**
 * Reusable component for loading and displaying a GeoJSON data source
 * Handles source creation, layer styling, and visibility toggling
 */
export default function GeoJSONLayer({
  config,
  visible,
  onFeatureClick,
}: GeoJSONLayerProps) {
  const { current: mapRef } = useMap();
  const initialVisibilityRef = useRef(visible);

  const sourceId = `${config.id}-source`;
  const fillLayerId = `${config.id}-fill`;
  const lineLayerId = `${config.id}-line`;

  // Load GeoJSON data and create layers
  useEffect(() => {
    if (!mapRef) return;

    const map = mapRef.getMap();

    const loadData = async () => {
      try {
        // Check if source already exists
        if (map.getSource(sourceId)) {
          console.log(`Source ${sourceId} already exists, skipping...`);
          return;
        }

        // Fetch GeoJSON data
        const response = await fetch(config.dataUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${config.dataUrl}: ${response.statusText}`
          );
        }
        const data = await response.json();

        // Add source
        map.addSource(sourceId, {
          type: "geojson",
          data: data,
        });

        // Add fill layer with initial visibility
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          layout: {
            visibility: initialVisibilityRef.current ? "visible" : "none",
          },
          paint: {
            "fill-color": config.style.fillColor,
            "fill-opacity": config.style.fillOpacity,
          },
        });

        // Add line layer (outline) with initial visibility
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          layout: {
            visibility: initialVisibilityRef.current ? "visible" : "none",
          },
          paint: {
            "line-color": config.style.lineColor,
            "line-width": config.style.lineWidth,
          },
        });

        console.log(`✓ ${config.name} loaded from ${config.dataUrl}`);
      } catch (error) {
        console.error(`Error loading ${config.name}:`, error);
      }
    };

    loadData();

    // Cleanup function
    return () => {
      // Only remove layers/sources when component unmounts
      if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
      if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [mapRef, sourceId, fillLayerId, lineLayerId, config]);

  // Handle visibility changes
  useEffect(() => {
    if (!mapRef) return;

    const map = mapRef.getMap();

    const updateVisibility = () => {
      const visibility = visible ? "visible" : "none";

      if (map.getLayer(fillLayerId)) {
        map.setLayoutProperty(fillLayerId, "visibility", visibility);
      }
      if (map.getLayer(lineLayerId)) {
        map.setLayoutProperty(lineLayerId, "visibility", visibility);
      }
    };

    // Wait a bit to ensure layers are loaded
    const timer = setTimeout(updateVisibility, 100);
    return () => clearTimeout(timer);
  }, [mapRef, visible, fillLayerId, lineLayerId]);

  // Handle click events
  useEffect(() => {
    if (!mapRef || !onFeatureClick) return;

    const map = mapRef.getMap();

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [fillLayerId],
      });

      if (features.length > 0) {
        onFeatureClick({
          properties: features[0].properties as Record<string, unknown>,
        });
      }
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    // Add click handler to the fill layer
    const timer = setTimeout(() => {
      if (map.getLayer(fillLayerId)) {
        map.on("click", fillLayerId, handleClick);
        map.on("mouseenter", fillLayerId, handleMouseEnter);
        map.on("mouseleave", fillLayerId, handleMouseLeave);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (map.getLayer(fillLayerId)) {
        map.off("click", fillLayerId, handleClick);
        map.off("mouseenter", fillLayerId, handleMouseEnter);
        map.off("mouseleave", fillLayerId, handleMouseLeave);
      }
    };
  }, [mapRef, fillLayerId, onFeatureClick]);

  return null; // This component doesn't render anything itself
}
