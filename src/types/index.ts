// Type definitions for Kakadu Wetlands Sentinel

export interface EcologicalIndicator {
  id: string;
  name: string;
  type: "mangrove" | "degraded-forest" | "hydrological-shift";
  ndvi: number;
  timestamp: string;
  coordinates: [number, number];
}

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
  type: "mangrove" | "forest" | "water" | "carbon" | "gain" | "loss";
}

export interface KakaduRegion {
  name: string;
  bounds: [[number, number], [number, number]];
  center: [number, number];
  zoom: number;
}
