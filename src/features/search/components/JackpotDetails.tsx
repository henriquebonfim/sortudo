import BallBadge from '@/components/shared/BallBadge';
import type { SearchResult } from '@/domain/lottery/lottery.types';

interface JackpotDetailsProps {
  result: SearchResult;
}

export function JackpotDetails({ result }: JackpotDetailsProps) {
  if (result.fiveHits.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg font-semibold text-foreground">Jogos encontradas</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {result.fiveHits.slice(0, 6).map((c) => {
          const matched = c.numbers.filter((b) => result.combination.includes(b));
          const missed = result.combination.filter((n) => !c.numbers.includes(n));
          return (
            <div key={c.id} className="card-surface p-4">
              <p className="text-xs text-muted-foreground mb-2">
                Concurso #{c.id} — {c.date}
              </p>
              <div className="flex gap-1.5">
                {c.numbers.map((b) => (
                  <BallBadge
                    key={b}
                    number={b}
                    size="sm"
                    color={matched.includes(b) ? 'hsl(var(--accent-green))' : undefined}
                    dimmed={!matched.includes(b)}
                  />
                ))}
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
