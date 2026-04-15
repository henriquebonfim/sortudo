import { useLotteryMath } from '@/hooks/use-home';
import { AnimatedCounter } from '@/shared/components/AnimatedCounter';
import { BALLS_PER_DRAW, MAX_LOTTERY_NUMBER, TOTAL_COMBINATIONS } from '@/shared/constants';
import { fadeUp, formatNumber, stagger } from '@/shared/utils';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Binary, Calculator, Coins, Info, RefreshCw, Star, Trophy, Zap } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const COIN_COUNT = 6;

type Side = 'heads' | 'tails';
const SIDE_LABEL: Record<Side, string> = { heads: '🤑', tails: '👑' };

function calculateCoinOdds(count: number): number {
  return Math.pow(2, count) / 2;
}
function calculateHitChance(total: number, multiplier: number): number {
  return Math.round(total / multiplier);
}

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

function CoinAnalogy() {
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

function CombinatorialFormula() {
  return (
    <motion.div variants={fadeUp} className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Binary className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display font-bold text-2xl text-foreground">Análise Combinatória</h3>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed">
        A Mega-Sena consiste em escolher{' '}
        <strong className="text-foreground">
          {BALLS_PER_DRAW} números de {MAX_LOTTERY_NUMBER}
        </strong>
        . O total de combinações é calculado pela fórmula de combinações simples:
      </p>

      <div className="glass-card p-8 border-l-4 border-l-primary font-mono shadow-2xl bg-black/40">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-lg">
            <span className="text-muted-foreground">C(n, k) =</span>
            <div className="flex flex-col items-center">
              <span className="border-b border-muted-foreground px-2">n!</span>
              <span>k! (n-k)!</span>
            </div>
          </div>
          <div className="text-primary font-bold text-xl pt-4">C(60, 6) = 50.063.860</div>
          <div className="text-4xl md:text-5xl font-display font-bold text-white mt-4 tracking-tighter">
            <AnimatedCounter target={TOTAL_COMBINATIONS} duration={2500} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
            combinações únicas possíveis
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function CombinatorialChart({
  combosTable,
}: {
  combosTable: { n: number; combos: number; label: string }[];
}) {
  const { ticketPrice } = useLotteryMath();

  const data = useMemo(
    () =>
      combosTable.map((c) => {
        const cost = c.combos * ticketPrice;
        const chance = calculateHitChance(TOTAL_COMBINATIONS, c.combos);

        return {
          name: c.label,
          value: c.combos,
          cost,
          display: formatNumber(c.combos),
          displayCost: cost.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
          }),
          displayChance: `1 em ${formatNumber(chance)}`,
          multiplier: formatNumber(c.combos),
        };
      }),
    [combosTable, ticketPrice]
  );

  return (
    <motion.div
      variants={fadeUp}
      className="glass-card p-6 min-h-[440px] border-white/5 bg-white/2 shadow-xl flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">
            Múltiplas Apostas
          </p>
          <h4 className="text-lg font-display font-bold text-foreground">
            Escala Combinatória vs Custo
          </h4>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Preço/Jogo
          </p>
          <p className="text-sm font-mono font-bold text-foreground">
            {ticketPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>

      <div className="mt-2 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
          <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl space-y-3 min-w-[200px] z-50">
                      <div className="pb-2 border-b border-white/5 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {item.name} Números
                        </p>
                        <div
                          className={`w-2 h-2 rounded-full ${Number(item.name) === 6 ? 'bg-primary shadow-[0_0_8px_rgba(251,197,49,0.5)]' : 'bg-white/20'}`}
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            Equivale a
                          </p>
                          <p className="text-lg font-mono font-bold text-primary">
                            {item.display}{' '}
                            <span className="text-xs font-normal opacity-50">jogos</span>
                          </p>
                        </div>

                        <div className="flex flex-col gap-0.5 pt-1 border-t border-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            Probabilidade de Acerto (Sena)
                          </p>
                          <p className="text-lg font-mono font-bold text-primary">
                            {item.displayChance}
                          </p>
                        </div>
                        <div className="flex flex-col gap-0.5 pt-1 border-t border-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            Investimento Total
                          </p>
                          <p className="text-lg font-mono font-bold text-emerald-400">
                            {item.displayCost}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24} animationDuration={1500}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#fbc531' : '#2f3640'}
                  className="transition-all duration-300 hover:brightness-125 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-[10px] text-muted-foreground font-mono leading-tight">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Aposta Simples (6 nº)</span>
        </div>
        <p>
          Ao marcar 20 números (máximo), você paga {data[14]?.displayCost} por uma única cartela.
        </p>
      </div>
    </motion.div>
  );
}

export function MathSection({ id }: { id: string }) {
  const { combosTable } = useLotteryMath();

  return (
    <section id={id} className="container max-w-6xl mx-auto py-32 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
          <Calculator className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">
          A <span className="text-gradient-gold">Matemática</span> do Improvável
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Para vencer, você precisa desafiar as leis da probabilidade. Entenda o que acontece nos
          bastidores de cada sorteio.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
      >
        <div className="space-y-16">
          <motion.div variants={fadeUp} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl text-foreground">
                Probabilidades de Ganhar
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              As chances de acerto variam drasticamente conforme o prêmio. A sena é um dos eventos
              mais raros da matemática moderna.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  label: 'Sena (6 acertos)',
                  chance: '1 em 50.063.860',
                  color: 'border-primary text-primary bg-primary/5',
                  icon: <Trophy className="w-4 h-4" />,
                },
                {
                  label: 'Quina (5 acertos)',
                  chance: '1 em 154.518',
                  color: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
                  icon: <Award className="w-4 h-4" />,
                },
                {
                  label: 'Quadra (4 acertos)',
                  chance: '1 em 2.332',
                  color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
                  icon: <Star className="w-4 h-4" />,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between p-5 rounded-2xl border ${item.color} shadow-lg font-mono`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                  <span className="text-base font-bold">{item.chance}</span>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-start gap-4">
                <Zap className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">
                    Independência Estatística
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    O sorteador mecânico é reiniciado do zero absoluto a cada extração. As bolas
                    físicas não possuem histórico, memória ou inclinação.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <CoinAnalogy />
        </div>

        <div className="space-y-16 lg:sticky lg:top-8">
          <CombinatorialFormula />
          <CombinatorialChart combosTable={combosTable} />
        </div>
      </motion.div>
    </section>
  );
}
