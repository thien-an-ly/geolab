// Default UI layer configuration
import type { MapLayer, MapLayerType } from "../types";

/**
 * Default layers configuration for the application.
 * This represents the UI layer controls, not the underlying data sources.
 *
 * Note: Multiple UI layers may share the same data source
 * (e.g., gain and loss both use the mangrove-change data source).
 */
export const LAYERS: MapLayer[] = [
  {
    id: "mangrove",
    name: "Mangrove Areas (Ha)",
    visible: false,
    type: "mangrove",
  },
  {
    id: "gain",
    name: "Mangrove Gain (Ha)",
    visible: false,
    type: "gain",
  },
  {
    id: "loss",
    name: "Mangrove Loss (Ha)",
    visible: false,
    type: "loss",
  },
  {
    id: "flood",
    name: "Flood Inundation (Ha)",
    visible: false,
    type: "flood",
  },
  {
    id: "carbon",
    name: "Carbon (TCO2)",
    visible: false,
    type: "carbon",
  },
  {
    id: "carbon-gain",
    name: "Carbon Gain (TCO2)",
    visible: false,
    type: "carbon-gain",
  },
  {
    id: "carbon-loss",
    name: "Carbon Loss (TCO2)",
    visible: false,
    type: "carbon-loss",
  },
];

export const ENVIRONMENTAL_LAYERS: MapLayerType[] = [
  "flood",
  "carbon",
  "carbon-gain",
  "carbon-loss",
];

export const VEGETATION_LAYERS: MapLayerType[] = ["gain", "loss", "mangrove"];
