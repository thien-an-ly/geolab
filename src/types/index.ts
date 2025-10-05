// Type definitions for Kakadu Wetlands Sentinel

export interface TimeSeriesData {
  date: string;
  ndvi: number;
  floodSignal?: number;
  droughtSignal?: number;
  carbonLoss?: number;
}

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  type: MapLayerType;
}

export type MapLayerType =
  | "gain"
  | "loss"
  | "mangrove"
  | "mangrove-change"
  | "flood"
  | "carbon"
  | "carbon-gain"
  | "carbon-loss";

export interface FeatureClickData {
  properties: Record<string, unknown>;
  layerType: MapLayerType;
}
