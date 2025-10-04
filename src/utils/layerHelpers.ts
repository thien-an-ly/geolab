import type { MapLayerType } from "../types";

/**
 * Get the emoji icon for a given map layer type
 */
export function getLayerIcon(type: MapLayerType): string {
  switch (type) {
    case "gain":
      return "🟢";
    case "loss":
      return "🔴";
    case "mangrove":
      return "🌿";
    case "forest":
      return "🌲";
    case "flood":
      return "💧";
    case "carbon":
      return "⚠️";
    default:
      return "📍";
  }
}
