import { PieSummaryChart } from '@/features/analytics/components/charts/shared/PieSummaryChart';
import { useNumberProfile } from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { useMemo } from 'react';

export function MathCompositionChart() {
  const meta = useLotteryMeta();
  const profile = useNumberProfile();

  const chartData = useMemo(() => {
    if (!profile) return [];
    const outros = Math.max(
      0,
      100 -
        (profile.primesPercentage +
          profile.multiplesOf5Percentage +
          profile.multiplesOf10Percentage)
    );
    return [
      { name: 'Primos', value: profile.primesPercentage, color: CHART_COLORS.VIOLET },
      { name: 'Múltiplos de 5', value: profile.multiplesOf5Percentage, color: CHART_COLORS.AMBER },
      {
        name: 'Múltiplos de 10',
        value: profile.multiplesOf10Percentage,
        color: CHART_COLORS.EMERALD,
      },
      { name: 'Outros', value: Number(outros.toFixed(2)), color: CHART_COLORS.SLATE },
    ];
  }, [profile]);

  if (!meta || !profile || chartData.length === 0) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return <PieSummaryChart chartData={chartData} subtitle="Tipos de números mais sorteados." />;
}
