import { describe, it, expect } from 'vitest';
import { StatisticsService } from '@/domain/lottery/statistics.service';
import { REAL_DRAWS } from '../fixtures/real-data';

describe('StatisticsService (Unit Tests with Real Data)', () => {
  const ALL = REAL_DRAWS;

  it('calculateFrequencies should return 60 entries and valid ranking', () => {
    const res = StatisticsService.calculateFrequencies(ALL);
    expect(Object.keys(res.frequencies)).toHaveLength(60);
    expect(res.ranking).toHaveLength(60);
    expect(res.ranking[0].frequency).toBeGreaterThanOrEqual(res.ranking[59].frequency);
    expect(res.max.number).toBe(res.ranking[0].number);
  });

  it('calculateTopJackpotWinners should return top 10 sorted by winner count', () => {
    const res = StatisticsService.calculateTopJackpotWinners(ALL);
    expect(res.length).toBeLessThanOrEqual(10);
    for (let i = 0; i < res.length - 1; i++) {
      expect(res[i].winners).toBeGreaterThanOrEqual(res[i+1].winners);
    }
  });

  it('calculateGeoWinners should return valid state percentages', () => {
    const res = StatisticsService.calculateGeoWinners(ALL);
    expect(res.length).toBeGreaterThan(0);
    const sp = res.find(r => r.state === 'SP');
    expect(sp).toBeDefined();
    expect(sp?.total).toBeGreaterThan(0);
    
    const sumPct = res.reduce((s, r) => s + r.percentage, 0);
    expect(sumPct).toBeCloseTo(100, 0); // Rounding might cause slight deviation
  });

  it('calculateParityDistribution should correctly identify parity patterns', () => {
    const res = StatisticsService.calculateParityDistribution(ALL);
    expect(res.length).toBeLessThanOrEqual(7);
    const totalCount = res.reduce((s, r) => s + r.count, 0);
    expect(totalCount).toBe(ALL.length);
    
    // Sort by count to check the most common
    const sorted = [...res].sort((a, b) => b.count - a.count);
    expect(sorted[0].label).toMatch(/3[IÍ]\/3P/);
  });

  it('calculatePrizeEvolution should return year-grouped data', () => {
    const res = StatisticsService.calculatePrizeEvolution(ALL);
    expect(res.length).toBeGreaterThan(25); // Since 1996
    expect(res[0].year).toBe(1996);
    expect(res[res.length-1].year).toBeGreaterThanOrEqual(2024);
  });

  it('calculateSumDistribution should return binned data', () => {
    const res = StatisticsService.calculateSumDistribution(ALL);
    expect(res.length).toBeGreaterThan(0);
    // Sum range for Mega-Sena: 1+2+3+4+5+6=21 to 55+56+57+58+59+60=345
    expect(res[0].min).toBeGreaterThanOrEqual(20);
    expect(res[res.length-1].min).toBeLessThanOrEqual(350);
  });

  it('calculateTopPairs should return at most N pairs', () => {
    const res = StatisticsService.calculateTopPairs(ALL, 20);
    expect(res).toHaveLength(20);
    expect(res[0].count).toBeGreaterThanOrEqual(res[19].count);
  });

  it('calculateAccumulationTrend should show year trends', () => {
    const res = StatisticsService.calculateAccumulationTrend(ALL);
    expect(res.length).toBeGreaterThan(25);
    expect(res.every(r => r.pctAccumulated >= 0 && r.pctAccumulated <= 100)).toBe(true);
  });

  it('calculatePrizeTierComparison should show all 3 tiers', () => {
    const res = StatisticsService.calculatePrizeTierComparison(ALL);
    expect(res).toHaveLength(3);
    const [sena, quina, quadra] = res;
    expect(sena.avgPrize).toBeGreaterThan(quina.avgPrize);
    expect(quina.avgPrize).toBeGreaterThan(quadra.avgPrize);
    expect(quadra.totalWinners).toBeGreaterThan(quina.totalWinners);
  });

  it('calculateTemporalFrequency should return decade data', () => {
    const res = StatisticsService.calculateTemporalFrequency(ALL);
    expect(res.length).toBeGreaterThanOrEqual(3); // 90s, 00s, 10s, 20s
    expect(res[0].decade).toMatch(/^\d{4}s$/);
    expect(res[0].data).toHaveLength(10);
  });

  it('calculateGapAnalysis should return overdue numbers', () => {
    const res = StatisticsService.calculateGapAnalysis(ALL);
    expect(res).toHaveLength(20);
    expect(res[0].currentGap).toBeGreaterThanOrEqual(res[19].currentGap);
    expect(res.every(r => r.maxGap >= r.currentGap)).toBe(true);
  });

  it('calculateHotNumbers should return top 10 from window', () => {
    const res = StatisticsService.calculateHotNumbers(ALL, 10);
    expect(res).toHaveLength(10);
    expect(res.every(r => r.count <= 10)).toBe(true);
  });

  it('calculateNumberProfile should return comprehensive metrics', () => {
    const res = StatisticsService.calculateNumberProfile(ALL);
    expect(res.lowHighSplit.low + res.lowHighSplit.high).toBeCloseTo(100, 1);
    expect(res.primesPercentage).toBeGreaterThan(20);
    expect(res.primesPercentage).toBeLessThan(40);
    expect(Object.values(res.drawOverlaps).reduce((a, b) => a + b, 0)).toBeCloseTo(100, 1);
  });

  it('calculateStreakEconomics should show growth by streak length', () => {
    const res = StatisticsService.calculateStreakEconomics(ALL);
    expect(res.length).toBeGreaterThan(1);
    expect(res[0].streakLength).toBe(0);
    for (let i = 0; i < res.length - 1; i++) {
        expect(res[i].streakLength).toBeLessThan(res[i+1].streakLength);
    }
  });

  it('calculateMeta should return historical aggregates', () => {
    const res = StatisticsService.calculateMeta(ALL, {
        totalDraws: ALL.length,
        firstDrawDate: ALL[0].date,
        lastDrawDate: ALL[ALL.length-1].date
    });
    expect(res.totalDraws).toBe(ALL.length);
    expect(res.highestPrize).toBeGreaterThan(0);
    expect(res.avgJackpotPrize).toBeGreaterThan(0);
  });
});
