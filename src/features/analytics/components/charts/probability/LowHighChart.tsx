import { PieSummaryChart } from '@/features/analytics/components/charts/shared/PieSummaryChart';
import { useNumberProfile } from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { useMemo } from 'react';

export function LowHighChart() {
  const meta = useLotteryMeta();
  const profile = useNumberProfile();
  const data = profile?.lowHighSplit;

  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Baixa (1–30)', value: data.low, color: CHART_COLORS.BLUE },
      { name: 'Alta (31–60)', value: data.high, color: CHART_COLORS.AMBER },
    ];
  }, [data]);

  if (!meta || chartData.length === 0) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <PieSummaryChart
      chartData={chartData}
      title="Dezenas Baixas vs Altas"
      titleClassName="text-sm font-semibold mb-1 text-slate-200 w-full text-center"
      subtitle="Distribuição ao longo de todos os sorteios."
      innerRadius="60%"
      outerRadius="80%"
      legendWrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
    />
  );
}
