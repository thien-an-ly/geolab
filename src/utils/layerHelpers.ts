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

/**
 * Get the display color for a layer type in the legend
 */
export function getLegendColor(type: MapLayerType): string {
  switch (type) {
    case "gain":
      return "#00ff00"; // Green
    case "loss":
      return "#ff0000"; // Red
    case "mangrove":
      return "#0000ff"; // Blue
    case "flood":
      return "#00bfff"; // Deep sky blue
    case "forest":
      return "#8B4513"; // Saddle brown
    case "carbon":
      return "#ff6600"; // Orange
    default:
      return "#808080"; // Gray
  }
}
