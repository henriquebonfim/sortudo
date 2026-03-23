import type { Mode } from '@/features/generator/generator.types';

const MODE_LABELS: Record<Mode, string> = {
  random: 'Aleatório',
  hot: 'Só quentes',
  cold: 'Só frios',
  sequential: '1 2 3 4 5 6',
  dates: 'Datas (1–31)',
  primes: 'Só Primos',
  fibonacci: 'Fibonacci',
  winners: 'Vencedoras',
  '6odds-0evens': 'Só Ímpares',
  '1odd-5evens': '1 Ímpar, 5 Pares',
  '2odds-4evens': '2 Ímpares, 4 Pares',
  '3odds-3evens': '3 Ímpares, 3 Pares',
  '4odds-2evens': '4 Ímpares, 2 Pares',
  '5odds-1even': '5 Ímpares, 1 Par',
  '0odds-6evens': 'Só Pares',
};

interface ModeSelectorProps {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  disabled?: boolean;
}

export function ModeSelector({ currentMode, onModeChange, disabled }: ModeSelectorProps) {
  return (
    <>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {(Object.keys(MODE_LABELS).slice(0, 8) as Mode[]).map((m) => (
          <button
            key={m}
            disabled={disabled}
            onClick={() => onModeChange(m)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${currentMode === m
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-card text-muted-foreground hover:text-foreground'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {(Object.keys(MODE_LABELS).slice(8) as Mode[]).map((m) => (
          <button
            key={m}
            disabled={disabled}
            onClick={() => onModeChange(m)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${currentMode === m
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-card text-muted-foreground hover:text-foreground'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          > {MODE_LABELS[m]}</button>
        ))}
      </div>
    </>
  );
}
