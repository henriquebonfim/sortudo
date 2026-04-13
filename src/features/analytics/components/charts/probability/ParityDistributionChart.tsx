import { useParityDistributionComparison } from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface ParityData {
  label: string;
  count: number;
  pct: number;
  originalIndex: number;
  theoretical: number;
}

interface ParityBarProps {
  data: ParityData;
  maxPct: number;
  totalItems: number;
  index: number;
}

function barColor(index: number, total: number) {
  const mid = Math.floor(total / 2);
  const dist = Math.abs(index - mid);
  if (dist === 0) return CHART_COLORS.AMBER;
  if (dist === 1) return CHART_COLORS.BLUE;
  if (dist === 2) return CHART_COLORS.VIOLET;
  return CHART_COLORS.SLATE;
}

const ParityBar = memo(function ParityBar({ data, maxPct, totalItems, index }: ParityBarProps) {
  const delta = data.theoretical > 0 ? data.pct - data.theoretical : null;
  const color = barColor(data.originalIndex, totalItems);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono font-semibold text-foreground w-16">{data.label}</span>
        <div className="flex items-center gap-2">
          {delta !== null && (
            <span
              className={`text-[10px] font-mono ${
                delta > 0
                  ? 'text-emerald-400'
                  : delta < 0
                    ? 'text-red-400'
                    : 'text-muted-foreground'
              }`}
            >
              {delta > 0 ? '+' : ''}
              {delta.toFixed(1)}%
            </span>
          )}
          <span className="text-muted-foreground w-12 text-right font-mono">
            {data.pct.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative h-5 rounded-md bg-muted/20 overflow-hidden">
        {/* Theoretical bar overlay */}
        {data.theoretical > 0 && (
          <div
            className="absolute top-0 h-full bg-white/8 rounded-md border-r border-white/20 z-10"
            style={{ width: `${(data.theoretical / maxPct) * 100}%` }}
          />
        )}
        {/* Actual bar */}
        <motion.div
          className="h-full rounded-md relative z-0"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${(data.pct / maxPct) * 100}%` }}
          transition={{ duration: 0.7, delay: index * 0.05, ease: 'easeOut' }}
        />
        {/* Concursos count label inside bar */}
        <span className="absolute right-2 top-0 h-full flex items-center text-[10px] font-mono text-white/60 z-20">
          {data.count.toLocaleString('pt-BR')}
        </span>
      </div>
    </div>
  );
});

const Legend = memo(function Legend() {
  return (
    <div className="flex gap-4 text-[10px] text-muted-foreground pt-1">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-2 rounded-sm bg-white/10 border-r border-white/20" />
        Esperado (binomial)
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-emerald-400">+X%</span>
        Acima do esperado
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-red-400">-X%</span>
        Abaixo do esperado
      </div>
    </div>
  );
});

export function ParityDistributionChart() {
  const meta = useLotteryMeta();
  const data = useParityDistributionComparison();

  if (!meta || !data.length) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const top = data[0];
  const maxPct = top?.pct ?? 1;

  return (
    <div className="space-y-4">
      {/* KPI callout */}
      {top && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/10">
          <span className="text-2xl font-display font-bold text-primary">{top.label}</span>
          <span className="text-sm text-muted-foreground">
            combinação mais comum —{' '}
            <strong className="text-foreground">{top.pct.toFixed(1)}%</strong> dos sorteios
          </span>
        </div>
      )}

      {/* Ranked horizontal bars */}
      <div className="space-y-2">
        {data.map((d, i) => (
          <ParityBar key={d.label} data={d} maxPct={maxPct} totalItems={data.length} index={i} />
        ))}
      </div>

      <Legend />
    </div>
  );
}
