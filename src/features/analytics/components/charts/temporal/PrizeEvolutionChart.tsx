import { PrizeTimelineChart } from '@/features/analytics/components/charts/shared/PrizeTimelineChart';
import { MEGA_DA_VIRADA_START_YEAR } from '@/shared/constants';
import { usePrizeTimelineInteraction } from '@/shared/hooks/usePrizeTimelineInteraction';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { formatCompactCurrency } from '@/shared/utils';
import { useLotteryMeta, usePrizeEvolution } from '@/store/selectors';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Info, Landmark, Star, Target, Trophy } from 'lucide-react';
import { memo, useMemo } from 'react';
import type { TooltipContentProps } from 'recharts';

interface PrizeDataPoint {
  year: number;
  maxPrize: number;
  totalDistributed: number;
  totalRevenue: number;
  totalGames: number;
  totalWinners: number;
  megaDaVirada: boolean;
}

const MILESTONES = [
  {
    year: 1996,
    title: 'Início',
    color: CHART_COLORS.BLUE,
    icon: <Calendar className="w-3 h-3" />,
  },
  {
    year: 2009,
    title: 'Mega Virada',
    color: CHART_COLORS.AMBER,
    icon: <Star className="w-3 h-3" />,
  },
  {
    year: 2025,
    title: 'Recorde de 1B+',
    color: CHART_COLORS.EMERALD,
    icon: <Trophy className="w-3 h-3" />,
  },
];

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload as PrizeDataPoint;

  return (
    <div className="glass-card border border-border p-3 text-xs space-y-2 min-w-[200px] shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-border pb-1.5 mb-1.5">
        <span className="text-foreground font-bold text-sm">{label}</span>
        {data.megaDaVirada && (
          <span className="bg-amber-500/10 text-amber-500 text-[9px] px-1.5 py-0.5 rounded border border-amber-500/20 font-bold uppercase">
            Virada
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {payload.map((p) => (
          <div key={String(p.dataKey)} className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </span>
            <span className="font-mono font-bold text-foreground">
              {formatCompactCurrency(p.value as number)}
            </span>
          </div>
        ))}
      </div>
      <div className="pt-1.5 border-t border-border flex justify-between text-[9px] text-muted-foreground">
        <span>Ganhadores (Sena)</span>
        <span className="font-bold text-foreground">{data.totalWinners}</span>
      </div>
    </div>
  );
});

export function PrizeEvolutionChart() {
  const meta = useLotteryMeta();
  const prizeEvolution = usePrizeEvolution();

  const { data, selectedYear, setSelectedYear, visibleSeries, toggleSeries, handleClick } =
    usePrizeTimelineInteraction(prizeEvolution);

  const selectedData = useMemo(
    () => data.find((d) => d.year === selectedYear),
    [data, selectedYear]
  );

  const globalInsights = useMemo(() => {
    if (!data.length) return null;
    const allTimeMax = [...data].sort((a, b) => b.maxPrize - a.maxPrize)[0];
    const totalPrizes = data.reduce((acc, d) => acc + d.totalDistributed, 0);
    const totalRev = data.reduce((acc, d) => acc + d.totalRevenue, 0);
    const efficiency = (totalPrizes / totalRev) * 100;

    return { allTimeMax, totalPrizes, totalRev, efficiency };
  }, [data]);

  if (!meta || !data.length) {
    return <div className="h-96 animate-pulse bg-muted/20 rounded-2xl" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header/Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-4 border-amber-500/10 bg-amber-500/5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">
              Recorde Histórico ({globalInsights?.allTimeMax.year})
            </p>
            <p className="text-lg font-display font-bold text-foreground">
              {formatCompactCurrency(globalInsights?.allTimeMax.maxPrize || 0)}
            </p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4 border-blue-500/10 bg-blue-500/5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
              Total Distribuído
            </p>
            <p className="text-lg font-display font-bold text-foreground">
              {formatCompactCurrency(globalInsights?.totalPrizes || 0)}
            </p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-4 border-emerald-500/10 bg-emerald-500/5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
              Taxa de Distribuição
            </p>
            <p className="text-lg font-display font-bold text-foreground">
              {globalInsights?.efficiency.toFixed(1)}%{' '}
              <span className="text-[10px] text-muted-foreground font-normal">da arrecadação</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-3 min-w-0 flex flex-col gap-4">
          <PrizeTimelineChart
            data={data}
            selectedYear={selectedYear}
            visibleSeries={visibleSeries}
            onToggleSeries={toggleSeries}
            onChartClick={handleClick}
            tooltipContent={<CustomTooltip />}
            chartClassName="cursor-pointer"
            yAxisTickFormatter={formatCompactCurrency}
            maxPrizeSeriesName="Maior Prêmio"
            distributedSeriesName="Distribuído"
            distributedLegendLabel="Distribuído"
            revenueSeriesName="Arrecadação"
            revenueLegendLabel="Arrecadação"
            showMegaDaViradaMarker
            megaDaViradaYear={MEGA_DA_VIRADA_START_YEAR}
          />
        </div>

        {/* Side Panel: Focus & History */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {selectedYear && selectedData ? (
              <motion.div
                key="focus"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-4 bg-primary/5 border-primary/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display font-bold text-foreground">Foco: {selectedYear}</h4>
                  <button
                    onClick={() => setSelectedYear(null)}
                    className="text-[10px] text-primary hover:underline"
                  >
                    Limpar
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="p-2 rounded bg-background/50 border border-border">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">
                      Arrecadação
                    </p>
                    <p className="text-sm font-mono font-bold text-emerald-500">
                      {formatCompactCurrency(selectedData.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-2 rounded bg-background/50 border border-border">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">
                      Total Prêmios
                    </p>
                    <p className="text-sm font-mono font-bold text-blue-500">
                      {formatCompactCurrency(selectedData.totalDistributed)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] px-2">
                    <span className="text-muted-foreground">Sorteios:</span>
                    <span className="font-bold text-foreground">{selectedData.totalGames}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="generic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-4 flex flex-col items-center justify-center text-center gap-3 bg-muted/5 border-dashed"
              >
                <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground">
                  <Info className="w-6 h-6" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Clique em um ano no gráfico para ver detalhes específicos e insights comparativos.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Milestones Mini List */}
          <div className="glass-card p-4 space-y-4">
            <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
              Marcos Históricos
            </h5>
            <div className="space-y-4">
              {MILESTONES.map((m) => (
                <div
                  key={m.year}
                  className="flex gap-3 group cursor-pointer"
                  onClick={() => setSelectedYear(m.year)}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center border transition-all group-hover:scale-110"
                    style={{
                      borderColor: `${m.color}30`,
                      backgroundColor: `${m.color}10`,
                      color: m.color,
                    }}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground leading-none mb-0.5">
                      {m.year}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{m.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
