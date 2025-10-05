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
  } | null;
  metadata?: {
    description?: string;
    year?: string;
    source?: string;
  };
}

export const DATA_SOURCES_CONFIG: DataSourceConfig[] = [
  {
    id: "mangrove-change",
    name: "Mangrove Change",
    layerType: "mangrove-change", // Shared source for gain and loss UI layers
    dataUrl: "/data/mangrove-change/Mangrove_Change_2023_2024.json",
    style: null, // defined by strategy
    metadata: {
      description: "Areas showing mangrove coverage changes",
      year: "2014-2024",
      source: "Landsat time-series analysis",
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
      year: "2016-2024",
      source: "Sentinel-1 SAR analysis",
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
