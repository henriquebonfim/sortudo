import { useStreakEconomics } from '@/features/analytics/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/constants/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { StreakTooltip } from '@/features/analytics/components/charts/chart-tooltips';

/** Max streak length to render — trims long tail for readability. */
const MAX_STREAK_DISPLAY = 14;

export function StreakFrequencyChart() {
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
        <ResponsiveContainer width="100%" height="100%">
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
