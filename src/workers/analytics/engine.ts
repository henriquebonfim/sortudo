import { calculatePrizeTierComparison, calculateStreakEconomics, calculateTypeComparison } from '@/workers/analytics/functions/economics.calc';
import { calculateGeoWinners } from '@/workers/analytics/functions/geo.calc';
import { calculateNumberProfile } from '@/workers/analytics/functions/informational.calc';
import { calculateMeta, calculateTopJackpotWinners } from '@/workers/analytics/functions/metadata.calc';
import { calculateFrequencies, calculateGapAnalysis, calculateHotNumbers, calculateParityDistribution, calculateSumDistribution, calculateTemporalFrequency, calculateTopPairs } from '@/workers/analytics/functions/statistical.calc';
import { calculateAccumulationTrend, calculatePrizeEvolution } from '@/workers/analytics/functions/timeline.calc';
import type { Game, LotteryMetadata, LotteryStats } from '@/workers/core/types';

/**
 * Orchestrates All Analytic Calculations.
 *
 * This function serves as the central entry point for the analytics engine,
 * delegating specific domain calculations to their respective modules in /functions.
 */
export function calculateAllStats(games: Game[]): LotteryStats {
  if (games.length === 0) throw new Error('No games available');

  const rawMetadata: LotteryMetadata = {
    totalGames: games.length,
    firstGameDate: games[0].date,
    lastGameDate: games[games.length - 1].date,
    lastUpdate: new Date().toISOString(),
  };

  return {
    meta: calculateMeta(games, rawMetadata),
    frequencies: calculateFrequencies(games),
    topJackpotWinners: calculateTopJackpotWinners(games),
    geoWinners: calculateGeoWinners(games),
    parityDistribution: calculateParityDistribution(games),
    prizeEvolution: calculatePrizeEvolution(games),
    sumDistribution: calculateSumDistribution(games),
    topPairs: calculateTopPairs(games, 20),
    accumulationTrend: calculateAccumulationTrend(games),
    prizeTierComparison: calculatePrizeTierComparison(games),
    temporalFrequency: calculateTemporalFrequency(games),
    gapAnalysis: calculateGapAnalysis(games),
    hotNumbers: calculateHotNumbers(games),
    numberProfile: calculateNumberProfile(games),
    streakEconomics: calculateStreakEconomics(games),
    typeComparison: calculateTypeComparison(games),
  };
}
