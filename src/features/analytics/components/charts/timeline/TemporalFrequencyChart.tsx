import { useTemporalFrequency } from '@/features/analytics/hooks/use-analytics';
import { CHART_COLORS, CHART_DIMENSIONS } from '@/shared/constants/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { memo, useMemo } from 'react';
import type { TooltipContentProps } from 'recharts';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PALETTE = [
  CHART_COLORS.AMBER,
  CHART_COLORS.RED,
  CHART_COLORS.BLUE,
  CHART_COLORS.EMERALD,
  CHART_COLORS.VIOLET,
  '#06B6D4',
  '#F97316',
  '#84CC16',
  '#EC4899',
  '#14B8A6',
];

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card border border-border p-3 text-xs font-mono space-y-1 max-w-[180px]">
      <p className="text-foreground font-bold">{label}</p>
      {payload.map((p) => (
        <p key={String(p.dataKey)} style={{ color: p.color }}>
          {p.name}: {p.value}×
        </p>
      ))}
    </div>
  );
});

const legendFormatter = (value: string) => (
  <span className="text-xs font-mono text-muted-foreground">Nº {value}</span>
);

export function TemporalFrequencyChart() {
  const rawData = useTemporalFrequency();
  const meta = useLotteryMeta();

  const { chartData, topNumbers } = useMemo(() => {
    if (!rawData || !rawData.length) {
      return { chartData: [], topNumbers: [] };
    }

    const tops = rawData[0].data.map((d) => d.number);
    const mappedData = rawData.map((decadeEntry) => {
      const row: Record<string, number | string> = {
        decade: decadeEntry.decade,
      };
      for (const d of decadeEntry.data) {
        row[String(d.number)] = d.frequency;
      }
      return row;
    });

    return { chartData: mappedData, topNumbers: tops };
  }, [rawData]);

  // Show skeleton while store is not yet seeded (meta is undefined when uninitialized)
  if (meta === undefined) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  if (chartData.length === 0) return null;

  return (
    <div className="glass-card p-4">
      <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.DEFAULT_HEIGHT}>
        <LineChart data={chartData} margin={CHART_DIMENSIONS.MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} />
          <XAxis dataKey="decade" tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }} />
          <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }} />
          <Tooltip content={(props) => <CustomTooltip {...props} />} />
          <Legend formatter={legendFormatter} />
          {topNumbers.map((num, i) => (
            <Line
              key={num}
              type="monotone"
              dataKey={String(num)}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              dot={{ r: 4, fill: PALETTE[i % PALETTE.length] }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
