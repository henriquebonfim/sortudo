import { calculateNumberProfile } from '@/workers/analytics/functions/informational.calc';
import { describe, expect, it } from 'vitest';
import { makeGame } from '../../fixtures/games';

describe('informational analytics calculations', () => {
  it('computes number profile, decade spread, and overlap history', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 11, 21, 31, 41, 51],
      }),
      makeGame({
        id: 2,
        date: '2024-01-08',
        numbers: [1, 2, 3, 31, 41, 51],
      }),
      makeGame({
        id: 3,
        date: '2024-01-15',
        numbers: [4, 14, 24, 34, 44, 54],
      }),
      makeGame({
        id: 4,
        date: '2024-01-22',
        numbers: [1, 2, 3, 4, 5],
      }),
    ];

    const profile = calculateNumberProfile(games);

    expect(profile.lowHighSplit).toEqual({ low: 50, high: 50 });
    expect(profile.primesPercentage).toBe(38.89);
    expect(profile.multiplesOf5Percentage).toBe(0);
    expect(profile.multiplesOf10Percentage).toBe(0);

    expect(profile.decadeAnalysis).toEqual({ fullySpreadPct: 66.7, clusteredPct: 33.3 });

    expect(profile.gameOverlaps.zero).toBe(50);
    expect(profile.gameOverlaps.one).toBe(0);
    expect(profile.gameOverlaps.two).toBe(0);
    expect(profile.gameOverlaps.threePlus).toBe(50);
    expect(profile.gameOverlaps.totalWithOverlap).toBe(1);

    expect(profile.overlapHistory).toEqual([
      {
        drawId: 2,
        prevDrawId: 1,
        date: '2024-01-08',
        numbers: [1, 31, 41, 51],
        count: 4,
      },
    ]);
  });

  it('returns safe zeroed percentages when no valid 6-number draws exist', () => {
    const games = [
      makeGame({ id: 1, date: '2024-01-01', numbers: [1, 2, 3, 4, 5] }),
      makeGame({ id: 2, date: '2024-01-08', numbers: [6, 7, 8, 9, 10] }),
    ];

    const profile = calculateNumberProfile(games);

    expect(profile.lowHighSplit).toEqual({ low: 0, high: 0 });
    expect(profile.primesPercentage).toBe(0);
    expect(profile.multiplesOf5Percentage).toBe(0);
    expect(profile.multiplesOf10Percentage).toBe(0);
    expect(profile.decadeAnalysis).toEqual({ fullySpreadPct: 0, clusteredPct: 0 });
    expect(profile.gameOverlaps).toEqual({
      zero: 0,
      one: 0,
      two: 0,
      threePlus: 0,
      totalWithOverlap: 0,
    });
    expect(profile.overlapHistory).toEqual([]);
  });
});
