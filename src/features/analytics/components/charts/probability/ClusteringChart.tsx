import { PieSummaryChart } from '@/features/analytics/components/charts/shared/PieSummaryChart';
import { useNumberProfile } from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { useMemo } from 'react';

export function ClusteringChart() {
  const meta = useLotteryMeta();
  const profile = useNumberProfile();
  const analysis = profile?.decadeAnalysis;

  const chartData = useMemo(() => {
    if (!analysis) return [];
    const mixed = Math.max(0, 100 - (analysis.clusteredPct + analysis.fullySpreadPct));
    return [
      { name: 'Aglomerados', value: analysis.clusteredPct, color: CHART_COLORS.RED },
      { name: 'Mistos', value: Number(mixed.toFixed(2)), color: CHART_COLORS.BLUE },
      {
        name: 'Totalmente Espalhados',
        value: analysis.fullySpreadPct,
        color: CHART_COLORS.EMERALD,
      },
    ];
  }, [analysis]);

  if (!meta || !analysis) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <PieSummaryChart
      chartData={chartData}
      subtitle="Como os números se espalham pelas linhas (1-9, 10-19...)."
    />
  );
}
