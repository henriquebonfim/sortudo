import { useStreakEconomics } from '@/features/analytics/hooks/use-analytics';
import { useLotteryMeta } from '@/store/selectors';
import { useMemo, useState } from 'react';
import { ChartLegend } from '@/features/analytics/components/charts/ChartLegend';
import { StreakChartTab } from '@/features/analytics/components/charts/StreakChartTab';
import { StreakTableTab } from '@/features/analytics/components/charts/StreakTableTab';
import { StreakFrequencyChart } from '@/features/analytics/components/charts/StreakFrequencyChart';
import { Button } from '@/shared/components/ui/Button';

const VIEW_OPTIONS = [
  { id: 'chart' as const, label: 'Gráfico' },
  { id: 'table' as const, label: 'Tabela' },
];

export function StreakEconomicsChart() {
  const meta = useLotteryMeta();
  const rawData = useStreakEconomics();
  const [view, setView] = useState<'chart' | 'table'>('chart');

  const filteredData = useMemo(() => {
    if (!rawData) return [];
    return rawData.filter((d) => d.count >= 2 && d.streak <= 20);
  }, [rawData]);

  if (!meta || !rawData || rawData.length === 0) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex m-auto justify-center gap-2">
        {VIEW_OPTIONS.map((f) => (
          <Button
            key={f.id}
            onClick={() => setView(f.id)}

          >
            {f.label}
          </Button>
        ))}
      </div>

      {view === 'chart' ? (
        <StreakChartTab data={filteredData} />
      ) : (
        <StreakTableTab data={rawData} />
      )}


      <ChartLegend />


    </div>
  );
}
