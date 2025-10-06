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
    name: "Mangrove Areas (ha)",
    visible: true,
    type: "mangrove",
  },
  {
    id: "gain",
    name: "Mangrove Gain (ha)",
    visible: true,
    type: "gain",
  },
  {
    id: "loss",
    name: "Mangrove Loss (ha)",
    visible: true,
    type: "loss",
  },
  {
    id: "flood",
    name: "Seasonal Flood Inundation (ha)",
    visible: true,
    type: "flood",
  },
  {
    id: "carbon",
    name: "Carbon Stock Map 2014 (tCO₂)",
    visible: true,
    type: "carbon",
  },
  {
    id: "carbon-gain",
    name: "Carbon Stock Gain (tCO₂)",
    visible: true,
    type: "carbon-gain",
  },
  {
    id: "carbon-loss",
    name: "Carbon Stock Loss (tCO₂)",
    visible: true,
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
