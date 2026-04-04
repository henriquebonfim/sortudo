import { StatisticsService } from '@/domain/lottery/services';
import { describe, expect, it } from 'vitest';
import { REAL_DRAWS } from '../fixtures/real-data';

describe('StatisticsService (Integration Tests with Real Data)', () => {
  const ALL = REAL_DRAWS;

  it('calculateFrequencies should handle historical data consistency', () => {
    const res = StatisticsService.calculateFrequencies(ALL);
    expect(res.ranking).toHaveLength(60);
    expect(res.ranking[0].frequency).toBeGreaterThanOrEqual(res.ranking[59].frequency);
  });

  it('calculatePrizeEvolution should cover full history (1996+)', () => {
    const res = StatisticsService.calculatePrizeEvolution(ALL);
    expect(res[0].year).toBe(1996);
    expect(res[res.length - 1].year).toBeGreaterThanOrEqual(2024);
  });

  it('calculatePrizeTierComparison should show realistic prize spreads', () => {
    const res = StatisticsService.calculatePrizeTierComparison(ALL);
    const [sena, quina, quadra] = res;
    expect(sena.avgPrize).toBeGreaterThan(quina.avgPrize);
    expect(quadra.totalWinners).toBeGreaterThan(quina.totalWinners);
  });

  it('calculateTemporalFrequency should match formatted decades', () => {
    const res = StatisticsService.calculateTemporalFrequency(ALL);
    expect(res[0].decade).toMatch(/^Década de \d{2}$/);
    expect(res[0].data).toHaveLength(10);
  });

  it('calculateTypeComparison should identify Regular vs Special (Virada)', () => {
    const res = StatisticsService.calculateTypeComparison(ALL);
    expect(res.special.count).toBeGreaterThan(0);
    expect(res.special.avgPrize).toBeGreaterThan(res.regular.avgPrize);
  });

  it('calculateMeta should return correct historical aggregates', () => {
    const res = StatisticsService.calculateMeta(ALL, {
      totalDraws: ALL.length,
      firstDrawDate: ALL[0].date,
      lastDrawDate: ALL[ALL.length - 1].date
    });
    expect(res.totalDraws).toBe(ALL.length);
    expect(res.highestPrize).toBeGreaterThan(100_000_000);
  });
});
