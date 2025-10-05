import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TimeSeriesData } from "../../types";
import "./TimeSeriesChart.css";

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  title: string;
}

// Color palette from app theme.css
const COLORS = {
  ndvi: "#4ade80", // --color-success (green)
  flood: "#63c9d6", // --color-cyan (blue)
  mangrove: "#8B4513", // Saddle brown
  carbon: "#ffd700", // --color-warning (gold)
  grid: "#2d4586", // --color-navy-light
  text: "#cccccc", // --color-gray-300
};

export function TimeSeriesChart({ data, title }: TimeSeriesChartProps) {
  // Check if any data point has each property (not just the first one)
  const hasMangroveNDVI = data.some((d) => d.mangrove_ndvi_mean !== undefined);
  const hasFloodArea = data.some(
    (d) => d.flood_total_flood_area_ha !== undefined
  );
  const hasMangroveArea = data.some(
    (d) => d.mangrove_area_total_mangrove_area_ha !== undefined
  );

  return (
    <div className="time-series-chart-container">
      <h3 className="time-series-chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={COLORS.grid}
            opacity={0.3}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: COLORS.text }}
            angle={-45}
            textAnchor="end"
            height={80}
            stroke={COLORS.grid}
          />
          {/* Left Y-axis for NDVI (0-1 scale) */}
          <YAxis
            yAxisId="left"
            domain={[0, 1]}
            tick={{ fontSize: 12, fill: COLORS.text }}
            stroke={COLORS.grid}
            label={{
              value: "NDVI",
              angle: -90,
              position: "insideLeft",
              style: { fill: COLORS.ndvi, fontSize: 12 },
            }}
          />
          {/* Right Y-axis for Area (hectares) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: COLORS.text }}
            stroke={COLORS.grid}
            label={{
              value: "Area (ha)",
              angle: 90,
              position: "insideRight",
              style: { fill: COLORS.flood, fontSize: 12 },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 41, 0.95)",
              border: "1px solid #2d4586",
              borderRadius: "4px",
              color: "#ffffff",
            }}
            labelStyle={{ color: "#63c9d6", fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ color: "#cccccc" }} />
          {/* Mangrove NDVI - Line */}
          {hasMangroveNDVI && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="mangrove_ndvi_mean"
              stroke={COLORS.mangrove}
              name="Kakadu Mangrove NDVI"
              strokeWidth={2}
              dot={{ fill: COLORS.mangrove, r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
          {/* Flood Area - Bar */}
          {hasFloodArea && (
            <Bar
              yAxisId="right"
              dataKey="flood_total_flood_area_ha"
              fill={COLORS.flood}
              name="Total Flood Area (ha)"
              opacity={0.8}
            />
          )}
          {/* Mangrove Area - Bar */}
          {hasMangroveArea && (
            <Bar
              yAxisId="right"
              dataKey="mangrove_area_total_mangrove_area_ha"
              fill={COLORS.carbon}
              name="Total Mangrove Area (ha)"
              opacity={0.8}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
