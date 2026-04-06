import { useAnalyticsStore } from '@/features/analytics/store';

export function useLotteryFullStats() {
  return useAnalyticsStore((s) => s.stats);
}

export function useGeoWinners() {
  return useAnalyticsStore((s) => s.stats?.geoWinners || []);
}

export function useTopJackpotWinners() {
  return useAnalyticsStore((s) => s.stats?.topJackpotWinners || []);
}

export function useGapAnalysis() {
  return useAnalyticsStore((s) => s.stats?.gapAnalysis || []);
}

export function useHotNumbers() {
  return useAnalyticsStore((s) => s.stats?.hotNumbers || []);
}

export function useAccumulationTrend() {
  return useAnalyticsStore((s) => s.stats?.accumulationTrend || []);
}

export function useTemporalFrequency() {
  return useAnalyticsStore((s) => s.stats?.temporalFrequency || []);
}

export function useNumberProfile() {
  return useAnalyticsStore((s) => s.stats?.numberProfile || null);
}

export function useTopPairs() {
  return useAnalyticsStore((s) => s.stats?.topPairs || []);
}

export function useTypeComparison() {
  return useAnalyticsStore((s) => s.stats?.typeComparison || null);
}

export function usePrizeTierComparison() {
  return useAnalyticsStore((s) => s.stats?.prizeTierComparison || []);
}

export function useParityDistribution() {
  return useAnalyticsStore((s) => s.stats?.parityDistribution || []);
}

export function useStreakEconomics() {
  return useAnalyticsStore((s) => s.stats?.streakEconomics || []);
}

export function useSumDistribution() {
  return useAnalyticsStore((s) => s.stats?.sumDistribution || []);
}
