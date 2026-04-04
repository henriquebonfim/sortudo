import { useSimulator } from '@/application/useSimulator';
import { FrequenciesResponse } from '@/domain/lottery/data/draw';
import { GenerationMode } from '@/domain/lottery/generators/number-generator';
import { TOTAL_COMBINATIONS } from '@/domain/lottery/lottery.constants';
import { ResultBanner, ShareButton } from '@/features/shared';
import { formatNumber, getBallColor } from '@/lib';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Clock, Dices, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GeneratedEntry {
  id: number;
  numbers: number[];
  timestamp: Date;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/**
 * Renders the 6 main balls with shuffling animations.
 */
function BallDisplay({ displayNums, shuffling, freq }: {
  displayNums: (number | null)[];
  shuffling: boolean;
  freq: FrequenciesResponse | null
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      {displayNums.map((num, idx) => {
        const freqValues = freq ? Object.values(freq.frequencies) : [];
        const min = freqValues.length ? Math.min(...freqValues) : 0;
        const max = freqValues.length ? Math.max(...freqValues) : 0;

        const color =
          freq && num && num > 0
            ? getBallColor(
              freq.frequencies[String(num)] ?? (freqValues.reduce((a, b) => a + b, 0) / freqValues.length),
              min,
              max
            )
            : 'hsl(228 22% 22%)';

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -24, scale: 0.7 }}
            animate={
              shuffling
                ? {
                  opacity: 1,
                  y: 0,
                  scale: [1, 1.12, 0.96, 1.05, 1],
                  rotate: [0, -4, 4, -2, 0],
                }
                : {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                }
            }
            transition={
              shuffling
                ? {
                  duration: 0.35,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
                : {
                  type: 'spring',
                  stiffness: 450,
                  damping: 20,
                  delay: idx * 0.04,
                }
            }
            className="lottery-ball w-[72px] h-[72px] sm:w-20 sm:h-20 text-lg sm:text-2xl select-none"
            style={{
              background: color,
              boxShadow: `0 6px 28px ${color}60, 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22)`,
            }}
          >
            <span className="relative z-10 font-mono font-bold tracking-tighter">
              {num && num > 0 ? String(num).padStart(2, '0') : '—'}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

import { MiniBall } from '@/features/shared/MiniBall';

/**
 * Dropdown showing previous generations.
 */
function HistoryDropdown({ history, currentNumbers, onClear, onSelect }: {
  history: GeneratedEntry[];
  currentNumbers: number[];
  onClear: () => void;
  onSelect: (nums: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const [prevHistoryLength, setPrevHistoryLength] = useState(history.length);
  if (history.length !== prevHistoryLength) {
    setPrevHistoryLength(history.length);
    if (history.length === 1) setOpen(true);
  }


  const formatTime = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div ref={ref} className="relative inline-block w-full max-w-[320px]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200"
        style={{
          background: open ? 'hsl(43 96% 56% / 0.15)' : 'hsl(228 28% 12% / 0.7)',
          border: `1px solid ${open ? 'hsl(43 96% 56% / 0.4)' : 'hsl(228 30% 100% / 0.08)'}`,
          color: open ? 'hsl(43 96% 68%)' : 'hsl(215 14% 55%)',
          backdropFilter: 'blur(12px)',
        }}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span className="tabular-nums">Seus jogos ({history.length})</span>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="inline-flex">
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 z-50 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0c]/95 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">Histórico</span>
              <button onClick={onClear} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-red-400/80 hover:text-red-400 transition-colors">
                <Trash2 className="w-3 h-3" /> Limpar
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto scrollbar-thin">
              {[...history].reverse().map((entry, i) => {
                const isSelected = JSON.stringify(entry.numbers) === JSON.stringify(currentNumbers);
                return (
                  <motion.button
                    key={entry.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => { onSelect(entry.numbers); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 text-left border-b border-white/5 ${isSelected ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                  >
                    <span className="text-[10px] font-mono tabular-nums w-5 text-right shrink-0 text-muted-foreground/40">#{history.length - i}</span>
                    <div className="flex gap-1 flex-1">{entry.numbers.map((n) => <MiniBall key={n} number={n} size="xs" />)}</div>
                    <span className="text-[10px] font-mono tabular-nums shrink-0 text-muted-foreground/40">{formatTime(entry.timestamp)}</span>
                  </motion.button>
                );
              })}
            </div>
            <div className="px-4 py-2 bg-white/2 border-t border-white/5 text-[10px] text-muted-foreground/30 italic text-center">Clique para carregar uma combinação</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Mode selection grid.
 */
const MODE_GROUPS: { label: string; modes: { key: GenerationMode; label: string }[] }[] = [
  {
    label: 'Método',
    modes: [
      { key: 'random', label: 'Aleatório' },
      { key: 'hot', label: 'Só quentes 🔥' },
      { key: 'cold', label: 'Só frios ❄️' },
      { key: 'dates', label: 'Datas (1–31)' },
      { key: 'primes', label: 'Primos' },
      { key: 'fibonacci', label: 'Fibonacci' },
      { key: 'winners', label: 'Vencedoras' },
    ],
  },
  {
    label: 'Distribuição par/ímpar',
    modes: [
      { key: '6odds-0evens', label: 'Só Ímpares' },
      { key: '1odd-5evens', label: '1 Ímpar · 5 Pares' },
      { key: '2odds-4evens', label: '2 Ímpares · 4 Pares' },
      { key: '3odds-3evens', label: '3 Ímpares · 3 Pares' },
      { key: '4odds-2evens', label: '4 Ímpares · 2 Pares' },
      { key: '5odds-1even', label: '5 Ímpares · 1 Par' },
      { key: '0odds-6evens', label: 'Só Pares' },
    ],
  },
];

function ModeSelector({ currentMode, onModeChange, disabled }: {
  currentMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-12 space-y-4">
      {MODE_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3 text-center">{group.label}</p>
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.02 } }, hidden: {} }} className="flex flex-wrap justify-center gap-2 px-4">
            {group.modes.map((m) => {
              const isActive = currentMode === m.key;
              return (
                <motion.button
                  key={m.key}
                  disabled={disabled}
                  onClick={() => onModeChange(m.key)}
                  variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
                  whileTap={{ scale: 0.95 }}
                  className={`mode-pill px-4 py-2 cursor-pointer transition-all duration-200 border rounded-full text-xs font-medium ${isActive ? 'bg-primary/20 border-primary text-primary shadow-glow-gold/20' : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20'}`}
                >
                  {m.label}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/**
 * Renders context and advice based on selected generation mode.
 */
function ContextMessage({ mode, hasNumbers }: { mode: GenerationMode; hasNumbers: boolean }) {
  if (!hasNumbers) return null;

  const getMessage = () => {
    switch (mode) {
      case 'dates': return 'Jogar datas é tão válido quanto qualquer outra combinação — mesma probabilidade. Mas como muita gente faz isso, se você ganhar vai dividir com mais pessoas. Matematicamente pior.';
      case 'primes': return 'Existem 17 números primos na Mega-Sena. Jogar apenas primos é válido, mas a chance matemática de saírem 6 simultaneamente é pequena.';
      case 'fibonacci': return 'A sequência de Fibonacci gera apenas 9 dezenas compatíveis na Mega-Sena (1, 2, 3, 5, 8, 13, 21, 34, 55). Escolher entre eles restringe muito suas opções.';
      case '3odds-3evens': return 'Cerca de 31% dos sorteios da Mega-Sena resultam em 3 ímpares e 3 pares. É o padrão genérico mais comum estatisticamente.';
      default: return `Esta combinação tem exatamente 1 em ${formatNumber(TOTAL_COMBINATIONS)} de ganhar a sena.`;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="mt-8 max-w-2xl mx-auto px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-center">
      <p className="text-sm text-muted-foreground leading-relaxed italic">"{getMessage()}"</p>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function Generator() {
  const { mode, setMode, numbers, displayNums, shuffling, result, searched, generate, loadNumbers, freq } = useSimulator();
  const [history, setHistory] = useState<GeneratedEntry[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (numbers.length === 6 && !shuffling) {
      setHistory(prev => {
        const last = prev[prev.length - 1];
        if (last && JSON.stringify(last.numbers) === JSON.stringify(numbers)) return prev;
        return [...prev, { id: idRef.current++, numbers: [...numbers], timestamp: new Date() }];
      });
    }
  }, [numbers, shuffling]);

  return (
    <div className='page-hero'>
      <section className="container m-auto flex flex-col pt-16 pb-32 px-4 justify-center items-center overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-8 shadow-glow-gold bg-primary/10 border border-primary/30">
            <Dices className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight leading-tight">
            Gerador da <span className="text-gradient-gold">Sorte</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">Análise estatística avançada para suas dezenas favoritas.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-12 justify-center items-center w-full">
          <BallDisplay displayNums={displayNums} shuffling={shuffling} freq={freq} />
          <div className="flex flex-col items-center gap-8 w-full">
            <button onClick={generate} disabled={shuffling || !freq} className="btn-generate w-72 h-16 text-lg font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-glow-gold/20">
              {shuffling ? 'Gerando...' : 'Gerar Combinação'}
            </button>
            <HistoryDropdown history={history} currentNumbers={numbers} onClear={() => setHistory([])} onSelect={loadNumbers} />
          </div>
        </motion.div>

        <ModeSelector currentMode={mode} onModeChange={setMode} disabled={shuffling} />
        <ContextMessage mode={mode} hasNumbers={numbers.length > 0} />

        <div className="flex justify-center mt-10"><ShareButton /></div>

        <AnimatePresence>
          {searched && result && (
            <motion.div
              key={numbers.join('-')}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="mt-20 w-full max-w-3xl space-y-8"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <ResultBanner result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
