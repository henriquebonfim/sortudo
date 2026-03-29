import { useState, useMemo } from "react";
import { LotteryStats } from "@/domain/lottery/lottery.types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { ChartTooltip } from "@/components/shared/ChartTooltip";
import { FilterMode, FILTER_OPTIONS, LEGEND_ITEMS, getColor } from "./frequency-bar.constants";

interface FrequencyBarChartProps {
  stats?: LotteryStats | null;
}

export default function FrequencyBarChart({ stats }: FrequencyBarChartProps) {
  const [filter, setFilter] = useState<FilterMode>("top10");

  const data = stats?.frequencies;

  const chartData = useMemo(() => {
    if (!data?.ranking) return [];
    const ranking = [...data.ranking];
    if (filter === "top10") return ranking.slice(0, 10);
    if (filter === "bottom10") return ranking.slice(-10).reverse();
    return ranking;
  }, [data, filter]);

  if (!data?.ranking) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const height = filter === "all" ? 480 : 300;
  const totalItems = data.ranking.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`pill-btn ${filter === f.id ? "pill-btn-active" : "pill-btn-inactive"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="glass-card p-4">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
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
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <YAxis
              dataKey="number"
              type="category"
              tick={{ fontSize: 12, fill: "#CBD5E1", fontFamily: "monospace" }}
              width={32}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="frequency" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.number}
                  fill={getColor(entry.position, totalItems)}
                />
              ))}
              <LabelList
                dataKey="percentage"
                position="right"
                formatter={(v: number) => `${v}%`}
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

      <div className="flex gap-4 text-xs text-muted-foreground">
        {LEGEND_ITEMS.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: c.color }}
            />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}
