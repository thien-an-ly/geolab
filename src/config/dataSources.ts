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
    dataUrl: "/data/mangrove/mangrove_vector_2024.geojson",
    style: {
      fillColor: "#8B4513",
      fillOpacity: 0.4,
      lineColor: "#5a2d0a",
      lineWidth: 2,
    },
    metadata: {
      description: "Areas with mangrove vegetation",
      year: "2014-2024",
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
  {
    id: "carbon",
    name: "Estimated Carbon (TCO2)",
    layerType: "carbon",
    dataUrl: "/data/carbon/Vecotirsed_CarbonStock2014_tco2.json",
    style: null,
    metadata: {
      description: "Above ground biomass * IPCC default value",
      year: "2014",
      source:
        "NASA Earth Data Global Mangrove distribution (above ground biomass & canopy height)",
    },
  },
  {
    id: "carbon-gain",
    name: "Estimated Carbon gain (TCO2)",
    layerType: "carbon-gain",
    dataUrl: "/data/carbon-gain/CarbonGain_1424.geojson",
    style: null,
    metadata: {
      description:
        "LANDSAT-derived mangrove gain map * average above ground biomass value",
      year: "2014-2024",
      source:
        "NASA Earth Data Global Mangrove distribution (above ground biomass & canopy height) + LANDSAT",
    },
  },
  {
    id: "carbon-loss",
    name: "Estimated Carbon loss (TCO2)",
    layerType: "carbon-loss",
    dataUrl: "/data/carbon-loss/CarbonLoss1424.geojson",
    style: null,
    metadata: {
      description:
        "LANDSAT-derived mangrove loss map * above ground biomass value",
      year: "2014-2024",
      source:
        "NASA Earth Data Global Mangrove distribution (above ground biomass & canopy height)",
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
