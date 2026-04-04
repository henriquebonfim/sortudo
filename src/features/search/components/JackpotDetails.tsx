import { useFrequencies } from '@/application/selectors/useLotteryStats';
import { BallBadge } from '@/components/shared/BallBadge';
import type { SearchResult } from '@/domain/lottery/lottery.types';
import { getBallColor } from '@/lib/ball-color';

interface JackpotDetailsProps {
  result: SearchResult;
}

export function JackpotDetails({ result }: JackpotDetailsProps) {
  const frequencies = useFrequencies();
  if (result.fiveHits.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex">
        {result.fiveHits.slice(0, 6).map((c) => {
          const matched = c.numbers.filter((b) => result.combination.includes(b));
          const missed = c.numbers.filter((n) => !result.combination.includes(n));
          return (
            <div key={c.id} className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-2">
                Concurso #{c.id} — {c.date}
              </p>
              <div className="flex gap-1.5">
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
              {missed.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Faltou: <span className="font-mono text-hot">{missed.join(', ')}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
