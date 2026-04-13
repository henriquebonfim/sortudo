import { GENERATION_MODE_GROUPS } from '@/features/generator/constants';
import { useSimulator } from '@/hooks/use-generator';
import { type GenerationMode } from '@/lib/generator/types';
import { MiniBall } from '@/shared/components/MiniBall';
import { ResultBanner } from '@/shared/components/ResultBanner';
import { ShareButton } from '@/shared/components/ShareButton';
import { TOTAL_COMBINATIONS } from '@/shared/constants';
import { LotteryFrequencies } from '@/shared/types';
import { formatNumber, formatTime, getBallColor } from '@/shared/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Clock, Dices, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const MODE_MESSAGES: Partial<Record<GenerationMode, string>> = {
  dates:
    'Jogar datas é tão válido quanto qualquer outra combinação. Mas como muita gente faz isso, você dividiria o prêmio com mais pessoas.',
  primes:
    'Existem 17 números primos na Mega-Sena. A probabilidade estatística de saírem 6 simultaneamente é pequena.',
  fibonacci: 'A sequência de Fibonacci gera apenas 9 dezenas compatíveis na Mega-Sena.',
  '3odds-3evens':
    'Cerca de 31% dos sorteios da Mega-Sena resultam em 3 ímpares e 3 pares. É o padrão mais comum.',
};

const SHUFFLE_TRANSITION = {
  duration: 0.35,
  repeat: Infinity,
  ease: 'easeInOut' as const,
};

const REVEAL_SPRING = {
  type: 'spring' as const,
  stiffness: 450,
  damping: 20,
};

interface GeneratedEntry {
  id: number;
  numbers: number[];
  timestamp: Date;
}

interface GeneratorContextMessageProps {
  mode: GenerationMode;
  hasNumbers: boolean;
}

interface GeneratorBallDisplayProps {
  displayNums: number[];
  shuffling: boolean;
  freq: LotteryFrequencies | null;
}

interface GeneratorModeSelectorProps {
  currentMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  disabled?: boolean;
}

interface GeneratorHistoryDropdownProps {
  history: GeneratedEntry[];
  onClear: () => void;
  onSelect: (nums: number[]) => void;
}

