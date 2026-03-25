import { memo } from "react";
import { motion } from "framer-motion";
import { combinations } from "@/domain/math/combinations";
import { CHART_COLORS } from "@/components/lottery/chart.constants";

export interface ParityData {
  label: string;
  count: number;
  pct: number;
  originalIndex: number;
}

interface ParityBarProps {
  data: ParityData;
  maxPct: number;
  totalItems: number;
  index: number;
}

function calculateTheoreticalParity(label: string): number {
  const normalized = label.replace(/[ÍÍÎÌ]/g, "I"); 
  const numbers = normalized.match(/\d+/g);
  if (!numbers || numbers.length < 2) return 0;
  const odds = parseInt(numbers[0], 10);
  const evens = parseInt(numbers[1], 10);
  
  const totalWays = combinations(60, 6);
  const oddWays = combinations(30, odds);
  const evenWays = combinations(30, evens);
  
  return ((oddWays * evenWays) / totalWays) * 100;
}

function barColor(index: number, total: number) {
  const mid = Math.floor(total / 2);
  const dist = Math.abs(index - mid);
  if (dist === 0) return CHART_COLORS.AMBER;
  if (dist === 1) return CHART_COLORS.BLUE;
  if (dist === 2) return CHART_COLORS.VIOLET;
  return CHART_COLORS.SLATE;
}

export const ParityBar = memo(function ParityBar({
  data,
  maxPct,
  totalItems,
  index,
}: ParityBarProps) {
  const theoretical = calculateTheoreticalParity(data.label);
  const delta = theoretical > 0 ? (data.pct - theoretical).toFixed(1) : null;
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
        {theoretical > 0 && (
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
