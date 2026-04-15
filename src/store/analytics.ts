import type { Game, LotteryStats } from '@/lib/core/types';
import { createPersistedStore } from '@/lib/zustand';
import { useLotteryStore } from '@/store/lottery';
import { AnalyticsWorkerClient } from '@/workers/analytics';

function updateHash(currentHash: number, value: string): number {
  let hash = currentHash;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash;
}

function buildGamesSignature(games: Game[]): string {
  let hash = 2166136261;
  hash = updateHash(hash, String(games.length));

  for (const game of games) {
    hash = updateHash(hash, String(game.id));
    hash = updateHash(hash, game.date);
    hash = updateHash(hash, game.numbers.join(','));
    hash = updateHash(hash, String(game.jackpotWinners));
    hash = updateHash(hash, String(game.jackpotPrize));
    hash = updateHash(hash, game.accumulated ? '1' : '0');
  }

  return `${games.length}:${(hash >>> 0).toString(16)}`;
}

function hasLegacyAnalyticsSchema(stats: LotteryStats): boolean {
  const firstHotNumber = stats.hotNumbers?.[0] as
    | { count?: unknown; frequency?: unknown }
    | undefined;
  const hasLegacyHotNumbers =
    !!firstHotNumber && 'count' in firstHotNumber && !('frequency' in firstHotNumber);

  const firstTemporalBucket = stats.temporalFrequency?.[0];
  const hasLegacyTemporalFrequency =
    !!firstTemporalBucket &&
    (firstTemporalBucket.decade.startsWith('Década') || firstTemporalBucket.data.length <= 15);

  const hasLegacyOverlapHistory =
    !!stats.numberProfile && !Array.isArray(stats.numberProfile.overlapHistory);

  return hasLegacyHotNumbers || hasLegacyTemporalFrequency || hasLegacyOverlapHistory;
}

interface AnalyticsState {
  stats: LotteryStats | null;
  isCalculating: boolean;
  lastCalculated: string | null;
  statsSignature: string | null;
  error: string | null;

  // Actions
  calculateStats: (force?: boolean) => Promise<void>;
  invalidateStats: () => void;
  clearError: () => void;
}

export const useAnalyticsStore = createPersistedStore<
  AnalyticsState,
  {
    stats: LotteryStats | null;
    lastCalculated: string | null;
    statsSignature: string | null;
  }
>(
  'analytics',
  (set, get) => ({
    stats: null,
    isCalculating: false,
    lastCalculated: null,
    statsSignature: null,
    error: null,

    clearError: () => set({ error: null }),

    invalidateStats: () => set({ statsSignature: null, error: null }),

    calculateStats: async (force = false) => {
      const { stats, isCalculating, statsSignature } = get();
      const games = useLotteryStore.getState().games;

      if (isCalculating) return;
      if (games.length === 0) return;

      const nextSignature = buildGamesSignature(games);
      const shouldReuseCachedStats =
        !force && stats && statsSignature === nextSignature && !hasLegacyAnalyticsSchema(stats);

      if (shouldReuseCachedStats) return;

      if (!force && stats && statsSignature === nextSignature && hasLegacyAnalyticsSchema(stats)) {
        console.warn('Legacy analytics schema detected in cache. Recalculating statistics...');
      }

      set({ isCalculating: true, error: null });

      try {
        const result = await AnalyticsWorkerClient.getInstance().calculateStats({ games });
        set({
          stats: result,
          lastCalculated: new Date().toISOString(),
          statsSignature: nextSignature,
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
    statsSignature: state.statsSignature,
  })
);
