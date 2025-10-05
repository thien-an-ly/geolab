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
    case "flood":
      return "💧";
    case "carbon":
      return "💎";
    case "carbon-gain":
      return "📈";
    case "carbon-loss":
      return "📉";
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
      return "#8B4513"; // Saddle brown
    case "flood":
      return "#00bfff"; // Deep sky blue
    case "carbon":
      return "#FFD700"; // Gold
    case "carbon-gain":
      return "#7FFF00"; // Chartreuse
    case "carbon-loss":
      return "#FF1493"; // Deep pink
    default:
      return "#808080"; // Gray
  }
}
