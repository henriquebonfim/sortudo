import { useTopJackpotWinners } from "@/application/selectors";
import { TopJackpotWinnersResponse } from "@/domain/lottery/draw";
import { formatCurrency } from "@/lib";
import { motion } from "framer-motion";
import { memo } from "react";

const MAX_WINNERS_TO_SHOW = 10;
const TOP_RANK_LIMIT = 3;

/**
 * Styling constants for the top 3 rankings
 */
const RANK_STYLES = [
  "bg-gradient-to-r from-primary/30 to-primary/10 border-primary/50 text-primary-foreground",
  "bg-gradient-to-r from-slate-400/20 to-slate-500/10 border-slate-400/40 text-slate-300",
  "bg-gradient-to-r from-orange-700/25 to-amber-800/10 border-orange-700/40 text-orange-400",
] as const;

const RANK_LABELS = ["🥇", "🥈", "🥉"] as const;
const DEFAULT_ROW_STYLE = "bg-muted/5 border-border text-muted-foreground";

/**
 * Formats a given date string into a localized Brazilian format.
 */
function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Props for individual Winner row component
 */
interface JackpotWinnerRowProps {
  draw: TopJackpotWinnersResponse["draws"][0];
  index: number;
  topWinnersCount: number;
}

/**
 * Extracts the single responsibility of rendering a winner row.
 */
const JackpotWinnerRow = memo(function JackpotWinnerRow({
  draw,
  index,
  topWinnersCount,
}: JackpotWinnerRowProps) {
  const isTop3 = index < TOP_RANK_LIMIT;
  const isFirst = index === 0;
  const rowStyle = isTop3 ? RANK_STYLES[index] : DEFAULT_ROW_STYLE;

  // Guard against divide by zero just in case
  const safeTopWinners = Math.max(topWinnersCount, 1);
  const barWidthPercent = (draw.winners / safeTopWinners) * 100;

  // Compute gradient background based on rank
  let gradientBackground = `linear-gradient(90deg, hsl(var(--foreground) / 0.05) ${barWidthPercent}%, transparent ${barWidthPercent}%)`;
  if (isTop3) {
    if (isFirst) {
      gradientBackground = `linear-gradient(90deg, hsl(var(--primary) / 0.3) ${barWidthPercent}%, transparent ${barWidthPercent}%)`;
    } else {
      gradientBackground = `linear-gradient(90deg, hsl(var(--muted) / 0.2) ${barWidthPercent}%, transparent ${barWidthPercent}%)`;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`relative flex items-center gap-3 p-3 rounded-xl border overflow-hidden ${rowStyle}`}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: gradientBackground }}
      />

      <div
        className={`
          relative z-10 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
          font-mono font-bold text-xs border
          ${isTop3 ? rowStyle : "bg-muted/10 border-border"}
        `}
      >
        {isTop3 ? RANK_LABELS[index] : `#${index + 1}`}
      </div>

      <div className="relative z-10 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-foreground">
            {draw.winners} ganhadores
          </span>
          {isFirst && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider bg-primary/20 text-primary"
            >
              recorde
            </span>
          )}
        </div>
        <div className="text-[10px] text-muted-foreground">
          Sorteio #{draw.drawId} · {formatDate(draw.date)}
        </div>
      </div>

      <div className="relative z-10 text-right flex-shrink-0">
        <div className="font-mono text-xs text-foreground">
          {formatCurrency(draw.prize)}
        </div>
        <div className="text-[9px] text-muted-foreground">
          {draw.pctOfTotalWinners}% do total
        </div>
      </div>
    </motion.div>
  );
});

export function TopJackpotWinnersChart() {
  const data = useTopJackpotWinners();

  if (!data || data.length === 0) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const winnersList = data.slice(0, MAX_WINNERS_TO_SHOW);
  const topWinnersCount = winnersList[0]?.winners ?? 1;

  return (
    <div className="space-y-2">
      {winnersList.map((draw, index) => (
        <JackpotWinnerRow
          key={draw.drawId}
          draw={draw}
          index={index}
          topWinnersCount={topWinnersCount}
        />
      ))}
    </div>
  );
}
