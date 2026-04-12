import { useNumberProfile } from '@/features/analytics/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/constants/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { useMemo } from 'react';
import { DecadeDispersion } from '@/features/analytics/components/charts/DecadeDispersion';
import { LowHighDistribution } from '@/features/analytics/components/charts/LowHighDistribution';
import { OverlapChart } from '@/features/analytics/components/charts/OverlapChart';
import { StatRing } from '@/features/analytics/components/charts/StatRing';

export function NumberProfileChart() {
  const meta = useLotteryMeta();
  const data = useNumberProfile();

  const overlapData = useMemo(() => {
    if (!data) return [];
    return [
      { label: '0', value: data.gameOverlaps.zero, color: CHART_COLORS.BLUE },
      { label: '1', value: data.gameOverlaps.one, color: CHART_COLORS.AMBER },
      { label: '2', value: data.gameOverlaps.two, color: CHART_COLORS.RED },
      { label: '3+', value: data.gameOverlaps.threePlus, color: CHART_COLORS.VIOLET },
    ];
  }, [data]);

  if (!meta || !data) return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;

  return (
    <div className="space-y-5">
      <LowHighDistribution low={data.lowHighSplit.low} high={data.lowHighSplit.high} />

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-3">
          <StatRing value={data.primesPercentage} label="Primos" color={CHART_COLORS.VIOLET} />
        </div>
        <div className="glass-card p-3">
          <StatRing
            value={data.multiplesOf5Percentage}
            label="Múlt. de 5"
            color={CHART_COLORS.EMERALD}
          />
        </div>
        <div className="glass-card p-3">
          <StatRing
            value={data.multiplesOf10Percentage}
            label="Múlt. de 10"
            color={CHART_COLORS.AMBER}
          />
        </div>
      </div>

      <OverlapChart data={overlapData} />

      <DecadeDispersion
        fullySpreadPct={data.decadeAnalysis.fullySpreadPct}
        clusteredPct={data.decadeAnalysis.clusteredPct}
      />
    </div>
  );
}
