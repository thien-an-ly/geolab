// Default UI layer configuration
import type { MapLayer } from "../types";

/**
 * Default layers configuration for the application.
 * This represents the UI layer controls, not the underlying data sources.
 *
 * Note: Multiple UI layers may share the same data source
 * (e.g., gain and loss both use the mangrove-change data source).
 */
export const LAYERS: MapLayer[] = [
  {
    id: "gain",
    name: "Mangrove Gain (2014-2024)",
    visible: false,
    type: "gain",
  },
  {
    id: "loss",
    name: "Mangrove Loss (2014-2024)",
    visible: false,
    type: "loss",
  },
  {
    id: "mangrove",
    name: "Mangrove Zones",
    visible: false,
    type: "mangrove",
  },
  {
    id: "forest",
    name: "Degraded Forests",
    visible: false,
    type: "forest",
  },
  {
    id: "flood",
    name: "Flood Inundation",
    visible: false,
    type: "flood",
  },
  {
    id: "carbon",
    name: "Carbon Loss Areas",
    visible: false,
    type: "carbon",
  },
];
