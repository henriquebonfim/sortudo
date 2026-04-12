import { Game, LotteryMetadata, LotteryStats } from '@/lib/lottery/types';
import * as economics from '@/features/analytics/functions/economics.calc';
import * as geo from '@/features/analytics/functions/geo.calc';
import * as informational from '@/features/analytics/functions/informational.calc';
import * as metadata from '@/features/analytics/functions/metadata.calc';
import * as statistical from '@/features/analytics/functions/statistical.calc';
import * as timeline from '@/features/analytics/functions/timeline.calc';

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
    meta: metadata.calculateMeta(games, rawMetadata),
    frequencies: statistical.calculateFrequencies(games),
    topJackpotWinners: metadata.calculateTopJackpotWinners(games),
    geoWinners: geo.calculateGeoWinners(games),
    parityDistribution: statistical.calculateParityDistribution(games),
    prizeEvolution: timeline.calculatePrizeEvolution(games),
    sumDistribution: statistical.calculateSumDistribution(games),
    topPairs: statistical.calculateTopPairs(games, 20),
    accumulationTrend: timeline.calculateAccumulationTrend(games),
    prizeTierComparison: economics.calculatePrizeTierComparison(games),
    temporalFrequency: statistical.calculateTemporalFrequency(games),
    gapAnalysis: statistical.calculateGapAnalysis(games),
    hotNumbers: statistical.calculateHotNumbers(games),
    numberProfile: informational.calculateNumberProfile(games),
    streakEconomics: economics.calculateStreakEconomics(games),
    typeComparison: economics.calculateTypeComparison(games),
  };
}
