import type { DataSourceConfig } from "../config/dataSources";
import type { MapLayerType } from "../types";
import {
  DATA_URL_STRATEGIES,
  defaultUrlStrategy,
} from "./data/dataUrlStrategies";

/**
 * Get data URL for a specific year and layer type
 */
export function getDataUrlForYear(
  layerType: MapLayerType,
  year: number,
  config?: DataSourceConfig
): string {
  const strategy =
    DATA_URL_STRATEGIES[layerType] ||
    (config ? defaultUrlStrategy(config) : () => "");
  return strategy(year);
}

/**
 * Get data source by layer type
 */
export function getDataSourceByLayerType(
  sources: DataSourceConfig[],
  layerType: string
): DataSourceConfig | undefined {
  return sources.find((source) => source.layerType === layerType);
}

/**
 * Get all data source IDs
 */
export function getAllDataSourceIds(sources: DataSourceConfig[]): string[] {
  return sources.map((source) => source.id);
}

/**
 * Update data source URLs for a given year
 */
export function updateDataSourcesForYear(
  sources: DataSourceConfig[],
  year: number
): DataSourceConfig[] {
  return sources.map((source) => ({
    ...source,
    dataUrl: getDataUrlForYear(source.layerType, year, source),
  }));
}
