import { memo } from "react";
import { formatCompactCurrency } from "@/lib/formatters";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Area,
  TooltipProps,
} from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";

export type StreakEntry = {
  streakLength: number;
  drawsCount: number;
  avgCollection: number;
  avgPrize: number;
};

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as StreakEntry;
  
  return (
    <div className="glass-card border border-primary/20 p-3 text-xs font-mono space-y-1">
      <p className="text-foreground font-bold text-sm mb-1.5">
        Sequência de {data.streakLength} acúmulo{data.streakLength !== 1 ? "s" : ""}
      </p>
      <p className="text-muted-foreground">
        Ocorrências: <span className="text-foreground">{data.drawsCount}</span>
      </p>
      <p className="text-muted-foreground">
        Arrecadação média:{" "}
        <span className="text-emerald-400 font-semibold">
          {formatCompactCurrency(data.avgCollection)}
        </span>
      </p>
      {data.avgPrize > 0 && (
        <p className="text-muted-foreground">
          Prêmio médio:{" "}
          <span className="text-amber-400 font-semibold">
            {formatCompactCurrency(data.avgPrize)}
          </span>
        </p>
      )}
    </div>
  );
});

export const StreakChartTab = memo(function StreakChartTab({ data }: { data: StreakEntry[] }) {
  return (
    <div className="glass-card p-4">
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ left: 8, right: 8, top: 8, bottom: 4 }}
        >
          <defs>
            <linearGradient id="gradCollection" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.EMERALD} stopOpacity={0.4} />
              <stop offset="95%" stopColor={CHART_COLORS.EMERALD} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradPrize" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.AMBER} stopOpacity={0.4} />
              <stop offset="95%" stopColor={CHART_COLORS.AMBER} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} />
          <XAxis
            dataKey="streakLength"
            tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
            label={{
              value: "Nº de acúmulos",
              position: "insideBottom",
              offset: -2,
              fontSize: 10,
              fill: "#64748B",
            }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: CHART_COLORS.TICK_LABEL }}
            tickFormatter={(v: number) => formatCompactCurrency(v)}
            width={64}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 10, fill: CHART_COLORS.TICK_LABEL }}
            tickFormatter={(v: number) => formatCompactCurrency(v)}
            width={64}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="avgCollection"
            stroke={CHART_COLORS.EMERALD}
            fill="url(#gradCollection)"
            strokeWidth={2}
            name="Arrecadação Média"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgPrize"
            stroke={CHART_COLORS.AMBER}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.AMBER, r: 3 }}
            name="Prêmio Médio"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});
