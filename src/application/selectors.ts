import { useLotteryStore } from '@/application/useLotteryStore';
import type { Draw } from '@/domain/lottery/data/draw';
import {
  BALLS_PER_DRAW,
  MAX_LOTTERY_NUMBER,
  TICKET_PRICE,
  TOTAL_COMBINATIONS
} from '@/domain/lottery/lottery.constants';
import { RevenueService } from '@/domain/lottery/services';
import { getCombosTable } from '@/domain/math';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

// ─── System State Selectors ──────────────────────────────────────────────────

/** Selects whether the store has been initialized. */
export const useIsInitialized = () =>
  useLotteryStore((state) => state.initialized);

/** Selects whether the store is currently seeding data. */
export const useIsSeeding = () =>
  useLotteryStore((state) => state.isSeeding);

/** Selects the lottery metadata (dates, counts, etc.). */
export const useLotteryMetadata = () =>
  useLotteryStore(useShallow((state) => state.metadata));

/** Selects the full list of draws. */
export const useDraws = () =>
  useLotteryStore(useShallow((state) => state.draws));

// ─── Action Selectors ────────────────────────────────────────────────────────

/**
 * Selector for store actions.
 * Separates data from behavior.
 */
export const useLotteryActions = () =>
  useLotteryStore(
    useShallow((state) => ({
      initialize: state.initialize,
      refresh: state.refresh,
      search: state.search,
      incrementSimulation: state.incrementSimulation,
    }))
  );

// ─── Mathematical & Statistical Selectors ────────────────────────────────────

/**
 * Selector for lottery-related mathematical calculations.
 * Centralizes probability, expected return, and combinatorial data.
 */
export function useLotteryMath() {
  return useMemo(() => {
    const expectedReturn = RevenueService.calculateExpectedReturn(TICKET_PRICE);
    const chancePerNumber = (BALLS_PER_DRAW / MAX_LOTTERY_NUMBER) * 100;
    const combosTable = getCombosTable();
    const thresholdDraws = Math.round(TOTAL_COMBINATIONS / 2);
    const thresholdCost = thresholdDraws * TICKET_PRICE;

    return {
      expectedReturn,
      chancePerNumber,
      combosTable,
      ticketPrice: TICKET_PRICE,
      thresholdDraws,
      thresholdCost,
    };
  }, []);
}

/**
 * Selector hook for aggregated revenue statistics.
 * Decouples calculation logic from the UI (HeroSection).
 */
export function useAggregatedRevenue() {
  const draws = useLotteryStore((state) => state.draws);
  const metadata = useLotteryStore((state) => state.metadata);

  return useMemo(() => {
    if (draws.length === 0) {
      return {
        totalRevenue: 0,
        totalBillions: 0,
        fractionBillions: 0,
        yearsOfOperation: 0,
        drawCount: 0
      };
    }

    let totalRevenue = 0;
    let totalJackpotWinners = 0;
    let totalPrizeDistributed = 0;

    for (const draw of draws) {
      totalRevenue += draw.totalRevenue || 0;
      totalJackpotWinners += draw.jackpotWinners || 0;
      totalPrizeDistributed += (draw.jackpotWinners * draw.jackpotPrize) +
        (draw.quinaWinners * draw.quinaPrize) +
        (draw.quadraWinners * draw.quadraPrize);
    }

    const totalBillions = Math.floor(totalRevenue / 1_000_000_000);
    const fractionBillions = Math.floor((totalRevenue % 1_000_000_000) / 100_000_000);

    const yearsOfOperation = metadata ?
      new Date(metadata.lastDrawDate).getFullYear() - new Date(metadata.firstDrawDate).getFullYear() :
      new Date().getFullYear() - 1996;

    return {
      totalRevenue,
      totalBillions,
      fractionBillions,
      yearsOfOperation,
      drawCount: draws.length,
      totalJackpotWinners,
      totalPrizeDistributed
    };
  }, [draws, metadata]);
}

/**
 * Selector hook for finding the most notable draw (highest revenue).
 * Decouples sorting and finding logic from the UI (CaseStudy).
 */
export function useNotableDraw(): Draw | null {
  const draws = useLotteryStore((state) => state.draws);

  return useMemo(() => {
    if (draws.length === 0) return null;

    // Create a shallow copy before sorting to avoid mutating the store's array
    return [...draws].sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))[0] || null;
  }, [draws]);
}

// ─── Granular Statistics Selectors ───────────────────────────────────────────

/**
 * Granular selectors for Lottery Statistics.
 * Uses useShallow for architectural longevity and performance.
 * This ensures components only re-render if the specific data slice changes.
 */

export const useFrequencies = () =>
  useLotteryStore(useShallow((state) => state.stats?.frequencies));

export const usePrizeEvolution = () =>
  useLotteryStore(useShallow((state) => state.stats?.prizeEvolution));

export const useTopJackpotWinners = () =>
  useLotteryStore(useShallow((state) => state.stats?.topJackpotWinners));

export const useGeoWinners = () =>
  useLotteryStore(useShallow((state) => state.stats?.geoWinners));

export const useParityDistribution = () =>
  useLotteryStore(useShallow((state) => state.stats?.parityDistribution));

export const useSumDistribution = () =>
  useLotteryStore(useShallow((state) => state.stats?.sumDistribution));

export const useTopPairs = () =>
  useLotteryStore(useShallow((state) => state.stats?.topPairs));

export const useAccumulationTrend = () =>
  useLotteryStore(useShallow((state) => state.stats?.accumulationTrend));

export const usePrizeTierComparison = () =>
  useLotteryStore(useShallow((state) => state.stats?.prizeTierComparison));

export const useTemporalFrequency = () =>
  useLotteryStore(useShallow((state) => state.stats?.temporalFrequency));

export const useGapAnalysis = () =>
  useLotteryStore(useShallow((state) => state.stats?.gapAnalysis));

export const useHotNumbers = () =>
  useLotteryStore(useShallow((state) => state.stats?.hotNumbers));

export const useNumberProfile = () =>
  useLotteryStore(useShallow((state) => state.stats?.numberProfile));

export const useStreakEconomics = () =>
  useLotteryStore(useShallow((state) => state.stats?.streakEconomics));

export const useTypeComparison = () =>
  useLotteryStore(useShallow((state) => state.stats?.typeComparison));

export const useLotteryMeta = () =>
  useLotteryStore(useShallow((state) => state.stats?.meta));

/**
 * Page-level selector for the full stats slice.
 * Use only at the page/layout level where broad stats access is required.
 * Prefer granular selectors (e.g. useLotteryMeta) in leaf components.
 */
export const useLotteryFullStats = () =>
  useLotteryStore(useShallow((state) => state.stats));
