import { TOTAL_COMBINATIONS } from '@/domain/lottery/lottery.constants';
import type { SearchResult } from '@/domain/lottery/lottery.types';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface ResultBannerProps {
  result: SearchResult;
}

export function ResultBanner({ result }: ResultBannerProps) {
  const isWinner = result.jackpot.length > 0;

  useEffect(() => {
    if (isWinner) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isWinner]);

  if (!isWinner) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="font-display text-2xl font-bold text-hot sm:text-3xl">
          Essa combinação NUNCA foi sorteada
        </p>
        <p className="mt-2 font-mono text-sm text-muted-foreground tabular-nums">
          em {formatNumber(result.totalAnalyzed)} concursos históricos.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Mas isso não significa nada. Ela tem a mesma chance de sair amanhã:{' '}
          <span className="font-mono text-primary">1 em {formatNumber(TOTAL_COMBINATIONS)}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="card-surface p-8 text-center">
      <p className="font-display text-2xl font-bold text-green sm:text-3xl">
        🎉 Incrível! Sua combinação saiu {result.jackpot.length} vez(es)!
      </p>
      <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
        {result.jackpot.map((c) => (
          <div key={c.id} className="glass-card p-4 text-left border-primary/20">
            <div className="flex justify-between items-center mb-1">
              <span className="font-display font-bold text-base text-foreground">Concurso #{c.id}</span>
              <span className="text-xs text-muted-foreground">{c.date}</span>
            </div>
            <div className="flex flex-col text-xs text-muted-foreground gap-1 mt-2">
              {c.jackpotWinners > 0 && <div>Ganhadores: <span className="text-foreground font-bold">{c.jackpotWinners}</span></div>}
              <div>Prêmio: <span className="text-green font-bold">{c.jackpotPrize > 0 ? formatCurrency(c.jackpotPrize) : 'Acumulou'}</span></div>
            </div>
            {c.locations && c.locations.length > 0 && (
              <div className="text-[10px] opacity-75 mt-2 truncate max-w-full">
                Locais: {c.locations.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
