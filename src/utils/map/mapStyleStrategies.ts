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
 * Layer styling strategies by layer type
 */
const LAYER_STYLE_STRATEGIES: Partial<
  Record<MapLayerType, (config: DataSourceConfig) => LayerStyleStrategy>
> = {
  "mangrove-change": mangroveChangeStrategy,
  // Add more custom strategies here as needed
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
