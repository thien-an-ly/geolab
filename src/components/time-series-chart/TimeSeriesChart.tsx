import {
  LineChart,
  Line,
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
  ndvi: "#4ade80", // --color-success
  flood: "#63c9d6", // --color-cyan
  drought: "#ff6666", // --color-error
  carbon: "#ffd700", // --color-warning
  grid: "#2d4586", // --color-navy-light
  text: "#cccccc", // --color-gray-300
};

export function TimeSeriesChart({ data, title }: TimeSeriesChartProps) {
  return (
    <div className="time-series-chart-container">
      <h3 className="time-series-chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
          <YAxis
            tick={{ fontSize: 12, fill: COLORS.text }}
            stroke={COLORS.grid}
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
          <Line
            type="monotone"
            dataKey="ndvi"
            stroke={COLORS.ndvi}
            name="NDVI"
            strokeWidth={2}
            dot={{ fill: COLORS.ndvi, r: 3 }}
            activeDot={{ r: 5 }}
          />
          {data[0]?.floodSignal !== undefined && (
            <Line
              type="monotone"
              dataKey="floodSignal"
              stroke={COLORS.flood}
              name="Flood Signal"
              strokeWidth={2}
              dot={{ fill: COLORS.flood, r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
          {data[0]?.droughtSignal !== undefined && (
            <Line
              type="monotone"
              dataKey="droughtSignal"
              stroke={COLORS.drought}
              name="Drought Signal"
              strokeWidth={2}
              dot={{ fill: COLORS.drought, r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
          {data[0]?.carbonLoss !== undefined && (
            <Line
              type="monotone"
              dataKey="carbonLoss"
              stroke={COLORS.carbon}
              name="Carbon Loss"
              strokeWidth={2}
              dot={{ fill: COLORS.carbon, r: 3 }}
              activeDot={{ r: 5 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
