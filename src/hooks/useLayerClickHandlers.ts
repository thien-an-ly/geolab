import { useEffect, useRef } from "react";
import type { Map as MapboxMap } from "mapbox-gl";
import { DATA_SOURCES_CONFIG } from "../config/dataSources";
import type { FeatureClickData } from "../types";

interface UseLayerClickHandlersOptions {
  map: MapboxMap; // Non-null: guaranteed by dataLoaded flag
  dataLoaded: boolean;
  onFeatureClick?: (data: FeatureClickData) => void;
}

/**
 * Custom hook to manage click handlers for all map layers.
 * Waits for dataLoaded flag before attaching handlers to ensure
 * all layers have been created after async data loading completes.
 *
 * The effect only depends on dataLoaded - when it transitions from false to true,
 * all layers are guaranteed to be ready for handler attachment.
 *
 * Note: map is non-null because dataLoaded can only be true if map is valid
 * (enforced by useLayerDataUpdate's early return guard).
 */
export function useLayerClickHandlers({
  map,
  dataLoaded,
  onFeatureClick,
}: UseLayerClickHandlersOptions) {
  // Store cleanup functions for all handlers
  const cleanupFunctionsRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    // dataLoaded can only be true if map is valid
    // (guaranteed by useLayerDataUpdate's early return guard)
    if (!dataLoaded || !onFeatureClick) return;

    const cleanupFunctions = cleanupFunctionsRef.current;

    // Setup handlers for all layers that exist
    DATA_SOURCES_CONFIG.forEach((config) => {
      const fillLayerId = `${config.id}-fill`;

      // Only setup if layer exists and we haven't already setup handlers
      if (map.getLayer(fillLayerId) && !cleanupFunctions.has(config.id)) {
        const handleClick = (e: mapboxgl.MapMouseEvent) => {
          if (e.features && e.features.length > 0) {
            onFeatureClick({
              properties: e.features[0].properties as Record<string, unknown>,
              layerType: config.layerType,
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

        // Store cleanup function
        const cleanup = () => {
          // Check if map is still valid and layer exists
          try {
            if (map.getLayer(fillLayerId)) {
              map.off("click", fillLayerId, handleClick);
              map.off("mouseenter", fillLayerId, handleMouseEnter);
              map.off("mouseleave", fillLayerId, handleMouseLeave);
            }
          } catch (e) {
            // Map may have been destroyed, ignore cleanup errors
            console.debug(`Cleanup skipped for ${fillLayerId}:`, e);
          }
        };

        cleanupFunctions.set(config.id, cleanup);

        console.log(`✓ Click handlers attached to ${config.name}`);
      }
    });

    // Clean up handlers for layers that no longer exist
    const existingHandlerIds = Array.from(cleanupFunctions.keys());
    existingHandlerIds.forEach((id) => {
      const fillLayerId = `${id}-fill`;
      if (!map.getLayer(fillLayerId)) {
        // Layer was removed, clean up its handlers
        const cleanup = cleanupFunctions.get(id);
        if (cleanup) {
          cleanup();
          cleanupFunctions.delete(id);
          console.log(`✓ Click handlers removed from ${id}`);
        }
      }
    });

    // Cleanup function for when component unmounts or dependencies change
    return () => {
      // Capture current cleanup functions to avoid stale closure
      const currentCleanups = Array.from(cleanupFunctions.values());
      currentCleanups.forEach((cleanup) => cleanup());
      cleanupFunctions.clear();
    };
    // map and onFeatureClick are intentionally excluded:
    // - map: stable ref, guaranteed non-null when dataLoaded is true
    // - onFeatureClick: stable callback from parent
    // - dataLoaded: the sync lock that triggers handler attachment
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded]);
}
