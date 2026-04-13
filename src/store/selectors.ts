import { useAnalyticsStore } from '@/store/analytics';
import { useDataSourceStore } from '@/store/data';
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

/** Returns whether analytics are currently being recalculated. */
export function useIsAnalyticsCalculating() {
  return useAnalyticsStore((s) => s.isCalculating);
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

/** Returns the currently selected data source (official/local). */
export function useDataSource() {
  return useDataSourceStore((s) => s.source);
}

/** Returns whether local uploaded data is available. */
export function useHasLocalData() {
  return useDataSourceStore((s) => s.hasLocalData);
}
