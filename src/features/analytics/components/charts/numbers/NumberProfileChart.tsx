import { useNumberProfile } from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from 'recharts';

interface StatRingProps {
  value: number;
  label: string;
  color: string;
  size?: number;
}

interface OverlapDataEntry {
  label: string;
  value: number;
  color: string;
}
interface OverlapEntry {
  label: string;
  value: number;
}

const OverlapBarTooltip = memo(function OverlapBarTooltip({
  active,
  payload,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as OverlapEntry;

  return (
    <div className="glass-card border border-primary/20 p-2 text-xs font-mono">
      <p className="text-foreground">
        {data.label} repetições: <strong>{data.value}%</strong>
      </p>
    </div>
  );
});

const DecadeDispersion = memo(function DecadeDispersion({
  fullySpreadPct,
  clusteredPct,
}: {
  fullySpreadPct: number;
  clusteredPct: number;
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-muted-foreground mb-3 font-medium">Dispersão por Dezena</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 rounded-lg border border-success/20 bg-success/10">
          <span className="font-mono font-bold text-lg text-success">{fullySpreadPct}%</span>
          <p className="text-[10px] text-muted-foreground mt-1">6 dezenas diferentes</p>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/10">
          <span className="text-2xl font-display font-bold text-primary">{clusteredPct}%</span>
          <p className="text-[10px] text-muted-foreground mt-1">3+ na mesma dezena</p>
        </div>
      </div>
    </div>
  );
});

const LowHighDistribution = memo(function LowHighDistribution({
  low,
  high,
}: {
  low: number;
  high: number;
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-muted-foreground mb-2 font-medium">
        Distribuição Baixo (1-30) vs Alto (31-60)
      </p>
      <div className="flex h-8 rounded-lg overflow-hidden">
        <motion.div
          className="flex items-center justify-center text-xs font-mono font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${low}%` }}
          transition={{ duration: 0.8 }}
        >
          {low}%
        </motion.div>
        <motion.div
          className="flex items-center justify-center text-xs font-mono font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${high}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {high}%
        </motion.div>
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
        <span>← Baixos (1-30)</span>
        <span>Altos (31-60) →</span>
      </div>
    </div>
  );
});

const OverlapChart = memo(function OverlapChart({ data }: { data: OverlapDataEntry[] }) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-muted-foreground mb-2 font-medium">
        Repetições entre sorteios consecutivos
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            content={(props) => <OverlapBarTooltip {...props} />}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-muted-foreground mt-1">
        Números que se repetem do sorteio anterior
      </p>
    </div>
  );
});

const StatRing = memo(function StatRing({ value, label, color, size = 72 }: StatRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - value / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.15)"
          strokeWidth={4}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center -mt-12">
        <span className="font-mono font-bold text-sm text-foreground">{value}%</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3 text-center leading-tight">{label}</p>
    </div>
  );
});

export function NumberProfileChart() {
  const meta = useLotteryMeta();
  const data = useNumberProfile();

  const overlapData = useMemo(() => {
    if (!data) return [];
    return [
      { label: '0', value: data.gameOverlaps.zero, color: CHART_COLORS.BLUE },
      { label: '1', value: data.gameOverlaps.one, color: CHART_COLORS.AMBER },
      { label: '2', value: data.gameOverlaps.two, color: CHART_COLORS.RED },
      { label: '3+', value: data.gameOverlaps.threePlus, color: CHART_COLORS.VIOLET },
    ];
  }, [data]);

  if (!meta || !data) return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;

  return (
    <div className="space-y-5">
      <LowHighDistribution low={data.lowHighSplit.low} high={data.lowHighSplit.high} />

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-3">
          <StatRing value={data.primesPercentage} label="Primos" color={CHART_COLORS.VIOLET} />
        </div>
        <div className="glass-card p-3">
          <StatRing
            value={data.multiplesOf5Percentage}
            label="Múlt. de 5"
            color={CHART_COLORS.EMERALD}
          />
        </div>
        <div className="glass-card p-3">
          <StatRing
            value={data.multiplesOf10Percentage}
            label="Múlt. de 10"
            color={CHART_COLORS.AMBER}
          />
        </div>
      </div>

      <OverlapChart data={overlapData} />

      <DecadeDispersion
        fullySpreadPct={data.decadeAnalysis.fullySpreadPct}
        clusteredPct={data.decadeAnalysis.clusteredPct}
      />
    </div>
  );
}
