import { useAccumulationTrend } from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { memo, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string; dataKey: string }>;
  label?: string;
}

import { useStreakEconomics } from '@/hooks/use-analytics';
import { useLotteryMeta } from '@/store/selectors';
import { TooltipContentProps } from 'recharts';

interface StreakEntry {
  streak: number;
  count: number;
}

interface AverageIndicatorProps {
  avgPct: string;
}

/** Max streak length to render — trims long tail for readability. */
const MAX_STREAK_DISPLAY = 14;

const StreakTooltip = memo(function StreakTooltip({
  active,
  payload,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as StreakEntry;

  return (
    <div className="glass-card border border-border p-3 text-xs font-mono space-y-1">
      <p className="text-foreground font-bold text-sm mb-1.5">
        Sequência de {data.streak} acúmulo{data.streak !== 1 ? 's' : ''}
      </p>
      <p className="text-muted-foreground">
        Ocorrências: <span className="text-info font-semibold">{data.count} sorteios</span>
      </p>
    </div>
  );
});

function StreakFrequencyChart() {
  const meta = useLotteryMeta();
  const economics = useStreakEconomics();

  const chartData = useMemo(() => {
    if (!economics) return [];

    const mapped = economics
      .filter((d) => d.streak <= MAX_STREAK_DISPLAY)
      .map((d) => ({ streak: d.streak, count: d.count }));

    // Fill in gaps so the axis is continuous from 0 to MAX_STREAK_DISPLAY
    for (let i = 0; i <= MAX_STREAK_DISPLAY; i++) {
      if (!mapped.find((f) => f.streak === i)) {
        mapped.push({ streak: i, count: 0 });
      }
    }

    return mapped.sort((a, b) => a.streak - b.streak);
  }, [economics]);

  if (!meta || !economics || chartData.length === 0) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="glass-card p-4">
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
          <BarChart data={chartData} margin={{ left: -10, top: 10, bottom: 10, right: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.GRID_STROKE}
              vertical={false}
            />
            <XAxis
              dataKey="streak"
              tick={{ fontSize: 10, fill: CHART_COLORS.TICK_LABEL }}
              label={{
                value: 'Nº de Acúmulos',
                position: 'insideBottom',
                offset: -5,
                fill: '#64748B',
                fontSize: 10,
              }}
            />
            <YAxis tick={{ fontSize: 10, fill: CHART_COLORS.TICK_LABEL }} />
            <Tooltip
              content={(props) => <StreakTooltip {...props} />}
              cursor={{ fill: CHART_COLORS.CURSOR }}
            />
            <Bar dataKey="count" fill={CHART_COLORS.BLUE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const CustomTooltip = memo(function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="glass-card border border-border p-3 text-xs font-mono space-y-1">
      <p className="text-foreground font-bold">{label}</p>
      {payload.map((p) => {
        const percentage = total > 0 ? ((p.value / total) * 100).toFixed(1) : '0.0';
        return (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {p.value} ({percentage}%)
          </p>
        );
      })}
      <p className="text-muted-foreground/70 border-t border-border pt-1">Total: {total}</p>
    </div>
  );
});

const AverageIndicator = memo(function AverageIndicator({ avgPct }: AverageIndicatorProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-violet-500/20 bg-violet-500/10">
      <span className="text-2xl font-display font-bold text-violet-500">{avgPct}%</span>
      <span className="text-sm text-muted-foreground">
        dos sorteios acumulam em média — o prêmio cresce e atrai mais apostadores
      </span>
    </div>
  );
});

export function AccumulationTrendChart() {
  const data = useAccumulationTrend();

  const avgPct = useMemo(() => {
    if (!data || data.length === 0) return '0';
    const sum = data.reduce((acc, current) => acc + current.pctAccumulated, 0);
    return (sum / data.length).toFixed(1);
  }, [data]);

  if (!data || data.length === 0) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={500} minWidth={0} minHeight={1}>
        <BarChart data={data} margin={{ left: -30, right: 12, top: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }} />
          <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART_COLORS.CURSOR }} />
          <Legend
            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
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

      <AverageIndicator avgPct={avgPct} />

      <StreakFrequencyChart />
    </div>
  );
}
