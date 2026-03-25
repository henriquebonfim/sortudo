import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  CartesianGrid,
} from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { ChartTooltip } from "@/components/shared/ChartTooltip";
const STATE_COLORS: Record<string, string> = {
  SP: CHART_COLORS.AMBER,
  MG: CHART_COLORS.RED,
  RJ: CHART_COLORS.VIOLET,
  PR: CHART_COLORS.BLUE,
  RS: CHART_COLORS.EMERALD,
  SC: "#06B6D4",
  BA: "#F97316",
  GO: "#84CC16",
  PB: "#EC4899",
  PE: "#14B8A6",
  CE: "#6366F1",
  ELECT: "#94A3B8",
};

const STATE_NAMES: Record<string, string> = {
  ELECT: "Canal Eletrônico",
};

interface GeoDataPoint {
  state: string;
  total: number;
  percentage: number;
}

const tickFormatter = (v: string) => (STATE_NAMES[v] ? "🌐" : v);
const percentageFormatter = (v: number) => `${v}%`;

export const GeoBarChart = memo(function GeoBarChart({ data }: { data: GeoDataPoint[] }) {
  return (
    <div className="glass-card p-4">
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 8, right: 48, top: 4, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.GRID_STROKE}
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
          />
          <YAxis
            dataKey="state"
            type="category"
            tick={{ fontSize: 12, fill: "#CBD5E1", fontFamily: "monospace" }}
            width={32}
            tickFormatter={tickFormatter}
          />
          <Tooltip
            content={
              <ChartTooltip 
                items={[
                  { label: "Ganhadores", value: "total" },
                  { label: "Percentual", value: "percentage", suffix: "%", color: "text-primary" }
                ]}
              />
            }
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={24}>
            {data.map((d) => (
              <Cell key={d.state} fill={STATE_COLORS[d.state] ?? "#6366F1"} />
            ))}
            <LabelList
              dataKey="percentage"
              position="right"
              formatter={percentageFormatter}
              style={{
                fontSize: 10,
                fill: CHART_COLORS.TICK_LABEL,
                fontFamily: "monospace",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
