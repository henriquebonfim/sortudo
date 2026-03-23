import { memo, useMemo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import { motion } from "framer-motion";
import { CHART_COLORS } from "@/domain/lottery/lottery.constants";

// Binomial probability of k even numbers out of 6 drawn from {1-60} (30 even/30 odd)
const THEORETICAL: Record<string, number> = {
  "6I/0P": 1.56,
  "5I/1P": 9.38,
  "4I/2P": 23.44,
  "3I/3P": 31.25,
  "2I/4P": 23.44,
  "1I/5P": 9.38,
  "0I/6P": 1.56,
};

function labelToKey(label: string) {
  // raw label might be "3Í/3P" or "3I/3P" — normalise
  return label.replace(/[ÍÌÎ]/g, "I").replace(/[ÚÙÛ]/g, "U");
}

function barColor(index: number, total: number) {
  const mid = Math.floor(total / 2);
  const dist = Math.abs(index - mid);
  if (dist === 0) return CHART_COLORS.AMBER;  // most probable
  if (dist === 1) return CHART_COLORS.BLUE;   // 2nd tier
  if (dist === 2) return CHART_COLORS.VIOLET; // 3rd tier
  return CHART_COLORS.SLATE;                  // tail
}

interface ParityData {
  label: string;
  count: number;
  pct: number;
  originalIndex: number;
}

const ParityBar = memo(function ParityBar({
  data,
  maxPct,
  totalItems,
  index,
}: {
  data: ParityData;
  maxPct: number;
  totalItems: number;
  index: number;
}) {
  const key = labelToKey(data.label);
  const theoretical = THEORETICAL[key] ?? null;
  const delta = theoretical !== null ? (data.pct - theoretical).toFixed(1) : null;
  const color = barColor(data.originalIndex, totalItems);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono font-semibold text-foreground w-16">
          {data.label}
        </span>
        <div className="flex items-center gap-2">
          {delta !== null && (
            <span
              className={`text-[10px] font-mono ${
                parseFloat(delta) > 0
                  ? "text-emerald-400"
                  : parseFloat(delta) < 0
                  ? "text-red-400"
                  : "text-muted-foreground"
              }`}
            >
              {parseFloat(delta) > 0 ? "+" : ""}
              {delta}%
            </span>
          )}
          <span className="text-muted-foreground w-12 text-right font-mono">
            {data.pct.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative h-5 rounded-md bg-muted/20 overflow-hidden">
        {/* Theoretical bar overlay */}
        {theoretical !== null && (
          <div
            className="absolute top-0 h-full bg-white/8 rounded-md border-r border-white/20 z-10"
            style={{ width: `${(theoretical / maxPct) * 100}%` }}
          />
        )}
        {/* Actual bar */}
        <motion.div
          className="h-full rounded-md relative z-0"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${(data.pct / maxPct) * 100}%` }}
          transition={{ duration: 0.7, delay: index * 0.05, ease: "easeOut" }}
        />
        {/* Concursos count label inside bar */}
        <span className="absolute right-2 top-0 h-full flex items-center text-[10px] font-mono text-white/60 z-20">
          {data.count.toLocaleString("pt-BR")}
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

export default function ParityDistributionChart() {
  const stats = useLotteryStore((state) => state.stats);
  const raw = stats?.parityDistribution;

  const data = useMemo(() => {
    if (!raw) return [];
    const total = raw.reduce((s, d) => s + d.count, 0) || 1;
    return raw
      .map((d, index) => ({
        ...d,
        pct: (d.count / total) * 100,
        originalIndex: index,
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [raw]);

  if (!stats || !raw) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const top = data[0];
  const maxPct = top?.pct ?? 1;

  return (
    <div className="space-y-4">
      {/* KPI callout */}
      {top && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl border"
          style={{
            backgroundColor: `${CHART_COLORS.AMBER}1a`,
            borderColor: `${CHART_COLORS.AMBER}33`,
          }}
        >
          <span
            className="text-2xl font-display font-bold"
            style={{ color: CHART_COLORS.AMBER }}
          >
            {top.label}
          </span>
          <span className="text-sm text-muted-foreground">
            combinação mais comum —{" "}
            <strong className="text-foreground">{top.pct.toFixed(1)}%</strong>{" "}
            dos sorteios
          </span>
        </div>
      )}

      {/* Ranked horizontal bars */}
      <div className="space-y-2">
        {data.map((d, i) => (
          <ParityBar
            key={d.label}
            data={d}
            maxPct={maxPct}
            totalItems={raw.length}
            index={i}
          />
        ))}
      </div>

      <Legend />
    </div>
  );
}
