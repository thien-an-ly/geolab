import type { DataSourceConfig } from "../../config/dataSources";
import type { MapLayerType } from "../../types";

/**
 * Style strategy for a map layer
 */
export interface LayerStyleStrategy {
  fillColor: string | mapboxgl.ExpressionSpecification;
  lineColor: string | mapboxgl.ExpressionSpecification;
  fillOpacity: number;
  lineWidth: number;
}

/**
 * Default styling strategy - uses config values or defaults
 */
const defaultStrategy = (config: DataSourceConfig): LayerStyleStrategy => ({
  fillColor: config.style?.fillColor ?? "#808080",
  lineColor: config.style?.lineColor ?? "#606060",
  fillOpacity: config.style?.fillOpacity ?? 0.5,
  lineWidth: config.style?.lineWidth ?? 1.5,
});

/**
 * Mangrove change styling strategy - property-based colors
 */
const mangroveChangeStrategy = (): LayerStyleStrategy => ({
  fillColor: [
    "match",
    ["get", "change_type"],
    "Gain",
    "#00ff00", // Green for gain
    "Loss",
    "#ff0000", // Red for loss
    "#808080", // Gray for no change
  ],
  lineColor: [
    "match",
    ["get", "change_type"],
    "Gain",
    "#00aa00", // Dark green for gain
    "Loss",
    "#aa0000", // Dark red for loss
    "#606060", // Dark gray for no change
  ],
  fillOpacity: 0.6,
  lineWidth: 1.5,
});

/**
 * Carbon heatmap gradient strategy - interpolates gold color based on gridcode
 */
const carbonStrategy = (config: DataSourceConfig): LayerStyleStrategy => ({
  fillColor: [
    "interpolate",
    ["linear"],
    ["get", "gridcode"],
    0,
    "rgba(255, 215, 0, 0.1)", // Gold with 10% opacity at min
    50,
    "rgba(255, 215, 0, 0.5)", // Gold with 50% opacity at mid
    100,
    "rgba(255, 215, 0, 1)", // Gold with 100% opacity at max
  ],
  lineColor: config.style?.lineColor ?? "#FFD700",
  fillOpacity: 1, // Use 1 since opacity is in the color
  lineWidth: 0.5,
});

/**
 * Carbon gain heatmap gradient strategy - interpolates chartreuse color
 */
const carbonGainStrategy = (config: DataSourceConfig): LayerStyleStrategy => ({
  fillColor: [
    "interpolate",
    ["linear"],
    ["get", "gridcode"],
    0,
    "rgba(127, 255, 0, 0.1)", // Chartreuse with 10% opacity at min
    50,
    "rgba(127, 255, 0, 0.5)", // Chartreuse with 50% opacity at mid
    100,
    "rgba(127, 255, 0, 1)", // Chartreuse with 100% opacity at max
  ],
  lineColor: config.style?.lineColor ?? "#7FFF00",
  fillOpacity: 1, // Use 1 since opacity is in the color
  lineWidth: 0.5,
});

/**
 * Carbon loss heatmap gradient strategy - interpolates deep pink color
 */
const carbonLossStrategy = (config: DataSourceConfig): LayerStyleStrategy => ({
  fillColor: [
    "interpolate",
    ["linear"],
    ["get", "gridcode"],
    0,
    "rgba(255, 20, 147, 0.1)", // Deep pink with 10% opacity at min
    50,
    "rgba(255, 20, 147, 0.5)", // Deep pink with 50% opacity at mid
    100,
    "rgba(255, 20, 147, 1)", // Deep pink with 100% opacity at max
  ],
  lineColor: config.style?.lineColor ?? "#FF1493",
  fillOpacity: 1, // Use 1 since opacity is in the color
  lineWidth: 0.5,
});

/**
 * Layer styling strategies by layer type
 */
const LAYER_STYLE_STRATEGIES: Partial<
  Record<MapLayerType, (config: DataSourceConfig) => LayerStyleStrategy>
> = {
  "mangrove-change": mangroveChangeStrategy,
  carbon: carbonStrategy,
  "carbon-gain": carbonGainStrategy,
  "carbon-loss": carbonLossStrategy,
};

/**
 * Get paint properties for a layer based on its type
 */
export function getLayerStyleStrategy(
  config: DataSourceConfig
): LayerStyleStrategy {
  const strategy = LAYER_STYLE_STRATEGIES[config.layerType] || defaultStrategy;
  return strategy(config);
}
