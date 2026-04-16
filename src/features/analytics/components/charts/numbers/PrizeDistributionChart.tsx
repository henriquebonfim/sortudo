import { usePrizeTierComparison } from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { formatCompactCurrency } from '@/shared/utils';
import { useLotteryMeta } from '@/store/selectors';
import { motion } from 'framer-motion';
import { ListIcon, PyramidIcon } from 'lucide-react';
import { memo, useMemo, useState } from 'react';

interface PrizePyramidProps {
  sortedData: TierData[];
}

interface TierConfig {
  label: string;
  emoji: string;
  gradient: string;
  border: string;
  badge: string;
  barColor: string;
  rank: number;
}

interface TierData {
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

interface PyramidTierSliceProps {
  tier: TierData;
  index: number;
  isFocused: boolean;
  showConnector: boolean;
  onSelect: (tier: TierData) => void;
  formatFullCurrency: (value: number) => string;
}

const TIER_WIDTH_CLASS: Record<string, string> = {
  sena: 'w-1/3',
  quina: 'w-2/3',
  quadra: 'w-full',
};

const TIER_CONFIG: Record<string, TierConfig> = {
  sena: {
    label: 'Sena',
    emoji: '🥇',
    gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-500',
    barColor: CHART_COLORS.AMBER,
    rank: 1,
  },
  quina: {
    label: 'Quina',
    emoji: '🥈',
    gradient: 'from-info/25 via-info/15 to-info/5',
    border: 'border-info/30',
    badge: 'bg-info/20 text-info',
    barColor: CHART_COLORS.BLUE,
    rank: 2,
  },
  quadra: {
    label: 'Quadra',
    emoji: '🥉',
    gradient: 'from-success/20 via-success/10 to-success/5',
    border: 'border-success/25',
    badge: 'bg-success/20 text-success',
    barColor: CHART_COLORS.EMERALD,
    rank: 3,
  },
};

function formatPyramidAveragePrize(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  return value.toLocaleString('pt-BR');
}

const PyramidTierSlice = memo(function PyramidTierSlice({
  tier,
  index,
  isFocused,
  showConnector,
  onSelect,
  formatFullCurrency,
}: PyramidTierSliceProps) {
  const tierConfig = TIER_CONFIG[tier.tier];
  const displayLabel = tierConfig?.label ?? tier.label ?? tier.tier;
  const widthClass = TIER_WIDTH_CLASS[tier.tier] ?? 'w-full';
  const delay = index * 0.1;
  const fullDetails = `${displayLabel}: prêmio médio ${formatFullCurrency(tier.avgPrize)}, prêmio máximo ${formatFullCurrency(tier.maxPrize)}, ${tier.totalWinners.toLocaleString('pt-BR')} ganhadores históricos.`;

  const handleSelect = () => onSelect(tier);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      tabIndex={0}
      role="button"
      aria-pressed={isFocused}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        handleSelect();
      }}
      title={fullDetails}
      aria-label={fullDetails}
      className={`relative ${widthClass} h-16 mb-2 flex flex-col items-center justify-center rounded-xl border group cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${isFocused ? 'ring-2 ring-primary/40 shadow-lg' : ''}`}
      style={{
        backgroundColor: `hsl(var(--primary) / 0.1)`,
        borderColor: `hsl(var(--primary) / 0.3)`,
      }}
    >
      <div
        className={`absolute inset-0 transition-opacity bg-gradient-to-t from-black/20 ${isFocused ? 'opacity-20' : 'opacity-10 group-hover:opacity-20'}`}
        style={{ backgroundColor: 'hsl(var(--primary))' }}
      />
      <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5 text-primary">
        {tier.tier}
      </span>
      <span className="font-mono text-sm group-hover:scale-105 transition-transform duration-300">
        R$ {formatPyramidAveragePrize(tier.avgPrize)}
      </span>

      {showConnector ? (
        <div className="absolute -bottom-2 left-1/2 w-px h-2 bg-border z-0" />
      ) : null}
    </motion.div>
  );
});

function PrizePyramid({ sortedData }: PrizePyramidProps) {
  const [focusedTier, setFocusedTier] = useState<TierData | null>(
    () => sortedData.find((tier) => tier.tier === 'sena') ?? sortedData[0] ?? null
  );

  const handleTierSelect = (tier: TierData) => {
    setFocusedTier((current) => (current?.tier === tier.tier ? null : tier));
  };

  const totalAveragePrize = useMemo(
    () => sortedData.reduce((sum, tier) => sum + tier.avgPrize, 0),
    [sortedData]
  );

  const formatFullCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="relative flex flex-col items-center py-10 overflow-hidden">
      <div className="w-full max-w-[320px] flex flex-col items-center">
        {sortedData.map((tier, idx) => (
          <PyramidTierSlice
            key={tier.tier}
            tier={tier}
            index={idx}
            isFocused={focusedTier?.tier === tier.tier}
            showConnector={idx < sortedData.length - 1}
            onSelect={handleTierSelect}
            formatFullCurrency={formatFullCurrency}
          />
        ))}
      </div>

      <div className="w-full max-w-[320px] min-h-[108px] mt-3 rounded-xl border border-primary/25 bg-card/60 p-3">
        {focusedTier && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider font-bold text-primary">
              {TIER_CONFIG[focusedTier.tier]?.label ?? focusedTier.label ?? focusedTier.tier}
            </p>
            <p className="text-xs text-foreground">
              Prêmio médio:{' '}
              <span className="font-mono font-semibold">
                {formatFullCurrency(focusedTier.avgPrize)}
              </span>
            </p>
            <p className="text-xs text-foreground">
              Prêmio máximo:{' '}
              <span className="font-mono font-semibold">
                {formatFullCurrency(focusedTier.maxPrize)}
              </span>
            </p>
            <p className="text-xs text-foreground">
              Ganhadores históricos:{' '}
              <span className="font-mono font-semibold">
                {focusedTier.totalWinners.toLocaleString('pt-BR')}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Participação no valor médio:{' '}
              {totalAveragePrize > 0
                ? ((focusedTier.avgPrize / totalAveragePrize) * 100).toFixed(1)
                : '0.0'}
              %
            </p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground mt-4 italic">
        * Representação visual da concentração de prêmios por faixa de acerto
      </p>
    </div>
  );
}

const TierCard = memo(function TierCard({ data, config, maxAvg, index }: TierCardProps) {
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

export function PrizeDistributionChart() {
  const meta = useLotteryMeta();
  const rawData = usePrizeTierComparison();
  const [view, setView] = useState<'pyramid' | 'list'>('pyramid');

  const { maxAvg, sorted } = useMemo(() => {
    if (!rawData) return { maxAvg: 0, sorted: [] };

    const maxA = rawData.reduce((m, d) => Math.max(m, d.avgPrize), 0);

    const sort = ['sena', 'quina', 'quadra']
      .map((t) => rawData.find((d) => d.tier === t))
      .filter((d): d is TierData => !!d);

    return { maxAvg: maxA, sorted: sort };
  }, [rawData]);

  if (!meta || !rawData) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

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
