import { formatCompactCurrency } from '@/lib/lottery/utils';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { TierConfig } from './prize-tier.constants';

export interface TierData {
  tier: string;
  label: string;
  avgPrize: number;
  maxPrize: number;
  totalWinners: number;
}

interface TierCardProps {
  data: TierData;
  config: TierConfig;
  maxAvg: number;
  index: number;
}

export const TierCard = memo(function TierCard({ data, config, maxAvg, index }: TierCardProps) {
  const widthPct = maxAvg > 0 ? (data.avgPrize / maxAvg) * 100 : 0;
  const paddingClass = index === 0 ? 'p-4' : index === 1 ? 'p-3.5' : 'p-3';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12 }}
      className={`rounded-xl border bg-gradient-to-br ${config.gradient} ${config.border} ${paddingClass} overflow-hidden relative`}
    >
      {/* Rank background number */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-6xl font-display font-black opacity-[0.06] select-none">
        {config.rank}
      </div>

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-display font-bold text-foreground">{config.label}</span>
            <span
              className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${config.badge}`}
            >
              hierarquia #{config.rank}
            </span>
          </div>
          <div className="flex gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Prêmio médio </span>
              <span className="font-mono font-semibold text-foreground">
                {formatCompactCurrency(data.avgPrize)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Máximo </span>
              <span className="font-mono text-foreground">
                {formatCompactCurrency(data.maxPrize)}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground">
            {data.totalWinners.toLocaleString('pt-BR')} ganhadores históricos
          </div>
        </div>
      </div>

      {/* Prize scale bar */}
      <div className="mt-3 h-1.5 rounded-full bg-muted/10 overflow-hidden relative z-10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: config.barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${widthPct}%` }}
          transition={{ duration: 1, delay: index * 0.12 + 0.3, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
});
