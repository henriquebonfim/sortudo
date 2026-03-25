import { create } from 'zustand';
import { LotteryStats } from '@/domain/lottery/lottery.types';
import { Draw, LotteryMetadata } from '@/domain/lottery/draw.model';
import { searchCombination } from '@/domain/lottery/search-engine';
import { StatisticsService } from '@/domain/lottery/statistics.service';
import { DrawMapper } from '@/domain/lottery/draw.mapper';
import type { SearchResult } from '@/domain/lottery/lottery.types';

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
      const res = await fetch('/data.json');
      if (!res.ok) throw new Error('Failed to load static data');
      const data = await res.json();
      
      const rawDraws = data.draws || data.concursos || [];
      const draws = DrawMapper.toDomainList(rawDraws);
      const metadata = DrawMapper.extractMetadata(data, draws);
      const stats = draws.length > 0 ? StatisticsService.calculateAllStats(draws) : null;

      set({ 
        stats, 
        metadata, 
        draws 
      });
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
      return searchCombination(numbers, draws, undefined);
    },

    incrementSimulation: () => {
      const next = get().simulationCount + 1;
      localStorage.setItem(SIMULATION_COUNT_KEY, String(next));
      set({ simulationCount: next });
    },
  };
});

