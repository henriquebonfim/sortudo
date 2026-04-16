import { VerticalBarChartShell } from '@/features/analytics/components/charts/shared/VerticalBarChartShell';
import { useTopPairs } from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useLotteryMetadata } from '@/store/selectors';
import { memo, useMemo } from 'react';
import type { TooltipContentProps } from 'recharts';
import { Bar, Cell } from 'recharts';

interface ExtendedPairData {
  pair: string;
  number1: number;
  number2: number;
  count: number;
  pct: number;
}

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as ExtendedPairData;

  return (
    <div className="glass-card border border-border p-3 text-xs font-mono">
      <p className="text-foreground font-bold">Par {data.pair}</p>
      <p className="text-muted-foreground">
        Co-ocorrências: <span className="text-foreground">{data.count}</span>
      </p>
      <p className="text-primary mt-1">{data.pct}% do total de sorteios</p>
    </div>
  );
});

const PairCard = memo(function PairCard({
  data,
  index,
}: {
  data: ExtendedPairData;
  index: number;
}) {
  return (
    <div className="glass-card p-2 text-center flex flex-col items-center gap-1 rounded-lg border border-border">
      <span className="text-[10px] text-muted-foreground">#{index + 1}</span>
      <div className="flex gap-1">
        {[data.number1, data.number2].map((num) => (
          <span
            key={num}
            className="ball-shadow flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold text-primary-foreground"
            style={{ backgroundColor: 'hsl(var(--violet))' }}
          >
            {num}
          </span>
        ))}
      </div>
      <span
        className="text-[11px] font-mono text-amber-400 font-bold"
        style={{ color: CHART_COLORS.AMBER }}
      >
        {data.count}×
      </span>
    </div>
  );
});

export function PairCooccurrenceChart() {
  const metadata = useLotteryMetadata();
  const rawData = useTopPairs();

  const data = useMemo(() => {
    if (!rawData || !metadata) return [];
    const total = Math.max(metadata.totalGames, 1);
    return rawData.map((item) => ({
      ...item,
      number1: item.numbers[0],
      number2: item.numbers[1],
      pair: `${String(item.numbers[0]).padStart(2, '0')}-${String(item.numbers[1]).padStart(2, '0')}`,
      pct: Math.round((item.count / total) * 1000) / 10,
    })) as ExtendedPairData[];
  }, [rawData, metadata]);

  if (!metadata || !rawData || data.length === 0) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const maxCount = data[0]?.count ?? 1;

  return (
    <div className="space-y-4">
      <div className="p-4">
        <VerticalBarChartShell
          data={data}
          height={300}
          margin={{ left: 12, right: 48, top: 4, bottom: 4 }}
          xAxisTick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
          xAxisDomain={[0, maxCount + 5]}
          yAxisDataKey="pair"
          yAxisTick={{ fontSize: 11, fill: '#CBD5E1', fontFamily: 'monospace' }}
          yAxisWidth={40}
          gridHorizontal={false}
          tooltipContent={(props) => <CustomTooltip {...props} />}
          tooltipCursor={{ fill: CHART_COLORS.CURSOR }}
        >
          <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {data.map((d) => (
              <Cell
                key={d.pair}
                fill={`hsla(${271 - data.indexOf(d) * 10}, 80%, ${60 - data.indexOf(d) * 1.5}%, 0.85)`}
              />
            ))}
          </Bar>
        </VerticalBarChartShell>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {data.slice(0, 10).map((d, i) => (
          <PairCard key={d.pair} data={d} index={i} />
        ))}
      </div>
    </div>
  );
}
