import { memo, useMemo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import { formatCompactCurrency } from "@/lib/formatters";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from "recharts";
import {
  CHART_COLORS,
  CHART_DIMENSIONS,
  MEGA_DA_VIRADA_START_YEAR,
} from "@/domain/lottery/lottery.constants";

const LEGEND_ITEMS = [
  { color: CHART_COLORS.AMBER, label: "Prêmio máximo do ano" },
  { color: CHART_COLORS.BLUE, label: "Prêmio médio do ano" },
];

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card border border-primary/20 p-3 text-xs font-mono space-y-1">
      <p className="text-foreground font-bold">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatCompactCurrency(p.value as number)}
        </p>
      ))}
    </div>
  );
});

export default function PrizeEvolutionChart() {
  const stats = useLotteryStore((state) => state.stats);
  const data = stats?.prizeEvolution;

  if (!stats || !data) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const megaViradaYear = MEGA_DA_VIRADA_START_YEAR;

  return (
    <div className="glass-card p-4">
      <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.DEFAULT_HEIGHT}>
        <AreaChart data={data} margin={CHART_DIMENSIONS.MARGIN}>
          <defs>
            <linearGradient id="maxPrizeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.AMBER} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.AMBER} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="avgPrizeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.BLUE} stopOpacity={0.25} />
              <stop offset="95%" stopColor={CHART_COLORS.BLUE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
          />
          <YAxis
            tickFormatter={formatCompactCurrency}
            tick={{ fontSize: 10, fill: CHART_COLORS.TICK_LABEL }}
            width={64}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            x={megaViradaYear}
            stroke={CHART_COLORS.EMERALD}
            strokeDasharray="4 4"
            label={{
              value: "Mega da Virada",
              position: "top",
              fontSize: 10,
              fill: CHART_COLORS.EMERALD,
            }}
          />
          <Area
            type="monotone"
            dataKey="maxPrize"
            name="Prêmio Máximo"
            stroke={CHART_COLORS.AMBER}
            strokeWidth={2}
            fill="url(#maxPrizeGrad)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="avgPrize"
            name="Prêmio Médio"
            stroke={CHART_COLORS.BLUE}
            strokeWidth={2}
            fill="url(#avgPrizeGrad)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-3 text-xs text-muted-foreground">
        {LEGEND_ITEMS.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-1.5 rounded-full"
              style={{ backgroundColor: c.color }}
            />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}
