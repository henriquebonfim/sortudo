import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { Coins, RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { calculateCoinOdds } from '../lib/math';

const COIN_COUNT = 6;

type Side = 'heads' | 'tails';
const SIDE_LABEL: Record<Side, string> = { heads: '🤑', tails: '👑' };

function Coin({ side, index, flipping }: { side: Side; index: number; flipping: boolean }) {
  const isHeads = side === 'heads';
  return (
    <motion.div
      animate={flipping ? { rotateX: [0, -90, 90, -60, 0], y: [0, -18, 0] } : { rotateX: 0, y: 0 }}
      transition={{
        duration: flipping ? 0.55 : 0,
        delay: flipping ? index * 0.06 : 0,
        ease: 'easeOut',
      }}
      style={{ perspective: 600 }}
      className="flex-1 aspect-square"
    >
      <div
        className={`
          w-16 h-full rounded-full flex flex-col items-center justify-center m-auto gap-1
          border-2 transition-all duration-300 shadow-md select-none
          ${
            isHeads
              ? 'bg-gradient-to-br from-amber-400/20 to-amber-500/10 border-amber-500/60 shadow-amber-500/10'
              : 'bg-gradient-to-br from-slate-600/30 to-slate-700/20 border-slate-500/40 shadow-black/20'
          }
        `}
      >
        <span
          className={`text-xl font-black font-mono leading-none tabular-nums ${
            isHeads ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          {SIDE_LABEL[side]}
        </span>
        <span
          className={`text-[0.5rem] uppercase tracking-widest font-bold ${
            isHeads ? 'text-amber-500/70' : 'text-slate-500/70'
          }`}
        >
          {isHeads ? 'cara' : 'coroa'}
        </span>
      </div>
    </motion.div>
  );
}

export function CoinAnalogy() {
  const [coins, setCoins] = useState<Side[]>(Array(COIN_COUNT).fill('heads'));
  const [attempts, setAttempts] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [won, setWon] = useState(false);
  const [history, setHistory] = useState<boolean[]>([]); // true = win

  const flip = useCallback(() => {
    if (flipping) return;
    setFlipping(true);
    setWon(false);

    const newCoins: Side[] = Array.from({ length: COIN_COUNT }, () =>
      Math.random() < 0.5 ? 'heads' : 'tails'
    );

    setTimeout(() => {
      setCoins(newCoins);
      setAttempts((a) => a + 1);

      const allSame = newCoins.every((c) => c === newCoins[0]);
      setHistory((h) => [...h.slice(-19), allSame]);

      if (allSame) {
        setWon(true);
        confetti({
          particleCount: 180,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fcd34d', '#ffffff', '#10b981'],
        });
      }
    }, 380);

    setTimeout(() => setFlipping(false), 750);
  }, [flipping]);

  const allSame = coins.every((c) => c === coins[0]);
  const oddsDenominator = calculateCoinOdds(COIN_COUNT);
  const prob = `1/${oddsDenominator.toLocaleString('pt-BR')}`;
  const wins = history.filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      onViewportEnter={() => {
        if (attempts === 0 && !flipping) flip();
      }}
      className="glass-card p-5 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Coins className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">Analogia da Moeda</span>
        </div>
        {/* History dots */}
        {history.length > 0 && (
          <div className="flex items-center gap-2 ">
            {history.map((w, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  w ? 'bg-amber-400' : 'bg-muted-foreground/30'
                }`}
                title={w ? 'Todas iguais' : 'Misto'}
              />
            ))}
            {attempts > 0 && (
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                {attempts} tentativa{attempts !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        Lance <strong className="text-foreground">6 moedas</strong> e tente fazer todas cair no
        mesmo lado. Cada jogada tem{' '}
        <span className="font-mono text-primary font-semibold">{prob}</span> de chance —
        independente das anteriores.
      </p>

      {/* Coin Grid */}
      <div className="flex gap-2 h-16">
        {coins.map((side, i) => (
          <Coin key={i} side={side} index={i} flipping={flipping} />
        ))}
      </div>

      {/* Win banner */}
      <AnimatePresence>
        {won && (
          <motion.div
            key="win"
            initial={{ opacity: 0, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: 'auto' }}
            exit={{ opacity: 0, scale: 0.95, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-amber-400">Parabéns! Você conseguiu!</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Depois de <span className="text-amber-400 font-mono">{attempts}</span> tentativas
                  você conseguiu acertar <span className="text-amber-400 font-mono">{wins}</span>{' '}
                  {wins > 1 ? 'vezes' : 'vez'}!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  A próxima jogada ainda tem{' '}
                  <span className="text-amber-400 font-mono">{prob}</span> de chance.
                </p>
              </div>
              <span className="text-2xl">🎉</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/40 border border-border px-2 py-3">
          <div className="text-base font-bold font-mono text-primary tabular-nums">~3,1%</div>
          <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">
            Probabilidade
          </div>
        </div>
        <div className="rounded-xl bg-muted/40 border border-border px-2 py-3">
          <div className="text-base font-bold font-mono text-foreground tabular-nums">{wins}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">
            Acertos
          </div>
        </div>
        <div
          className={`rounded-xl border px-2 py-3 transition-colors ${
            allSame && attempts > 0
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-muted/40 border-border'
          }`}
        >
          <div
            className={`text-base font-bold font-mono tabular-nums ${
              allSame && attempts > 0 ? 'text-amber-400' : 'text-muted-foreground'
            }`}
          >
            {allSame && attempts > 0 ? '✓' : '—'}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">
            Agora
          </div>
        </div>
      </div>

      {/* Flip button */}
      <motion.button
        onClick={flip}
        disabled={flipping}
        whileTap={{ scale: flipping ? 1 : 0.97 }}
        className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm
          transition-all duration-200
          hover:brightness-110 active:brightness-90
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${flipping ? 'animate-spin' : ''}`} />
        {flipping ? 'Lançando...' : attempts === 0 ? 'Lançar moedas' : 'Lançar novamente'}
      </motion.button>

      <p className="text-[10px] text-muted-foreground text-center font-mono">
        P(todas iguais) = 2 ÷ 2⁶ · O passado não influencia o futuro.
      </p>
    </motion.div>
  );
}
