import { calculateTheoreticalParity, poissonProbability } from '@/lib/analytics';
import { TOTAL_COMBINATIONS } from '@/lib/core/constants';
import { LotteryMetadata } from '@/lib/core/types';
import { useAnalyticsStore } from '@/store/analytics';
import { useMemo } from 'react';

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

export function useParityDistributionComparison() {
  const raw = useParityDistribution();

  return useMemo(() => {
    const total = raw.reduce((sum, entry) => sum + entry.count, 0) || 1;

    return raw
      .map((entry, index) => {
        const pct = (entry.count / total) * 100;
        const label = `${entry.odds}O/${entry.evens}E`;
        const theoretical = calculateTheoreticalParity(label);

        return {
          ...entry,
          label,
          pct,
          originalIndex: index,
          theoretical,
        };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [raw]);
}

export function usePoissonSplitSeries() {
  return useMemo(() => {
    const data = [];

    for (let sales = 2_000_000; sales <= 250_000_000; sales += 4_000_000) {
      const lambda = sales / TOTAL_COMBINATIONS;
      const probZero = poissonProbability(lambda, 0);
      const probOne = poissonProbability(lambda, 1);
      const probMultiple = 1 - (probZero + probOne);

      data.push({
        sales,
        displaySales: `${(sales / 1_000_000).toFixed(0)}M`,
        probZero: parseFloat((probZero * 100).toFixed(1)),
        probOne: parseFloat((probOne * 100).toFixed(1)),
        probMultiple: parseFloat((probMultiple * 100).toFixed(1)),
        lambda: lambda.toFixed(2),
      });
    }

    return data;
  }, []);
}

export function useStreakEconomics() {
  return useAnalyticsStore((s) => s.stats?.streakEconomics || []);
}

export function useSumDistribution() {
  return useAnalyticsStore((s) => s.stats?.sumDistribution || []);
}

/**
 * Hook to manage analytics-specific metadata presentation logic.
 */
export function useAnalyticsMetadata(metadata: LotteryMetadata | null) {
  const isStale = useMemo(() => {
    if (!metadata?.lastUpdate) return false;
    const last = new Date(metadata.lastUpdate).getTime();
    const now = new Date().getTime();
    return now - last > 7 * 24 * 60 * 60 * 1000;
  }, [metadata]);

  const freshnessLabel = useMemo(() => {
    if (!metadata?.lastUpdate) return null;
    const days = Math.floor(
      (new Date().getTime() - new Date(metadata.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return 'Atualizado hoje';
    if (days === 1) return 'Atualizado ontem';
    return `Há ${Math.abs(days)} dias`;
  }, [metadata]);

  return {
    isStale,
    freshnessLabel,
  };
}
