import { useAnalyticsStore } from '@/store/analytics';
import { useLotteryStore } from '@/store/lottery';

/** Returns true if the lottery data is still being loaded/initialized. */
export function useIsSeeding() {
  return useLotteryStore((s) => s.isSeeding || !s.initialized);
}

/** Returns the raw array of all historical games. */
export function useGames() {
  return useLotteryStore((s) => s.games);
}

/** Returns high-level metadata about the lottery dataset (first date, last date, etc). */
export function useLotteryMetadata() {
  return useLotteryStore((s) => s.metadata);
}

/**
 * Returns high-level summary metrics (calculated by analytics).
 * This is exposed here to provide a stable path for non-analytics features.
 */
export function useLotteryMeta() {
  return useAnalyticsStore((s) => s.stats?.meta);
}

/**
 * Returns historical prize trend data (calculated by analytics).
 * This is exposed here to provide a stable path for non-analytics features.
 */
export function usePrizeEvolution() {
  return useAnalyticsStore((s) => s.stats?.prizeEvolution || []);
}

/**
 * Returns overall frequencies needed by shared UI (like MiniBall) and non-analytics features.
 */
export function useFrequencies() {
  return useAnalyticsStore((s) => s.stats?.frequencies);
}
