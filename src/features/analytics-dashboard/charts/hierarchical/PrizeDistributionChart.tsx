import { memo, useMemo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import { motion } from "framer-motion";
import { formatCompactCurrency } from "@/lib/formatters";
import { CHART_COLORS } from "@/domain/lottery/lottery.constants";

interface TierConfig {
  label: string;
  emoji: string;
  gradient: string;
  border: string;
  badge: string;
  barColor: string;
  rank: number;
}

const TIER_CONFIG: Record<string, TierConfig> = {
  sena: {
    label: "6 Acertos (Sena)",
    emoji: "🥇",
    gradient: "from-amber-500/30 via-yellow-500/20 to-amber-600/10",
    border: "border-amber-500/40",
    badge: "bg-amber-500/20 text-amber-300",
    barColor: CHART_COLORS.AMBER,
    rank: 1,
  },
  quina: {
    label: "5 Acertos (Quina)",
    emoji: "🥈",
    gradient: "from-blue-500/25 via-blue-400/15 to-blue-600/5",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    barColor: CHART_COLORS.BLUE,
    rank: 2,
  },
  quadra: {
    label: "4 Acertos (Quadra)",
    emoji: "🥉",
    gradient: "from-emerald-500/20 via-emerald-400/10 to-emerald-600/5",
    border: "border-emerald-500/25",
    badge: "bg-emerald-500/20 text-emerald-300",
    barColor: CHART_COLORS.EMERALD,
    rank: 3,
  },
};

interface TierData {
  tier: string;
  label: string;
  avgPrize: number;
  maxPrize: number;
  totalWinners: number;
}

const TierCard = memo(function TierCard({
  data,
  config,
  maxAvg,
  index,
}: {
  data: TierData;
  config: TierConfig;
  maxAvg: number;
  index: number;
}) {
  const widthPct = maxAvg > 0 ? (data.avgPrize / maxAvg) * 100 : 0;
  const paddingClass = index === 0 ? "p-4" : index === 1 ? "p-3.5" : "p-3";

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
            <span className="text-sm font-display font-bold text-foreground">
              {config.label}
            </span>
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
            {data.totalWinners.toLocaleString("pt-BR")} ganhadores históricos
          </div>
        </div>
      </div>

      {/* Prize scale bar */}
      <div className="mt-3 h-1.5 rounded-full bg-black/20 overflow-hidden relative z-10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: config.barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${widthPct}%` }}
          transition={{ duration: 1, delay: index * 0.12 + 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
});

export default function PrizeDistributionChart() {
  const stats = useLotteryStore((state) => state.stats);
  const rawData = stats?.prizeTierComparison;

  const { maxAvg, ratio, sorted } = useMemo(() => {
    if (!rawData) return { maxAvg: 0, ratio: "—", sorted: [] };

    const maxA = rawData.reduce((m, d) => Math.max(m, d.avgPrize), 0);
    const sena = rawData.find((d) => d.tier === "sena");
    const quina = rawData.find((d) => d.tier === "quina");
    const rat = sena && quina && quina.avgPrize > 0
      ? (sena.avgPrize / quina.avgPrize).toFixed(0)
      : "—";

    const sort = ["sena", "quina", "quadra"]
      .map((t) => rawData.find((d) => d.tier === t))
      .filter((d): d is TierData => !!d);

    return { maxAvg: maxA, ratio: rat, sorted: sort };
  }, [rawData]);

  if (!stats || !rawData) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const hasRatio = ratio !== "—";

  return (
    <div className="space-y-4">
      {/* KPI callout */}
      {hasRatio && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-2xl font-display font-bold text-amber-400">
            {ratio}×
          </span>
          <span className="text-sm text-muted-foreground">
            O prêmio da Sena é em média{" "}
            <strong className="text-foreground">{ratio}× maior</strong> que o
            da Quina
          </span>
        </div>
      )}

      {/* Hierarchical Tier Cards */}
      <div className="space-y-3">
        {sorted.map((data, index) => {
          const config = TIER_CONFIG[data.tier];
          if (!config) return null;
          return (
            <TierCard
              key={data.tier}
              data={data}
              config={config}
              maxAvg={maxAvg}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
}
