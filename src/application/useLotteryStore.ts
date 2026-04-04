import { create } from 'zustand';
import { SyncService } from './services/SyncService';
import type { LotteryStats, SearchResult } from '@/domain/lottery/draw';
import { Draw, LotteryMetadata } from '@/domain/lottery/draw';
import { WorkerClient } from '@/infrastructure/worker';

const SIMULATION_COUNT_KEY = 'total_simulations';

interface LotteryState {
  stats: LotteryStats | null;
  metadata: LotteryMetadata | null;
  draws: Draw[];
  isSeeding: boolean;
  initialized: boolean;
  error: string | null;
  simulationCount: number;

  // Actions
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
  search: (numbers: number[]) => Promise<SearchResult>;
  incrementSimulation: () => void;
}

export const useLotteryStore = create<LotteryState>((set, get) => {
  const _refreshFromRepo = async () => {
    try {
      const { draws, stats, metadata } = await SyncService.fetchLatestData();
      set({ stats, metadata, draws });
    } catch (err) {
      console.error('Error fetching static data:', err);
      throw err;
    }
  };

  return {
    stats: null,
    metadata: null,
    draws: [],
    isSeeding: false,
    initialized: false,
    error: null,
    simulationCount: (() => {
      const stored = localStorage.getItem(SIMULATION_COUNT_KEY);
      return stored ? parseInt(stored, 10) : 0;
    })(),

    initialize: async () => {
      if (get().initialized) return;

      set({ isSeeding: true, error: null });
      try {
        await _refreshFromRepo();
        set({ initialized: true });
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Initialization failure' });
      } finally {
        set({ isSeeding: false });
      }
    },

    refresh: async () => {
      set({ error: null });
      try {
        await _refreshFromRepo();
      } catch (err) {
        set({ error: err instanceof Error ? err.message : 'Refresh failure' });
      }
    },

    search: async (numbers: number[]) => {
      const { draws } = get();
      return WorkerClient.getInstance().searchCombination({ numbers, draws });
    },

    incrementSimulation: () => {
      const next = get().simulationCount + 1;
      localStorage.setItem(SIMULATION_COUNT_KEY, String(next));
      set({ simulationCount: next });
    },
  };
});

