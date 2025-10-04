// Centralized configuration for all GeoJSON data sources

export interface DataSourceConfig {
  id: string;
  name: string;
  layerType: "gain" | "loss" | "mangrove" | "forest" | "water" | "carbon";
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

export const DATA_SOURCES: DataSourceConfig[] = [
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

// Helper to get data source by layer type
export function getDataSourceByLayerType(
  layerType: string
): DataSourceConfig | undefined {
  return DATA_SOURCES.find((source) => source.layerType === layerType);
}

// Helper to get all data source IDs
export function getAllDataSourceIds(): string[] {
  return DATA_SOURCES.map((source) => source.id);
}
