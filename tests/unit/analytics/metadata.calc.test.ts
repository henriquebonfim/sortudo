import {
  calculateMeta,
  calculateTopJackpotWinners,
} from '@/workers/analytics/functions/metadata.calc';
import type { LotteryMetadata } from '@/workers/core/types';
import { describe, expect, it } from 'vitest';
import { makeGame } from '../../fixtures/games';

describe('metadata analytics calculations', () => {
  it('calculates high-level jackpot metadata and preserves source metadata fields', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotWinners: 0,
        jackpotPrize: 1_000_000,
      }),
      makeGame({
        id: 2,
        date: '2024-01-08',
        numbers: [7, 8, 9, 10, 11, 12],
        jackpotWinners: 2,
        jackpotPrize: 5_000_000,
      }),
      makeGame({
        id: 3,
        date: '2024-01-15',
        numbers: [13, 14, 15, 16, 17, 18],
        jackpotWinners: 1,
        jackpotPrize: 3_000_000,
      }),
    ];

    const metadata: LotteryMetadata = {
      totalGames: 3,
      firstGameDate: '2024-01-01',
      lastGameDate: '2024-01-15',
      lastUpdate: '2026-04-15T00:00:00.000Z',
    };

    const result = calculateMeta(games, metadata);

    expect(result).toEqual({
      ...metadata,
      totalJackpotWinners: 3,
      pctWithoutWinner: 33.3,
      avgJackpotPrize: 4_000_000,
      highestPrize: 5_000_000,
    });
  });

  it('returns zero average jackpot prize when there are no winning draws', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotWinners: 0,
        jackpotPrize: 2_000_000,
      }),
      makeGame({
        id: 2,
        date: '2024-01-08',
        numbers: [7, 8, 9, 10, 11, 12],
        jackpotWinners: 0,
        jackpotPrize: 500_000,
      }),
    ];

    const metadata: LotteryMetadata = {
      totalGames: 2,
      firstGameDate: '2024-01-01',
      lastGameDate: '2024-01-08',
      lastUpdate: '2026-04-15T00:00:00.000Z',
    };

    const result = calculateMeta(games, metadata);

    expect(result.avgJackpotPrize).toBe(0);
    expect(result.highestPrize).toBe(2_000_000);
    expect(result.pctWithoutWinner).toBe(100);
  });

  it('returns top 10 jackpot winner draws sorted by winners with global winner share', () => {
    const games = Array.from({ length: 11 }, (_, idx) => {
      const winners = idx + 1;
      return makeGame({
        id: winners,
        date: `2024-01-${String((idx % 28) + 1).padStart(2, '0')}`,
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotWinners: winners,
        jackpotPrize: winners * 1000,
      });
    });

    const top = calculateTopJackpotWinners(games);

    expect(top).toHaveLength(10);
    expect(top[0]).toMatchObject({
      drawId: 11,
      winners: 11,
      prize: 11_000,
      pctOfTotalWinners: 16.7,
    });
    expect(top[top.length - 1]).toMatchObject({ drawId: 2, winners: 2 });
  });

  it('returns an empty list when no draw has jackpot winners', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotWinners: 0,
        jackpotPrize: 1_000_000,
      }),
    ];

    expect(calculateTopJackpotWinners(games)).toEqual([]);
  });
});
