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
import type { TimeSeriesData } from "../types";

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  title: string;
}

export default function TimeSeriesChart({ data, title }: TimeSeriesChartProps) {
  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      <h3 style={{ marginBottom: "1rem", color: "#333" }}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ndvi"
            stroke="#22c55e"
            name="NDVI"
            strokeWidth={2}
          />
          {data[0]?.floodSignal !== undefined && (
            <Line
              type="monotone"
              dataKey="floodSignal"
              stroke="#3b82f6"
              name="Flood Signal"
              strokeWidth={2}
            />
          )}
          {data[0]?.droughtSignal !== undefined && (
            <Line
              type="monotone"
              dataKey="droughtSignal"
              stroke="#ef4444"
              name="Drought Signal"
              strokeWidth={2}
            />
          )}
          {data[0]?.carbonLoss !== undefined && (
            <Line
              type="monotone"
              dataKey="carbonLoss"
              stroke="#f59e0b"
              name="Carbon Loss"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
