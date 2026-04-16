import { calculateAllStats } from '@/workers/analytics/engine';
import { describe, expect, it } from 'vitest';
import { makeAnalyticsSampleGames } from '../../fixtures/games';

describe('analytics engine', () => {
  it('builds a complete stats payload from games', () => {
    const games = makeAnalyticsSampleGames();

    const stats = calculateAllStats(games);

    expect(stats.meta).toMatchObject({
      totalGames: 3,
      firstGameDate: '2022-01-01',
      lastGameDate: '2023-01-01',
    });
    expect(stats.frequencies.ranking.length).toBeGreaterThan(0);
    expect(stats.topPairs.length).toBeGreaterThan(0);
    expect(stats.parityDistribution.length).toBeGreaterThan(0);
    expect(stats.temporalFrequency.length).toBeGreaterThan(0);
    expect(stats.hotNumbers.length).toBeGreaterThan(0);
    expect(stats.streakEconomics.length).toBeGreaterThan(0);
    expect(stats.typeComparison).toBeDefined();
  });

  it('throws when no games are available', () => {
    expect(() => calculateAllStats([])).toThrow('No games available');
  });
});
