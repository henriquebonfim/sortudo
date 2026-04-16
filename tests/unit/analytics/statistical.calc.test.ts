import {
  calculateFrequencies,
  calculateGapAnalysis,
  calculateHotNumbers,
  calculateParityDistribution,
  calculateSumDistribution,
  calculateTemporalFrequency,
  calculateTopPairs,
} from '@/workers/analytics/functions/statistical.calc';
import { describe, expect, it } from 'vitest';
import { makeAnalyticsSampleGames } from '../../fixtures/games';

// 70% layer: deterministic core logic with high confidence/value ratio.
describe('statistical analytics calculations', () => {
  const games = makeAnalyticsSampleGames();

  it('computes parity distribution buckets with percentage', () => {
    const distribution = calculateParityDistribution(games);

    expect(distribution).toHaveLength(1);
    expect(distribution[0]).toMatchObject({
      label: '3O/3E',
      odds: 3,
      evens: 3,
      count: 3,
      percentage: 100,
    });
  });

  it('groups sum distribution into expected buckets', () => {
    const buckets = calculateSumDistribution(games);

    expect(buckets).toEqual([
      { bucket: '20–29', min: 20, max: 29, count: 1 },
      { bucket: '30–39', min: 30, max: 39, count: 1 },
      { bucket: '80–89', min: 80, max: 89, count: 1 },
    ]);
  });

  it('ranks frequencies by count then number tie-break', () => {
    const result = calculateFrequencies(games);

    expect(result.max).toEqual({ number: 1, frequency: 2 });
    expect(result.ranking[0]).toMatchObject({ number: 1, frequency: 2, position: 1 });
    expect(result.ranking[1]).toMatchObject({ number: 2, frequency: 2, position: 2 });
  });

  it('computes top pairs ordered by frequency', () => {
    const topPairs = calculateTopPairs(games, 5);

    expect(topPairs[0]).toEqual({ numbers: [1, 2], count: 2 });
    expect(topPairs).toHaveLength(5);
  });

  it('tracks current and max gaps per number', () => {
    const gapAnalysis = calculateGapAnalysis(games);

    const numberOne = gapAnalysis.find((item) => item.number === 1);
    const numberSixty = gapAnalysis.find((item) => item.number === 60);

    expect(numberOne).toEqual({ number: 1, currentGap: 1, maxGap: 0 });
    expect(numberSixty).toEqual({ number: 60, currentGap: 3, maxGap: 0 });
  });

  it('computes hot numbers from last draws', () => {
    const hot = calculateHotNumbers(games);

    expect(hot[0]).toEqual({ number: 1, frequency: 2 });
    expect(hot[1]).toEqual({ number: 2, frequency: 2 });
  });

  it('builds temporal frequency with latest year separated from decade groups', () => {
    const temporal = calculateTemporalFrequency(games);

    expect(temporal.map((entry) => entry.decade)).toEqual(['2020', '2023']);

    const byDecade = temporal.find((entry) => entry.decade === '2020');
    const byYear = temporal.find((entry) => entry.decade === '2023');

    const n1In2020 = byDecade?.data.find((point) => point.number === 1);
    const n11In2023 = byYear?.data.find((point) => point.number === 11);

    expect(n1In2020?.frequency).toBe(100);
    expect(n11In2023?.frequency).toBe(100);
  });
});
