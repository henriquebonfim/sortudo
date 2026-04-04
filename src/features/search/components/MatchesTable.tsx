import { useFrequencies } from '@/application/selectors/useLotteryStats';
import { BallBadge } from '@/components/shared/BallBadge';
import type { Draw, SearchResult } from '@/domain/lottery/lottery.types';
import { getBallColor } from '@/lib/ball-color';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const PARTIAL_MATCH_ROWS = [
  {
    label: 'Sena',
    sublabel: 'sena',
    key: 'jackpot' as const,
    color: 'hsl(43 96% 56%)',
    borderColor: 'hsl(43 96% 56% / 0.7)',
    bgActive: 'hsl(43 96% 56% / 0.06)',
    max: 1,
  },
  {
    label: 'Quina',
    sublabel: '5 acertos',
    key: 'fiveHits' as const,
    color: 'hsl(217 91% 65%)',
    borderColor: 'hsl(217 91% 65% / 0.6)',
    bgActive: 'transparent',
    max: 20,
  },
  {
    label: 'Quadra',
    sublabel: '4 acertos',
    key: 'fourHits' as const,
    color: 'hsl(262 83% 68%)',
    borderColor: 'hsl(262 83% 68% / 0.5)',
    bgActive: 'transparent',
    max: 200,
  },
  {
    label: 'Terno',
    sublabel: '3 acertos',
    key: 'threeHits' as const,
    color: 'hsl(215 14% 60%)',
    borderColor: 'hsl(215 14% 60% / 0.4)',
    bgActive: 'transparent',
    max: 2000,
  },
];

interface MatchesTableProps {
  result: SearchResult;
}

export function MatchesTable({ result }: MatchesTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const frequencies = useFrequencies();

  return (
    <div className="card-surface overflow-hidden">

      {/* Table header */}
      <div className="px-5 py-3.5  "
        style={{ background: 'hsl(var(--card) / 0.5)' }}
      >
        <div className="flex items-center">
          <span className="text-xs uppercase tracking-widest text-muted-foreground/70 font-semibold flex-[2]">
            Premiação
          </span>
          <span className="hidden sm:block text-xs uppercase tracking-widest text-muted-foreground/70 font-semibold flex-[3] text-center">
            Frequência histórica
          </span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground/70 font-semibold w-20 text-right pr-2">
            Total
          </span>
        </div>
      </div>

      {/* Rows */}
      {PARTIAL_MATCH_ROWS.map((row, i) => {
        const drawsCount = result[row.key];
        const count = drawsCount.length;
        const barWidth = Math.min(100, (count / row.max) * 100);
        const isExpanded = expandedRow === row.key;
        const isJackpot = row.key === 'jackpot';
        const hasHit = count > 0;
        const visibleDraws = drawsCount.slice(0, 40);

        return (
          <div
            key={row.key}
            className="border-b border-border last:border-0 overflow-hidden flex flex-col"
          >
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                if (hasHit) setExpandedRow(isExpanded ? null : row.key);
              }}
              className={`
                relative flex items-center px-0 py-0
                transition-colors duration-150
                ${hasHit ? 'cursor-pointer' : 'cursor-default'}
              `}
              style={{
                background: isJackpot && hasHit
                  ? 'linear-gradient(90deg, hsl(43 96% 56% / 0.06), transparent 70%)'
                  : isExpanded
                    ? 'hsl(var(--muted) / 0.3)'
                    : undefined,
              }}
            >
              {/* Left color border — tier indicator */}
              <div
                className="self-stretch w-[3px] flex-shrink-0 rounded-r-full"
                style={{
                  background: hasHit ? row.borderColor : 'hsl(var(--border))',
                  minHeight: '52px',
                }}
              />

              {/* Row content */}
              <div className="flex items-center flex-1 px-4 py-3.5">

                {/* Label */}
                <div className="flex-[2] flex flex-col gap-0.5">
                  <span
                    className="text-sm font-semibold font-display"
                    style={{ color: hasHit ? row.color : 'hsl(var(--foreground))' }}
                  >
                    {row.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground/60">{row.sublabel}</span>
                </div>

                {/* Progress bar */}
                <div className="hidden sm:block flex-[3] px-3 pointer-events-none">
                  <div className="match-bar-track">
                    <motion.div
                      className="match-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      style={{ background: `linear-gradient(90deg, ${row.color}70, ${row.color})` }}
                    />
                  </div>
                </div>

                {/* Count + chevron */}
                <div className="w-20 flex items-center justify-end gap-2 pr-2">
                  <span
                    className="font-mono font-bold text-sm tabular-nums"
                    style={{ color: hasHit ? row.color : 'hsl(var(--muted-foreground))' }}
                  >
                    {count}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center text-muted-foreground/50"
                  >
                    {hasHit
                      ? <ChevronDown className="w-4 h-4" />
                      : <div className="w-4" />
                    }
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Expanded draw list */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                  style={{ background: 'hsl(var(--background) / 0.5)' }}
                >
                  <div
                    className="p-4 border-t border-border space-y-2.5 max-h-72 overflow-y-auto"
                  >
                    {visibleDraws.map((c: Draw) => {
                      const matched = c.numbers.filter((b) => result.combination.includes(b));
                      return (
                        <div
                          key={c.id}
                          className="glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-foreground font-display">
                              Sorteio #{c.id}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              {c.date}
                            </span>
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                            {c.numbers.map((b) => {
                              const ballColor = frequencies
                                ? getBallColor(
                                  frequencies.frequencies[String(b)] ?? frequencies.mean,
                                  frequencies.min.frequency,
                                  frequencies.max.frequency
                                )
                                : 'cold';

                              return (
                                <BallBadge
                                  key={b}
                                  number={b}
                                  size="sm"
                                  color={ballColor}
                                  dimmed={!matched.includes(b)}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {count > 40 && (
                      <div className="text-center py-3 text-xs text-muted-foreground/60 border-t border-border/30 mt-1">
                        + {count - 40} sorteios omitidos (frequência muito alta)
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
