import {
  calculateAccumulationTrend,
  calculatePrizeEvolution,
} from '@/workers/analytics/functions/timeline.calc';
import { describe, expect, it } from 'vitest';
import { makeGame } from '../../fixtures/games';

describe('timeline analytics calculations', () => {
  it('aggregates yearly prize evolution with distributed totals and winners', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2023-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotWinners: 0,
        jackpotPrize: 0,
        totalRevenue: 0,
      }),
      makeGame({
        id: 2,
        date: '2023-01-08',
        numbers: [7, 8, 9, 10, 11, 12],
        jackpotWinners: 1,
        jackpotPrize: 1_000_000,
        quinaWinners: 0,
        quinaPrize: 0,
        quadraWinners: 0,
        quadraPrize: 0,
        totalRevenue: 500_000,
      }),
      makeGame({
        id: 3,
        date: '2024-01-01',
        numbers: [13, 14, 15, 16, 17, 18],
        jackpotWinners: 2,
        jackpotPrize: 2_000_000,
        quinaWinners: 10,
        quinaPrize: 1_000,
        quadraWinners: 100,
        quadraPrize: 100,
        totalRevenue: 1_000_000,
      }),
    ];

    const evolution = calculatePrizeEvolution(games);

    expect(evolution).toEqual([
      {
        year: 2023,
        maxPrize: 1_000_000,
        totalDistributed: 1_000_000,
        totalRevenue: 500_000,
        totalGames: 1,
        totalWinners: 1,
        megaDaVirada: false,
      },
      {
        year: 2024,
        maxPrize: 2_000_000,
        totalDistributed: 4_020_000,
        totalRevenue: 1_000_000,
        totalGames: 1,
        totalWinners: 2,
        megaDaVirada: false,
      },
    ]);
  });

  it('computes yearly accumulation trend percentages', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2023-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        accumulated: true,
      }),
      makeGame({
        id: 2,
        date: '2023-01-08',
        numbers: [7, 8, 9, 10, 11, 12],
        accumulated: false,
      }),
      makeGame({
        id: 3,
        date: '2024-01-01',
        numbers: [13, 14, 15, 16, 17, 18],
        accumulated: true,
      }),
    ];

    const trend = calculateAccumulationTrend(games);

    expect(trend).toEqual([
      {
        year: 2023,
        accumulated: 1,
        nonAccumulated: 1,
        pctAccumulated: 50,
      },
      {
        year: 2024,
        accumulated: 1,
        nonAccumulated: 0,
        pctAccumulated: 100,
      },
    ]);
  });
});
