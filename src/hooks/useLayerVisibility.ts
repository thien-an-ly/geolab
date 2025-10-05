import { useEffect } from "react";
import type { Map as MapBoxMap } from "mapbox-gl";
import { type MapLayer, type MapLayerType } from "../types";
import { DATA_SOURCES_CONFIG } from "../config/dataSources";
import { getVisibilityStrategy } from "../utils/map/mapVisibilityStrategies";

interface UseLayerVisibilityOptions {
  map: MapBoxMap; // Non-null: guaranteed by initialized flag
  initialized: boolean;
  dataLoaded: boolean; // Only apply visibility after data is loaded
  layers: MapLayer[];
}

/**
 * Custom hook to update layer visibility when layers prop changes.
 *
 * Note: map is non-null because initialized can only be true if map is valid
 * (enforced by useMapLayers which only sets initialized after using map).
 *
 * Note: dataLoaded ensures visibility is only applied after data sources are loaded,
 * since useLayerDataUpdate defaults all layers to hidden on initial load.
 */
export function useLayerVisibility({
  map,
  initialized,
  dataLoaded,
  layers,
}: UseLayerVisibilityOptions) {
  useEffect(() => {
    // initialized can only be true if map is valid
    // (guaranteed by useMapLayers' initialization logic)
    // dataLoaded ensures layers exist before applying visibility
    if (!initialized || !dataLoaded) return;

    // Build a map of all layer states for coordinated strategies
    const layerStates = new Map<MapLayerType, boolean>();
    layers.forEach((layer) => {
      layerStates.set(layer.type, layer.visible);
    });

    // Apply visibility for each UI layer type
    // Some data sources serve multiple layer types (e.g., mangrove-change serves both gain and loss)
    layers.forEach((layer) => {
      // Map UI layer types to their data sources
      let dataSourceId: string;

      if (layer.type === "gain" || layer.type === "loss") {
        // Both gain and loss use the mangrove-change data source
        dataSourceId = "mangrove-change";
      } else {
        // For other layers, find matching data source by layerType
        const config = DATA_SOURCES_CONFIG.find(
          (c) => c.layerType === layer.type
        );
        if (!config) return;
        dataSourceId = config.id;
      }

      const strategy = getVisibilityStrategy(layer.type);
      strategy(map, dataSourceId, layer.visible, layerStates);
    });
    // map is intentionally excluded:
    // - map: stable ref, guaranteed non-null when initialized is true
    // - initialized: triggers on first load
    // - dataLoaded: triggers after data sources are loaded
    // - layers: triggers on visibility changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, dataLoaded, layers]);
}
