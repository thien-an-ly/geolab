import { useEffect } from "react";
import type { Map } from "mapbox-gl";
import type { MapLayer } from "../types";
import { DATA_SOURCES } from "../config/dataSources";
import { updateLayerVisibility } from "../utils/mapLayerUtils";

interface UseLayerVisibilityOptions {
  map: Map; // Non-null: guaranteed by initialized flag
  initialized: boolean;
  layers: MapLayer[];
}

/**
 * Custom hook to update layer visibility when layers prop changes.
 *
 * Note: map is non-null because initialized can only be true if map is valid
 * (enforced by useMapLayers which only sets initialized after using map).
 */
export function useLayerVisibility({
  map,
  initialized,
  layers,
}: UseLayerVisibilityOptions) {
  useEffect(() => {
    // initialized can only be true if map is valid
    // (guaranteed by useMapLayers' initialization logic)
    if (!initialized) return;

    DATA_SOURCES.forEach((config) => {
      const layer = layers.find((l) => l.type === config.layerType);
      const visibility = layer?.visible ? "visible" : "none";
      updateLayerVisibility(map, config.id, visibility);
    });
    // map is intentionally excluded:
    // - map: stable ref, guaranteed non-null when initialized is true
    // - initialized: triggers on first load, layers triggers on visibility changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, layers]);
}
