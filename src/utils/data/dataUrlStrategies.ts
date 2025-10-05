import type { MapLayerType } from "../../types";
import type { DataSourceConfig } from "../../config/dataSources";

/**
 * Strategy for generating data URLs based on year
 */
type DataUrlStrategy = (year: number) => string;

/**
 * Flood data URL strategy
 */
const floodUrlStrategy: DataUrlStrategy = (year) =>
  `${import.meta.env.BASE_URL}data/flood/Kakadu_FloodOnly_${year}.geojson`;

/**
 * Mangrove data URL strategy
 */
const mangroveUrlStrategy: DataUrlStrategy = (year) =>
  `${import.meta.env.BASE_URL}data/mangrove/mangrove_vector_${year}.geojson`;

/**
 * Mangrove change data URL strategy
 * Year represents the end of a span (e.g., year 2015 = 2014→2015 change)
 */
const mangroveChangeUrlStrategy: DataUrlStrategy = (year) => {
  const previousYear = year - 1;
  return `${
    import.meta.env.BASE_URL
  }data/mangrove-change/Mangrove_Change_${previousYear}_${year}.json`;
};

/**
 * Default URL strategy - returns the config's default URL
 */
export const defaultUrlStrategy =
  (config: DataSourceConfig): DataUrlStrategy =>
  () =>
    config.dataUrl;

/**
 * Data URL strategies by layer type
 */
export const DATA_URL_STRATEGIES: Partial<
  Record<MapLayerType, DataUrlStrategy>
> = {
  flood: floodUrlStrategy,
  mangrove: mangroveUrlStrategy,
  "mangrove-change": mangroveChangeUrlStrategy,
};
