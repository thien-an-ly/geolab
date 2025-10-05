// Type definitions for Project GeoLab

export interface TimeSeriesData {
  date: string;
  [key: string]: string | number | undefined;
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
