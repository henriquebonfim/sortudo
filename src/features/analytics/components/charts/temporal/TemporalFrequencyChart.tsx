import {
  useAnalyticsActions,
  useFrequencyRanking,
  useTemporalFrequency,
} from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { memo, useEffect, useMemo } from 'react';
import type { TooltipProps } from 'recharts';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type TooltipContentProps<
  TValue extends number | string | Array<number | string>,
  TName extends string,
> = TooltipProps<TValue, TName>;

const CHART_DIMENSIONS = {
  DEFAULT_HEIGHT: 320,
  SMALL_HEIGHT: 240,
  MARGIN: { top: 16, right: 16, bottom: 4, left: 0 },
};

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

  // Sort payload by value to show highest frequencies first in tooltip
  const sortedPayload = [...payload].sort((a, b) => Number(b.value) - Number(a.value));

  return (
    <div className="glass-card border border-border p-3 text-xs font-mono space-y-1 w-[200px] max-h-[350px] overflow-y-auto">
      <p className="text-foreground font-bold border-b border-border mb-1 pb-1">{label}</p>
      {sortedPayload.map((p) => (
        <p key={String(p.dataKey)} style={{ color: p.color }}>
          Nº {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
});

export function TemporalFrequencyChart() {
  const rawData = useTemporalFrequency();
  const meta = useLotteryMeta();
  const { calculateStats } = useAnalyticsActions();
  const ranking = useFrequencyRanking();

  // Automatically migrate legacy cached data
  useEffect(() => {
    if (rawData && rawData.length > 0) {
      const isLegacyFormat = rawData[0].decade.startsWith('Década') || rawData[0].data.length <= 15;
      if (isLegacyFormat) {
        calculateStats(true);
      }
    }
  }, [rawData, calculateStats]);

  const { chartData, numbers } = useMemo(() => {
    if (!rawData || !rawData.length) {
      return { chartData: [], numbers: [] };
    }

    const allNums = Array.from({ length: 60 }, (_, i) => i + 1);
    const mappedData = rawData.map((decadeEntry) => {
      const row: Record<string, number | string> = {
        decade: decadeEntry.decade,
      };
      for (const d of decadeEntry.data) {
        row[String(d.number)] = d.frequency;
      }
      return row;
    });

    return { chartData: mappedData, numbers: allNums };
  }, [rawData]);

  // Show skeleton while store is not yet seeded (meta is undefined when uninitialized)
  if (meta === undefined) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  if (chartData.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="  p-4">
        <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.DEFAULT_HEIGHT + 100}>
          <LineChart data={chartData} margin={CHART_DIMENSIONS.MARGIN}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} />
            <XAxis
              dataKey="decade"
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
              label={{
                value: 'Ano / Década',
                position: 'insideTop',
                offset: -15,
                fontSize: 10,
                fill: CHART_COLORS.TICK_LABEL,
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
              label={{
                value: 'Frequência (%)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 10,
                fill: CHART_COLORS.TICK_LABEL,
              }}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
            {numbers.map((num, i) => (
              <Line
                key={num}
                type="monotone"
                dataKey={String(num)}
                name={String(num).padStart(2, '0')}
                stroke={PALETTE[i % PALETTE.length]}
                strokeWidth={1}
                dot={false}
                activeDot={{ r: 4 }}
                strokeOpacity={0.6}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-4 overflow-hidden">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest border-b border-border pb-2">
          Ranking Histórico Completo (Decrescente)
        </h4>
        <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
          {ranking.map((item) => (
            <div
              key={item.number}
              className="flex items-baseline justify-between p-2 rounded-lg bg-muted/30 border border-border  hover:border-primary/30 transition-colors group"
            >
              <span className="text-[9px] text-muted-foreground  ">#{item.position}</span>
              <span className="text-[10px] font-mono text-foreground font-semibold">
                {item.percentage}%
              </span>
              <div className="flex justify-center items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">
                  {String(item.number).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
