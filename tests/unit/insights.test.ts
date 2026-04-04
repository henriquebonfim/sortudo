import { describe, it, expect } from 'vitest';
import { StatisticsService } from '@/domain/lottery/statistics.service';
import { Draw } from '@/domain/lottery/lottery.types';

describe('StatisticsService (Unit Tests for Insights)', () => {
  const mockData: Draw[] = [
    {
      id: 1,
      date: '2024-01-01',
      numbers: [1, 2, 3, 4, 10, 20],
      jackpotWinners: 0,
      jackpotPrize: 0,
      quinaWinners: 0,
      quinaPrize: 0,
      quadraWinners: 0,
      quadraPrize: 0,
      accumulated: true,
      totalRevenue: 1000,
      prizeEstimate: 0,
      accumulatedJackpot: 500
    },
    {
      id: 2,
      date: '2024-01-08',
      numbers: [1, 5, 6, 7, 30, 40],
      jackpotWinners: 1,
      jackpotPrize: 5000,
      quinaWinners: 0,
      quinaPrize: 0,
      quadraWinners: 0,
      quadraPrize: 0,
      accumulated: false,
      totalRevenue: 2000,
      prizeEstimate: 0,
      locations: ['CAMPINAS/SP'],
    },
    {
      id: 3,
      date: '2024-01-15',
      numbers: [11, 12, 13, 14, 15, 60],
      jackpotWinners: 2,
      jackpotPrize: 3000,
      quinaWinners: 0,
      quinaPrize: 0,
      quadraWinners: 0,
      quadraPrize: 0,
      accumulated: false,
      totalRevenue: 8000,
      prizeEstimate: 0,
      locations: ['SAO PAULO/SP', 'RIO DE JANEIRO/RJ'],
    }
  ];

  it('should calculate draw overlaps correctly', () => {
    const stats = StatisticsService.calculateAllStats(mockData);
    const overlaps = stats.numberProfile.drawOverlaps;
    expect(overlaps.one).toBe(50);
    expect(overlaps.zero).toBe(50);
  });

  it('should process geographical winners across states', () => {
    const stats = StatisticsService.calculateAllStats(mockData);
    expect(stats.geoWinners).toHaveLength(2); // SP, RJ
    expect(stats.geoWinners.find((g: { state: string }) => g.state === 'SP')).toBeDefined();
  });

  it('should calculate low/high number split correctly', () => {
    const stats = StatisticsService.calculateAllStats(mockData);
    expect(stats.numberProfile.lowHighSplit.low).toBe(88.89);
  });

  it('should calculate prize tiers trends', () => {
    const stats = StatisticsService.calculateAllStats(mockData);
    expect(stats.prizeTierComparison).toHaveLength(3);
    expect(stats.prizeTierComparison[0].avgPrize).toBe(4000);
  });

  it('should identify accumulated draw trends', () => {
    const stats = StatisticsService.calculateAllStats(mockData);
    const accumulation = stats.accumulationTrend.find((t: { year: number }) => t.year === 2024);
    expect(accumulation?.accumulated).toBe(1);
    expect(accumulation?.nonAccumulated).toBe(2);
  });

  it('calculateFrequencies should return 60 entries', () => {
    const res = StatisticsService.calculateFrequencies(mockData);
    expect(Object.keys(res.frequencies)).toHaveLength(60);
    expect(res.ranking).toHaveLength(60);
  });

  it('calculateTopJackpotWinners should sort correctly', () => {
    const res = StatisticsService.calculateTopJackpotWinners(mockData);
    expect(res[0].winners).toBe(2);
    expect(res[1].winners).toBe(1);
  });

  it('calculateParityDistribution should identify 4P/2I vs 3P/3I', () => {
    const res = StatisticsService.calculateParityDistribution(mockData);
    expect(res.find((p: { label: string }) => p.label === '2I/4P')).toBeDefined(); // Draw 1 and 2
    expect(res.find((p: { label: string }) => p.label === '3I/3P')).toBeDefined(); // Draw 3
  });

  it('calculateSumDistribution should return valid buckets', () => {
    const res = StatisticsService.calculateSumDistribution(mockData);
    expect(res.length).toBeGreaterThan(0);
  });

  it('calculateTopPairs should return pairs with counts', () => {
    const res = StatisticsService.calculateTopPairs(mockData, 5);
    expect(res.length).toBeLessThanOrEqual(5);
  });

  it('calculateTemporalFrequency should support decade grouping', () => {
    const res = StatisticsService.calculateTemporalFrequency(mockData);
    expect(res[0].decade).toBe('Década de 20');
  });

  it('calculateGapAnalysis should return gaps for all numbers', () => {
    const res = StatisticsService.calculateGapAnalysis(mockData);
    expect(res).toHaveLength(20);
  });

  it('calculateHotNumbers should respect window size', () => {
    const res = StatisticsService.calculateHotNumbers(mockData, 2);
    expect(res.every((r: { count: number }) => r.count <= 2)).toBe(true);
  });

  it('calculateStreakEconomics should track prizes', () => {
    const res = StatisticsService.calculateStreakEconomics(mockData);
    expect(res.length).toBeGreaterThan(0);
  });

  it('calculateMeta should handle basic stats', () => {
    const res = StatisticsService.calculateMeta(mockData, {
      totalDraws: 3,
      firstDrawDate: '2024-01-01',
      lastDrawDate: '2024-01-15'
    });
    expect(res.totalDraws).toBe(3);
    expect(res.highestPrize).toBe(5000);
  });
});
