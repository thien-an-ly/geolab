// Sample data for Kakadu Wetlands Sentinel
import type { TimeSeriesData } from "../types";

export const mockTimeSeriesData: TimeSeriesData[] = [
  {
    date: "2024-01",
    ndvi: 0.65,
    floodSignal: 0.3,
    droughtSignal: 0.1,
    carbonLoss: 0.05,
  },
  {
    date: "2024-02",
    ndvi: 0.68,
    floodSignal: 0.45,
    droughtSignal: 0.08,
    carbonLoss: 0.04,
  },
  {
    date: "2024-03",
    ndvi: 0.72,
    floodSignal: 0.6,
    droughtSignal: 0.05,
    carbonLoss: 0.03,
  },
  {
    date: "2024-04",
    ndvi: 0.7,
    floodSignal: 0.55,
    droughtSignal: 0.06,
    carbonLoss: 0.035,
  },
  {
    date: "2024-05",
    ndvi: 0.62,
    floodSignal: 0.25,
    droughtSignal: 0.15,
    carbonLoss: 0.08,
  },
  {
    date: "2024-06",
    ndvi: 0.58,
    floodSignal: 0.15,
    droughtSignal: 0.25,
    carbonLoss: 0.12,
  },
  {
    date: "2024-07",
    ndvi: 0.55,
    floodSignal: 0.1,
    droughtSignal: 0.35,
    carbonLoss: 0.15,
  },
  {
    date: "2024-08",
    ndvi: 0.53,
    floodSignal: 0.08,
    droughtSignal: 0.4,
    carbonLoss: 0.18,
  },
  {
    date: "2024-09",
    ndvi: 0.56,
    floodSignal: 0.12,
    droughtSignal: 0.32,
    carbonLoss: 0.14,
  },
  {
    date: "2024-10",
    ndvi: 0.6,
    floodSignal: 0.2,
    droughtSignal: 0.22,
    carbonLoss: 0.1,
  },
];

export const kakaduBounds: [[number, number], [number, number]] = [
  [131.88, -13.5],
  [133.0, -11.5],
];

export const kakaduCenter: [number, number] = [132.5, -12.5];
