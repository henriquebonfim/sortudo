import { Draw, LotteryStats } from './draw';
import { REVENUE_ALLOCATION } from './lottery.constants';
import { 
  FrequencyAnalyzer, 
  PrizeAnalyzer, 
  GeographyAnalyzer, 
  DrawAnalyzer 
} from './calculators';

// ─── Revenue Service ─────────────────────────────────────────────────────────

export class RevenueService {
  /**
   * Calculates metrics for expected return based on bet amount.
   */
  static calculateExpectedReturn(betAmount: number) {
    const prizeReturn = REVENUE_ALLOCATION.PRIZE_POOL;
    const expectedValue = betAmount * prizeReturn;
    const loss = betAmount - expectedValue;
    const percentageLoss = (loss / betAmount) * 100;

    return {
      betAmount,
      expectedValue,
      loss,
      percentageLoss: Math.round(percentageLoss),
      returnPercentage: Math.round(prizeReturn * 100),
    };
  }
}

// ─── Statistics Service ──────────────────────────────────────────────────────

export class StatisticsService {
  static calculateFrequencies = FrequencyAnalyzer.calculateFrequencies;
  static calculateTopJackpotWinners = PrizeAnalyzer.calculateTopJackpotWinners;
  static calculateGeoWinners = GeographyAnalyzer.calculateGeoWinners;
  static calculateParityDistribution = DrawAnalyzer.calculateParityDistribution;
  static calculatePrizeEvolution = PrizeAnalyzer.calculatePrizeEvolution;
  static calculateSumDistribution = DrawAnalyzer.calculateSumDistribution;
  static calculateTopPairs = FrequencyAnalyzer.calculateTopPairs;
  static calculateAccumulationTrend = PrizeAnalyzer.calculateAccumulationTrend;
  static calculatePrizeTierComparison = PrizeAnalyzer.calculatePrizeTierComparison;
  static calculateTemporalFrequency = FrequencyAnalyzer.calculateTemporalFrequency;
  static calculateGapAnalysis = FrequencyAnalyzer.calculateGapAnalysis;
  static calculateHotNumbers = FrequencyAnalyzer.calculateHotNumbers;
  static calculateNumberProfile = DrawAnalyzer.calculateNumberProfile;
  static calculateStreakEconomics = PrizeAnalyzer.calculateStreakEconomics;
  static calculateMeta = PrizeAnalyzer.calculateMeta;
  static calculateTypeComparison = PrizeAnalyzer.calculateTypeComparison;

  /**
   * Orchestrates the calculation of all lottery statistics.
   */
  static calculateAllStats(draws: Draw[]): LotteryStats {
    if (draws.length === 0) throw new Error('No draws available to calculate statistics.');
    
    const metadata = { 
      totalDraws: draws.length, 
      firstDrawDate: draws[0].date, 
      lastDrawDate: draws[draws.length - 1].date 
    };

    return {
      meta: StatisticsService.calculateMeta(draws, metadata),
      frequencies: StatisticsService.calculateFrequencies(draws),
      topJackpotWinners: StatisticsService.calculateTopJackpotWinners(draws),
      geoWinners: StatisticsService.calculateGeoWinners(draws),
      parityDistribution: StatisticsService.calculateParityDistribution(draws),
      prizeEvolution: StatisticsService.calculatePrizeEvolution(draws),
      sumDistribution: StatisticsService.calculateSumDistribution(draws),
      topPairs: StatisticsService.calculateTopPairs(draws, 20),
      accumulationTrend: StatisticsService.calculateAccumulationTrend(draws),
      prizeTierComparison: StatisticsService.calculatePrizeTierComparison(draws),
      temporalFrequency: StatisticsService.calculateTemporalFrequency(draws, 10),
      gapAnalysis: StatisticsService.calculateGapAnalysis(draws),
      hotNumbers: StatisticsService.calculateHotNumbers(draws),
      numberProfile: StatisticsService.calculateNumberProfile(draws),
      streakEconomics: StatisticsService.calculateStreakEconomics(draws),
      typeComparison: StatisticsService.calculateTypeComparison(draws),
    };
  }
}

// ─── Search Engine ───────────────────────────────────────────────────────────

import type { SearchResult } from './draw';

export { searchCombination } from './search-engine';
