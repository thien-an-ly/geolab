// Centralized configuration for all GeoJSON data sources
import { type MapLayerType } from "../types";

export interface DataSourceConfig {
  id: string;
  name: string;
  layerType: MapLayerType;
  dataUrl: string;
  style: {
    fillColor: string;
    fillOpacity: number;
    lineColor: string;
    lineWidth: number;
  };
  metadata?: {
    description?: string;
    year?: string;
    source?: string;
  };
}

export const DATA_SOURCES_CONFIG: DataSourceConfig[] = [
  {
    id: "mangrove-gain",
    name: "Mangrove Gain",
    layerType: "gain",
    dataUrl: "/data/TestGain.geojson",
    style: {
      fillColor: "#00ff00",
      fillOpacity: 0.4,
      lineColor: "#00aa00",
      lineWidth: 2,
    },
    metadata: {
      description: "Areas showing increased mangrove coverage",
      year: "2020-2024",
      source: "Landsat analysis",
    },
  },
  {
    id: "mangrove-loss",
    name: "Mangrove Loss",
    layerType: "loss",
    dataUrl: "/data/TestLoss.geojson",
    style: {
      fillColor: "#ff0000",
      fillOpacity: 0.4,
      lineColor: "#aa0000",
      lineWidth: 2,
    },
    metadata: {
      description: "Areas with mangrove degradation",
      year: "2025",
      source: "Landsat analysis",
    },
  },
  {
    id: "mangrove",
    name: "Mangrove",
    layerType: "mangrove",
    dataUrl: "/data/TestMangrove.geojson",
    style: {
      fillColor: "#0000ff",
      fillOpacity: 0.4,
      lineColor: "#0000aa",
      lineWidth: 2,
    },
    metadata: {
      description: "Areas with mangrove vegetation",
      year: "2025",
      source: "Landsat analysis",
    },
  },
  {
    id: "flood",
    name: "Flood Inundation",
    layerType: "flood",
    dataUrl: "/data/flood/Kakadu_FloodOnly_2024.geojson",
    style: {
      fillColor: "#00bfff",
      fillOpacity: 0.5,
      lineColor: "#0080ff",
      lineWidth: 1.5,
    },
    metadata: {
      description: "Flood/drought signals from Sentinel-1 SAR",
      year: "2024",
      source: "Sentinel-1 SAR analysis",
    },
  },
  {
    id: "mangrove-change",
    name: "Mangrove Change",
    layerType: "mangrove-change",
    dataUrl: "/data/mangrove-change/Mangrove_Change_2023_2024.json",
    style: {
      fillColor: "#ffaa00",
      fillOpacity: 0.6,
      lineColor: "#ff8800",
      lineWidth: 1.5,
    },
    metadata: {
      description: "Year-over-year mangrove gain and loss analysis",
      year: "2023-2024",
      source: "Landsat time-series analysis",
    },
  },
  // Add more data sources here as needed
  // Example for future mangrove data:
  // {
  //   id: "mangrove-zones",
  //   name: "Mangrove Zones",
  //   layerType: "mangrove",
  //   dataUrl: "/data/Mangroves.geojson",
  //   style: {
  //     fillColor: "#2E7D32",
  //     fillOpacity: 0.5,
  //     lineColor: "#1B5E20",
  //     lineWidth: 1.5,
  //   },
  // },
];
