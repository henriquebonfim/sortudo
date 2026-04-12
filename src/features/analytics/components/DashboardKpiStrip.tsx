import { BarChart3, TrendingUp, Users, Trophy, Loader2 } from 'lucide-react';
import { KpiCard } from '@/features/analytics/components/DashboardComponents';
import { useAnalyticsStore } from '@/features/analytics/store';
import { AnimatePresence, motion } from 'framer-motion';

interface DashboardKpiStripProps {
  totalGames: number;
  pctWithoutWinner: number;
  totalJackpotWinners: number;
  highestPrize: number;
}

/**
 * KPI strip for the main dashboard.
 *
 * Shows high-level statistics and a "recalculating" overlay when the worker is active.
 */
export function DashboardKpiStrip({
  totalGames,
  pctWithoutWinner,
  totalJackpotWinners,
  highestPrize,
}: DashboardKpiStripProps) {
  const isCalculating = useAnalyticsStore((s) => s.isCalculating);

  const kpiCards = [
    {
      label: 'Total de jogos',
      value: totalGames.toLocaleString('pt-BR') || '0',
      icon: <BarChart3 className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      valueClass: 'text-[hsl(var(--info))]',
    },
    {
      label: 'Sem ganhador (seca)',
      value: `${pctWithoutWinner ?? '--'}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
      valueClass: 'text-hot',
    },
    {
      label: 'Total de ganhadores',
      value: totalJackpotWinners.toLocaleString('pt-BR') || '0',
      icon: <Users className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-primary to-amber-300',
      valueClass: 'text-primary',
    },
    {
      label: 'Maior prêmio',
      value: `R$${((highestPrize || 0) / 1_000_000).toLocaleString('pt-BR', {
        maximumFractionDigits: 0,
      })}M`,
      icon: <Trophy className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-emerald-500 to-green-400',
      valueClass: 'text-success',
    },
  ];

  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {kpiCards.map((card, i) => (
          <KpiCard key={card.label} {...card} delay={0.1 + i * 0.07} />
        ))}
      </div>

      <AnimatePresence>
        {isCalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -inset-x-2 -inset-y-2 z-50 flex items-center justify-center bg-background/40 backdrop-blur-[2px] rounded-2xl border-2 border-primary/20 border-dashed"
          >
            <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-full shadow-xl border border-border">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Recalculando estatísticas...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
