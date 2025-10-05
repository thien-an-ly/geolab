import type { Map } from "mapbox-gl";
import type { DataSourceConfig } from "../config/dataSources";
import type { MapLayer } from "../types";
import { getLayerStyleStrategy } from "./map/mapStyleStrategies";

/**
 * Fetch GeoJSON data from a URL
 */
export async function fetchGeoJSONData(
  url: string
): Promise<GeoJSON.FeatureCollection | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch data from ${url}: ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.warn(`Error fetching data from ${url}:`, error);
    return null;
  }
}

/**
 * Add a GeoJSON source to the map
 */
export function addMapSource(
  map: Map,
  sourceId: string,
  data: GeoJSON.FeatureCollection
): boolean {
  if (map.getSource(sourceId)) {
    console.log(`Source ${sourceId} already exists, skipping...`);
    return false;
  }

  map.addSource(sourceId, {
    type: "geojson",
    data: data,
  });
  return true;
}

/**
 * Add fill and line layers to the map
 */
export function addMapLayers(
  map: Map,
  config: DataSourceConfig,
  sourceId: string,
  visibility: "visible" | "none"
): boolean {
  const fillLayerId = `${config.id}-fill`;
  const lineLayerId = `${config.id}-line`;

  // Check if layers already exist
  if (map.getLayer(fillLayerId) || map.getLayer(lineLayerId)) {
    console.log(`Layers for ${config.name} already exist, skipping...`);
    return false;
  }

  // Get paint properties based on layer type strategy
  const styleStrategy = getLayerStyleStrategy(config);

  // Add fill layer
  map.addLayer({
    id: fillLayerId,
    type: "fill",
    source: sourceId,
    layout: {
      visibility: visibility,
    },
    paint: {
      "fill-color": styleStrategy.fillColor,
      "fill-opacity": styleStrategy.fillOpacity,
    },
  });

  // Add line layer
  map.addLayer({
    id: lineLayerId,
    type: "line",
    source: sourceId,
    layout: {
      visibility: visibility,
    },
    paint: {
      "line-color": styleStrategy.lineColor,
      "line-width": styleStrategy.lineWidth,
    },
  });

  return true;
}

/**
 * Remove map layers and source
 */
export function removeMapLayers(map: Map, layerId: string): void {
  const fillLayerId = `${layerId}-fill`;
  const lineLayerId = `${layerId}-line`;
  const sourceId = `${layerId}-source`;

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

/**
 * Update visibility of map layers
 */
export function updateLayerVisibility(
  map: Map,
  layerId: string,
  visibility: "visible" | "none"
): void {
  const fillLayerId = `${layerId}-fill`;
  const lineLayerId = `${layerId}-line`;

  if (map.getLayer(fillLayerId)) {
    map.setLayoutProperty(fillLayerId, "visibility", visibility);
  }
  if (map.getLayer(lineLayerId)) {
    map.setLayoutProperty(lineLayerId, "visibility", visibility);
  }
}

/**
 * Apply a filter to map layers to show only features matching a property value.
 *
 * This function applies Mapbox GL JS filter expressions to both fill and line layers.
 * The filter behavior changes based on the type of `propertyValue`:
 *
 * **Single value (string | number | boolean | null):**
 * - Creates an equality filter: `["==", ["get", propertyName], propertyValue]`
 * - Shows only features where the property exactly matches the value
 * - Example: `applyLayerFilter(map, "mangrove-change", "change_type", "Gain")`
 *   → Shows only features with `change_type === "Gain"`
 *
 * **Array of values:**
 * - Creates an "in" filter: `["in", ["get", propertyName], ["literal", propertyValue]]`
 * - Shows features where the property matches ANY value in the array
 * - Example: `applyLayerFilter(map, "mangrove-change", "change_type", ["Gain", "Loss"])`
 *   → Shows features with `change_type === "Gain" OR change_type === "Loss"`
 *
 * @param map - The Mapbox map instance
 * @param layerId - The base layer ID (without "-fill" or "-line" suffix)
 * @param propertyName - The GeoJSON feature property name to filter by
 * @param propertyValue - Single value for equality filter, or array for "in" filter
 *
 * @example
 * // Single value - show only gain
 * applyLayerFilter(map, "mangrove-change", "change_type", "Gain");
 *
 * @example
 * // Multiple values - show both gain and loss
 * applyLayerFilter(map, "mangrove-change", "change_type", ["Gain", "Loss"]);
 */
export function applyLayerFilter(
  map: Map,
  layerId: string,
  propertyName: string,
  propertyValue:
    | string
    | number
    | boolean
    | null
    | Array<string | number | boolean>
): void {
  const fillLayerId = `${layerId}-fill`;
  const lineLayerId = `${layerId}-line`;

  const filter: mapboxgl.ExpressionSpecification = Array.isArray(propertyValue)
    ? ["in", ["get", propertyName], ["literal", propertyValue]]
    : ["==", ["get", propertyName], propertyValue];

  if (map.getLayer(fillLayerId)) {
    map.setFilter(fillLayerId, filter);
  }
  if (map.getLayer(lineLayerId)) {
    map.setFilter(lineLayerId, filter);
  }
}

/**
 * Clear filter from map layers to show all features
 */
export function clearLayerFilter(map: Map, layerId: string): void {
  const fillLayerId = `${layerId}-fill`;
  const lineLayerId = `${layerId}-line`;

  if (map.getLayer(fillLayerId)) {
    map.setFilter(fillLayerId, null);
  }
  if (map.getLayer(lineLayerId)) {
    map.setFilter(lineLayerId, null);
  }
}

/**
 * Update GeoJSON data for an existing source
 */
export function updateSourceData(
  map: Map,
  sourceId: string,
  data: GeoJSON.FeatureCollection
): boolean {
  const source = map.getSource(sourceId);
  if (source && source.type === "geojson") {
    (source as mapboxgl.GeoJSONSource).setData(data);
    return true;
  }
  return false;
}

/**
 * Get visibility state from layers array
 */
export function getLayerVisibility(
  layers: MapLayer[],
  layerType: string
): "visible" | "none" {
  const layer = layers.find((l) => l.type === layerType);
  return layer?.visible ? "visible" : "none";
}

/**
 * Setup click handlers for a layer
 */
export function setupLayerClickHandlers(
  map: Map,
  layerId: string,
  onFeatureClick: (feature: Record<string, unknown>) => void
): () => void {
  const fillLayerId = `${layerId}-fill`;

  const handleClick = (e: mapboxgl.MapMouseEvent) => {
    if (e.features && e.features.length > 0) {
      onFeatureClick(e.features[0].properties as Record<string, unknown>);
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

  // Return cleanup function
  return () => {
    map.off("click", fillLayerId, handleClick);
    map.off("mouseenter", fillLayerId, handleMouseEnter);
    map.off("mouseleave", fillLayerId, handleMouseLeave);
  };
}
