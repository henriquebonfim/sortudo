import { useGeoWinners } from '@/features/analytics/hooks/use-analytics';
import { useLotteryMeta } from '@/store/selectors';
import { BarChart3Icon, MapIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BrazilMap } from './BrazilMap';
import { GeoBarChart } from './GeoBarChart';
import { RegionSummary } from './RegionSummary';


export function GeoWinnersChart() {
  const meta = useLotteryMeta();
  const data = useGeoWinners();
  const [view, setView] = useState<'map' | 'bar'>('bar');

  const chartData = useMemo(() => {
    return (data || []).slice(0, 15);
  }, [data]);

  if (!meta) return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 bg-muted/5 border border-dashed rounded-xl px-4">
        <MapIcon className="w-8 h-8 text-muted-foreground/20" />
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium">
            Dados geográficos não encontrados
          </p>
          <p className="text-[11px] text-muted-foreground/50 max-w-[200px]">
            Para visualizar este mapa, os dados precisam incluir o campo de localidade.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Switcher */}
      <div className="flex justify-end gap-2 px-1">
        <button
          onClick={() => setView('map')}
          className={`p-1.5 rounded-lg border transition-all ${view === 'map' ? 'bg-primary/20 text-primary border-primary/30' : 'text-muted-foreground border-border hover:bg-muted'}`}
          title="Vista do Mapa"
        >
          <MapIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setView('bar')}
          className={`p-1.5 rounded-lg border transition-all ${view === 'bar' ? 'bg-primary/20 text-primary border-primary/30' : 'text-muted-foreground border-border hover:bg-muted'}`}
          title="Vista de Barras"
        >
          <BarChart3Icon className="w-4 h-4" />
        </button>
      </div>

      <RegionSummary data={data || []} />
      {view === 'map' ? <BrazilMap data={data || []} /> : <GeoBarChart data={chartData} />}
    </div>
  );
}
