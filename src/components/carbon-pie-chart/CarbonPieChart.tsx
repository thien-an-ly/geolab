import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { CarbonStats } from "../../utils/loadStatsData";
import type { PieChartDataItem } from "../../types";
import "./CarbonPieChart.css";

interface CarbonPieChartProps {
  data: CarbonStats;
}

export function CarbonPieChart({ data }: CarbonPieChartProps) {
  const { carbonStock, carbonLoss } = data;

  const remaining = carbonStock - carbonLoss;
  const lossPercentage = ((carbonLoss / carbonStock) * 100).toFixed(2);

  const chartData: PieChartDataItem[] = [
    { name: "Remaining Stock", value: remaining, color: "#2dd4bf" },
    { name: "Carbon Loss", value: carbonLoss, color: "#ef4444" },
  ];

  return (
    <div className="carbon-pie-chart">
      <h3>Carbon Stock vs Loss (2014-2024)</h3>
      <div className="carbon-pie-content">
        <div className="carbon-pie-chart-wrapper">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="42%"
                labelLine={false}
                outerRadius={85}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)} ha`}
                contentStyle={{
                  backgroundColor: "var(--color-background-overlay)",
                  border: "1px solid var(--color-border-primary)",
                  borderRadius: "4px",
                  color: "var(--color-text-primary)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="square"
                formatter={(value: string) => (
                  <span className="pie-legend-text">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="carbon-stats">
          <p>
            <strong>Total Carbon Stock (2014):</strong> {carbonStock.toFixed(2)}{" "}
            ha
          </p>
          <p>
            <strong>Carbon Loss (2014-2024):</strong> {carbonLoss.toFixed(2)} ha
          </p>
          <p>
            <strong>Loss Percentage:</strong> {lossPercentage}%
          </p>
        </div>
      </div>
    </div>
  );
}
