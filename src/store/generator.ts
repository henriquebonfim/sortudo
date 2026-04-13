

import type { Game, SearchResult } from '@/lib/core/types';
import { NumberGenerator } from '@/lib/generator';
import { createPersistedStore } from '@/lib/zustand';
import { useLotteryStore } from '@/store/lottery';

type GenerationModeGroup = (typeof GENERATION_MODE_GROUPS)[number];
export type GenerationMode = GenerationModeGroup['modes'][number]['key'];

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
] as const;


interface GeneratorState {
  simulationCount: number;
  mode: GenerationMode;
  numbers: number[];
  result: SearchResult | null;
  searched: boolean;

  // Injected Services (Dependency Inversion)
  verificationService: ((numbers: number[], games: Game[]) => Promise<SearchResult>) | null;
  statsProvider: (() => { hotNumbers: number[]; coldNumbers: number[] } | null) | null;

  // Actions
  setMode: (mode: GenerationMode) => void;
  setServices: (services: {
    verificationService?: GeneratorState['verificationService'];
    statsProvider?: GeneratorState['statsProvider'];
  }) => void;
  generate: () => Promise<void>;
  loadNumbers: (nums: number[]) => void;
  incrementSimulation: () => void;
}

export const useGeneratorStore = createPersistedStore<GeneratorState, { simulationCount: number }>(
  'generator',
  (set, get) => ({
    simulationCount: 0,
    mode: 'random',
    numbers: [],
    result: null,
    searched: false,
    verificationService: null,
    statsProvider: null,

    setMode: (mode) => set({ mode }),

    setServices: (services) => set((state) => ({ ...state, ...services })),

    incrementSimulation: () => set((state) => ({ simulationCount: state.simulationCount + 1 })),

    loadNumbers: (numbers) => set({ numbers, result: null, searched: false }),

    generate: async () => {
      const { mode, statsProvider, verificationService } = get();
      const games = useLotteryStore.getState().games;

      // Get stats from the injected provider
      const stats = statsProvider?.();
      if (!stats) {
        console.warn(
          'Generator: statsProvider not set or returned no data. Using basic generation.'
        );
      }

      const generatedNumbers = NumberGenerator.generate(mode, {
        hotNumbers: stats?.hotNumbers || [],
        coldNumbers: stats?.coldNumbers || [],
        games,
      });

      set({ numbers: generatedNumbers, result: null, searched: false });
      get().incrementSimulation();

      // Auto-trigger search for the generated combination using injected service
      if (verificationService) {
        try {
          const result = await verificationService(generatedNumbers, games);
          set({ result, searched: true });
        } catch (err) {
          console.error('Search after generation failed:', err);
        }
      }
    },
  }),
  (state) => ({ simulationCount: state.simulationCount })
);
