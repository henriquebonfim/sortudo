import type { LotteryStats } from '@/lib/core/types';
import { createPersistedStore } from '@/lib/zustand';
import { useLotteryStore } from '@/store/lottery';
import { AnalyticsWorkerClient } from '@/workers/analytics';

interface AnalyticsState {
  stats: LotteryStats | null;
  isCalculating: boolean;
  lastCalculated: string | null;
  error: string | null;

  // Actions
  calculateStats: (force?: boolean) => Promise<void>;
  clearError: () => void;
}

export const useAnalyticsStore = createPersistedStore<
  AnalyticsState,
  { stats: LotteryStats | null; lastCalculated: string | null }
>(
  'analytics',
  (set, get) => ({
    stats: null,
    isCalculating: false,
    lastCalculated: null,
    error: null,

    clearError: () => set({ error: null }),

    calculateStats: async (force = false) => {
      const { stats, isCalculating } = get();
      const games = useLotteryStore.getState().games;

      if (isCalculating) return;
      if (stats && !force) return;
      if (games.length === 0) return;

      set({ isCalculating: true, error: null });

      try {
        const result = await AnalyticsWorkerClient.getInstance().calculateStats({ games });
        set({
          stats: result,
          lastCalculated: new Date().toISOString(),
          isCalculating: false,
        });
      } catch (err) {
        console.error('Analytics calculation failed:', err);
        set({
          error: err instanceof Error ? err.message : 'Failed to calculate statistics',
          isCalculating: false,
        });
      }
    },
  }),
  (state) => ({
    stats: state.stats,
    lastCalculated: state.lastCalculated,
  })
);
