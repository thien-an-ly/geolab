import type { Map } from "mapbox-gl";
import type { DataSourceConfig } from "../config/dataSources";
import type { MapLayer } from "../types";

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

  // Add fill layer
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

  // Add line layer
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
