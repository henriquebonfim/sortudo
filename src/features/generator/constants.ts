import type { GenerationMode } from '@/lib/generator/types';

interface GenerationModeOption {
  key: GenerationMode;
  label: string;
}

interface GenerationModeGroup {
  label: string;
  modes: GenerationModeOption[];
}

export const GENERATION_MODE_GROUPS = [
  {
    label: 'Método',
    modes: [
      { key: 'random', label: 'Sorte 🍀' },
      { key: 'hot', label: 'Quentes 🔥' },
      { key: 'cold', label: 'Frios ❄️' },
      { key: 'dates', label: 'Datas (1–31) 📅' },
      { key: 'primes', label: 'Primos 🔢' },
      { key: 'fibonacci', label: 'Fibonacci ♾️' },
      { key: 'winners', label: 'Vencedoras 🏆' },
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
] as const satisfies readonly GenerationModeGroup[];
