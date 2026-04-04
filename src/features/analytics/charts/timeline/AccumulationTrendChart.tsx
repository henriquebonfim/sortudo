import { memo, useMemo } from "react";
import { useAccumulationTrend } from "@/application/selectors";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string; dataKey: string }>;
  label?: string;
}

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="glass-card border border-border p-3 text-xs font-mono space-y-1">
      <p className="text-foreground font-bold">{label}</p>
      {payload.map((p) => {
        const percentage = total > 0 ? ((p.value / total) * 100).toFixed(1) : "0.0";
        return (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {p.value} ({percentage}%)
          </p>
        );
      })}
      <p className="text-muted-foreground/70 border-t border-border/30 pt-1">
        Total: {total}
      </p>
    </div>
  );
});

interface AverageIndicatorProps {
  avgPct: string;
}

const AverageIndicator = memo(function AverageIndicator({ avgPct }: AverageIndicatorProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl border border-violet-500/20 bg-violet-500/10"
    >
      <span
        className="text-2xl font-display font-bold text-violet-500"
      >
        {avgPct}%
      </span>
      <span className="text-sm text-muted-foreground">
        dos sorteios acumulam em média — o prêmio cresce e atrai mais apostadores
      </span>
    </div>
  );
});

export function AccumulationTrendChart() {
  const data = useAccumulationTrend();

  const avgPct = useMemo(() => {
    if (!data || data.length === 0) return "0";
    const sum = data.reduce((acc, current) => acc + current.pctAccumulated, 0);
    return (sum / data.length).toFixed(1);
  }, [data]);

  if (!data || data.length === 0) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="space-y-4">
      <AverageIndicator avgPct={avgPct} />
      <div className="glass-card p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 4 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.GRID_STROKE}
              vertical={false}
            />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }} />
            <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: CHART_COLORS.CURSOR }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
            <Bar
              dataKey="nonAccumulated"
              name="Com Ganhador"
              stackId="a"
              fill={CHART_COLORS.EMERALD}
              fillOpacity={0.8}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="accumulated"
              name="Acumulado"
              stackId="a"
              fill={CHART_COLORS.VIOLET}
              fillOpacity={0.85}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
