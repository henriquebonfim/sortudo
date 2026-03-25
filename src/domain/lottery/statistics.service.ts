import { Draw } from '@/domain/lottery/draw.model';
import { LotteryStats } from '@/domain/lottery/lottery.types';
import { FrequencyAnalyzer } from '@/domain/lottery/calculators/frequency-analyzer';
import { PrizeAnalyzer } from '@/domain/lottery/calculators/prize-analyzer';
import { GeographyAnalyzer } from '@/domain/lottery/calculators/geography-analyzer';
import { DrawAnalyzer } from '@/domain/lottery/calculators/draw-analyzer';

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
    };
  }
}
