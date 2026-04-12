import { usePrizeTierComparison } from '@/features/analytics/hooks/use-analytics';
import { useLotteryMeta } from '@/store/selectors';
import { ListIcon, PyramidIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PrizePyramid } from '@/features/analytics/components/charts/PrizePyramid';
import { TierCard, TierData } from '@/features/analytics/components/charts/TierCard';
import { TIER_CONFIG } from '@/features/analytics/components/charts/prize-tier.constants';

export function PrizeDistributionChart() {
  const meta = useLotteryMeta();
  const rawData = usePrizeTierComparison();
  const [view, setView] = useState<'pyramid' | 'list'>('pyramid');

  const { maxAvg, ratio, sorted } = useMemo(() => {
    if (!rawData) return { maxAvg: 0, ratio: '—', sorted: [] };

    const maxA = rawData.reduce((m, d) => Math.max(m, d.avgPrize), 0);
    const sena = rawData.find((d) => d.tier === 'sena');
    const quina = rawData.find((d) => d.tier === 'quina');
    const rat =
      sena && quina && quina.avgPrize > 0 ? (sena.avgPrize / quina.avgPrize).toFixed(0) : '—';

    const sort = ['sena', 'quina', 'quadra']
      .map((t) => rawData.find((d) => d.tier === t))
      .filter((d): d is TierData => !!d);

    return { maxAvg: maxA, ratio: rat, sorted: sort };
  }, [rawData]);

  if (!meta || !rawData) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const hasRatio = ratio !== '—';

  return (
    <div className="space-y-4">
      {/* View Switcher */}
      <div className="flex justify-end gap-2 px-1">
        <button
          onClick={() => setView('pyramid')}
          className={`p-1.5 rounded-lg border transition-all ${view === 'pyramid' ? 'bg-primary/20 text-primary border-primary/30' : 'text-muted-foreground border-border hover:bg-muted'}`}
          title="Visão Pirâmide"
        >
          <PyramidIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setView('list')}
          className={`p-1.5 rounded-lg border transition-all ${view === 'list' ? 'bg-primary/20 text-primary border-primary/30' : 'text-muted-foreground border-border hover:bg-muted'}`}
          title="Visão Lista"
        >
          <ListIcon className="w-4 h-4" />
        </button>
      </div>



      {view === 'pyramid' ? (
        <PrizePyramid sortedData={sorted} />
      ) : (
        <div className="space-y-3">
          {sorted.map((data, index) => {
            const config = TIER_CONFIG[data.tier];
            if (!config) return null;
            return (
              <TierCard key={data.tier} data={data} config={config} maxAvg={maxAvg} index={index} />
            );
          })}
        </div>
      )}
    </div>
  );
}
