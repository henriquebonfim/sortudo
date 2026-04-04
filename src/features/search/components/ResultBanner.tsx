import { TOTAL_COMBINATIONS } from '@/domain/lottery/lottery.constants';
import type { SearchResult } from '@/domain/lottery/lottery.types';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { TrendingDown, Trophy } from 'lucide-react';
import { useEffect } from 'react';
import { JackpotDetails } from './JackpotDetails';

interface ResultBannerProps {
  result: SearchResult;
}

export function ResultBanner({ result }: ResultBannerProps) {
  const isWinner = result.jackpot.length > 0;

  useEffect(() => {
    if (isWinner) {
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FFB81C', '#FFF', '#FFD761', '#FF9500'],
      });
    }
  }, [isWinner]);

  if (!isWinner) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="result-banner-empty"
        data-testid="result-banner-empty"
      >
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
          style={{
            background: 'hsl(0 80% 58% / 0.12)',
            border: '1px solid hsl(0 80% 58% / 0.25)',
          }}
        >
          <TrendingDown className="w-6 h-6" style={{ color: 'hsl(0 80% 62%)' }} strokeWidth={2} />
        </div>

        <p className="font-display text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: 'hsl(0 78% 65%)' }}
        >
          Essa combinação <span className="uppercase tracking-wide">nunca</span> acertou a sena
        </p>

        <p className="mt-1 font-mono text-xs text-muted-foreground tabular-nums">
          em {formatNumber(result.totalAnalyzed)} sorteios oficiais avaliados
        </p>

        <JackpotDetails result={result} />

        {/* Probability pill */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
          style={{
            background: 'hsl(228 28% 14% / 0.7)',
            border: '1px solid hsl(228 30% 100% / 0.07)',
          }}
        >
          <span className="text-muted-foreground">Chance amanhã:</span>
          <span className="font-mono font-semibold text-primary">
            1 em {formatNumber(TOTAL_COMBINATIONS)}
          </span>
        </div>


        <p className="mt-3 text-xs text-muted-foreground max-w-md mx-auto">
          Estatisticamente, isso é o esperado. Toda combinação tem a mesmíssima chance.
        </p>

      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="result-banner-win"
      data-testid="result-banner-success"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
        style={{
          background: 'hsl(145 66% 48% / 0.15)',
          border: '1px solid hsl(145 66% 48% / 0.3)',
        }}
      >
        <Trophy className="w-6 h-6" style={{ color: 'hsl(145 66% 52%)' }} strokeWidth={2} />
      </div>

      <p className="font-display text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'hsl(145 66% 55%)' }}>
        Essa combinação já saiu {result.jackpot.length > 1 ? 'várias vezes' : 'uma vez'}!
      </p>

      <div className="mt-5 grid gap-3 grid-cols-1 sm:grid-cols-2 text-left">
        {result.jackpot.map((c) => (
          <div key={c.id} className="glass-card p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-display font-bold text-sm text-foreground">Concurso #{c.id}</span>
              <span className="text-xs text-muted-foreground">{c.date}</span>
            </div>
            <div className="flex flex-col text-xs text-muted-foreground gap-1 mt-2">
              {c.jackpotWinners > 0 && (
                <div>Ganhadores: <span className="text-foreground font-bold">{c.jackpotWinners}</span></div>
              )}
              <div>Prêmio: <span className="font-bold" style={{ color: 'hsl(145 66% 52%)' }}>
                {c.jackpotPrize > 0 ? formatCurrency(c.jackpotPrize) : 'Acumulou'}
              </span></div>
            </div>
            {c.locations && c.locations.length > 0 && (
              <div className="text-[10px] opacity-60 mt-2 truncate max-w-full">
                Locais: {c.locations.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
