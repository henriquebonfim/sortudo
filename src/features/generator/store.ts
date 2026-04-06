import { createPersistedStore } from '@/lib/zustand';
import { useLotteryStore } from '@/store/lottery';
import { NumberGenerator, GenerationMode } from './lib/generator';
import type { SearchResult, Game } from '@/lib/lottery/types';

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
