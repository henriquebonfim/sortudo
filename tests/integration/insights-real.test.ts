import { describe, it, expect } from 'vitest';
import { StatisticsService } from '@/domain/lottery/services';
import { REAL_DRAWS } from '../fixtures/real-data';

describe('Insights Generator (Real Data Validation)', () => {
  it('should generate valid insights for the full historical dataset', () => {
    const stats = StatisticsService.calculateAllStats(REAL_DRAWS);

    expect(stats).toBeDefined();
    
    // Numbers & Math checks
    expect(stats.frequencies.ranking).toHaveLength(60);
    // Law of large numbers: low/high should be close to 50/50
    expect(stats.numberProfile.lowHighSplit.low).toBeGreaterThan(45);
    expect(stats.numberProfile.lowHighSplit.low).toBeLessThan(55);
    expect(stats.numberProfile.primesPercentage).toBeGreaterThan(20);

    // Geography checks
    expect(stats.geoWinners.length).toBeGreaterThan(0);
    
    // Financial checks
    expect(stats.meta.highestPrize).toBeGreaterThan(0);
    
    // Temporal checks
    expect(stats.accumulationTrend.length).toBeGreaterThan(20);
  });
});