function GeneratorBallDisplay({ displayNums, shuffling, freq }: GeneratorBallDisplayProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      {displayNums.map((num, idx) => {
        const min = freq?.min?.frequency || 0;
        const max = freq?.max?.frequency || 100;

        const color =
          freq && num > 0
            ? getBallColor(freq.frequencies[String(num)] || 0, min, max)
            : 'hsl(228 22% 22%)';

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -24, scale: 0.7 }}
            animate={
              shuffling
                ? { opacity: 1, y: 0, scale: [1, 1.12, 0.96, 1.05, 1], rotate: [0, -4, 4, -2, 0] }
                : { opacity: 1, y: 0, scale: 1, rotate: 0 }
            }
            transition={shuffling ? SHUFFLE_TRANSITION : { ...REVEAL_SPRING, delay: idx * 0.04 }}
            className="lottery-ball w-[72px] h-[72px] sm:w-20 sm:h-20 text-lg sm:text-2xl select-none"
            style={{
              background: color,
              boxShadow: `0 6px 28px ${color}60, 0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22)`,
            }}
          >
            <span className="relative z-10 font-mono font-bold tracking-tighter">
              {num > 0 ? String(num).padStart(2, '0') : '—'}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function GeneratorContextMessage({ mode, hasNumbers }: GeneratorContextMessageProps) {
  if (!hasNumbers) {
    return null;
  }

  const message =
    MODE_MESSAGES[mode] ||
    `Esta combinação tem exatamente 1 em ${formatNumber(TOTAL_COMBINATIONS)} de ganhar a sena.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 max-w-2xl mx-auto px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-center"
    >
      <p className="text-sm text-muted-foreground leading-relaxed italic">"{message}"</p>
    </motion.div>
  );
}

function GeneratorHistoryDropdown({ history, onClear, onSelect }: GeneratorHistoryDropdownProps) {
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

  return (
    <div ref={ref} className="relative inline-block w-full max-w-[320px]">
      <button
        onClick={() => setOpen((state) => !state)}
        className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200"
        style={{
          background: open ? 'hsl(43 96% 56% / 0.15)' : 'hsl(228 28% 12% / 0.7)',
          border: `1px solid ${open ? 'hsl(43 96% 56% / 0.4)' : 'hsl(228 30% 100% / 0.08)'}`,
          color: open ? 'hsl(43 96% 68%)' : 'hsl(215 14% 55%)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2 font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span className="tabular-nums">Seus jogos ({history.length})</span>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            className="absolute top-full left-0 right-0 z-50 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0c]/95 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/60">
                Histórico
              </span>
              <button
                onClick={onClear}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400/80 hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" /> Limpar
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto scrollbar-thin">
              {[...history].reverse().map((entry, index) => (
                <button
                  key={entry.id}
                  onClick={() => {
                    onSelect(entry.numbers);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 border-b border-white/5"
                >
                  <span className="text-[10px] font-mono tabular-nums text-muted-foreground/40 shrink-0">
                    #{history.length - index}
                  </span>
                  <div className="flex gap-1 flex-1">
                    {entry.numbers.map((number) => (
                      <MiniBall key={number} number={number} size="xs" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono tabular-nums text-muted-foreground/40 shrink-0">
                    {formatTime(entry.timestamp)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GeneratorModeSelector({
  currentMode,
  onModeChange,
  disabled,
}: GeneratorModeSelectorProps) {
  return (
    <div className="mt-12 space-y-4">
      {GENERATION_MODE_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3 text-center">
            {group.label}
          </p>
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {group.modes.map((mode) => {
              const isActive = currentMode === mode.key;

              return (
                <button
                  key={mode.key}
                  disabled={disabled}
                  onClick={() => onModeChange(mode.key)}
                  className={`mode-pill px-4 py-2 border rounded-full text-xs font-medium cursor-pointer transition-all ${isActive ? 'bg-primary/20 border-primary text-primary shadow-glow-gold/20' : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'}`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Generator() {
  const {
    mode,
    setMode,
    numbers,
    displayNums,
    shuffling,
    result,
    searched,
    generate,
    loadNumbers,
    freq,
  } = useSimulator();
  const [history, setHistory] = useState<GeneratedEntry[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (numbers.length === 6 && !shuffling) {
      setHistory((prev) => {
        if (
          prev.length > 0 &&
          JSON.stringify(prev[prev.length - 1].numbers) === JSON.stringify(numbers)
        )
          return prev;
        return [...prev, { id: idRef.current++, numbers: [...numbers], timestamp: new Date() }];
      });
    }
  }, [numbers, shuffling]);

  return (
    <div className="page-hero">
      <section className="container m-auto flex flex-col pt-16 pb-32 px-4 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl mb-8 shadow-glow-gold bg-primary/10 border border-primary/30">
            <Dices className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">
            Gerador da <span className="text-gradient-gold">Sorte</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Análise estatística avançada para suas dezenas favoritas.
          </p>
        </motion.div>

        <div className="flex flex-col gap-12 items-center w-full">
          <GeneratorBallDisplay displayNums={displayNums} shuffling={shuffling} freq={freq} />
          <div className="flex flex-col items-center gap-8 w-full">
            <button
              onClick={generate}
              disabled={shuffling || !freq}
              className="btn-generate  h-12  text-lg font-bold shadow-glow-gold/20"
            >
              {shuffling ? 'Gerando...' : 'Gerar Combinação'}
            </button>
            <GeneratorHistoryDropdown
              history={history}
              onClear={() => setHistory([])}
              onSelect={loadNumbers}
            />
          </div>
        </div>

        <GeneratorModeSelector currentMode={mode} onModeChange={setMode} disabled={shuffling} />
        <GeneratorContextMessage mode={mode} hasNumbers={numbers.length > 0} />
        <div className="mt-10">
          <ShareButton />
        </div>

        <AnimatePresence>
          {searched && result && (
            <motion.div
              key={numbers.join('-')}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
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
