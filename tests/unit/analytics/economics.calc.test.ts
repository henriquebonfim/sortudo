import {
  calculatePrizeTierComparison,
  calculateStreakEconomics,
  calculateTypeComparison,
} from '@/workers/analytics/functions/economics.calc';
import { describe, expect, it } from 'vitest';
import { makeGame } from '../../fixtures/games';

describe('economics analytics calculations', () => {
  it('computes prize tier aggregates from winners-only pools', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotWinners: 1,
        jackpotPrize: 10_000_000,
        quinaWinners: 10,
        quinaPrize: 50_000,
        quadraWinners: 100,
        quadraPrize: 500,
      }),
      makeGame({
        id: 2,
        date: '2024-01-08',
        numbers: [7, 8, 9, 10, 11, 12],
        jackpotWinners: 0,
        jackpotPrize: 0,
        quinaWinners: 20,
        quinaPrize: 40_000,
        quadraWinners: 0,
        quadraPrize: 0,
      }),
      makeGame({
        id: 3,
        date: '2024-01-15',
        numbers: [13, 14, 15, 16, 17, 18],
        jackpotWinners: 0,
        jackpotPrize: 0,
        quinaWinners: 0,
        quinaPrize: 0,
        quadraWinners: 0,
        quadraPrize: 0,
      }),
    ];

    const tiers = calculatePrizeTierComparison(games);

    expect(tiers).toEqual([
      {
        tier: 'sena',
        label: '6 Hits (Jackpot)',
        avgPrize: 10_000_000,
        maxPrize: 10_000_000,
        totalWinners: 1,
      },
      {
        tier: 'quina',
        label: '5 Hits (Quina)',
        avgPrize: 45_000,
        maxPrize: 50_000,
        totalWinners: 30,
      },
      {
        tier: 'quadra',
        label: '4 Hits (Quadra)',
        avgPrize: 500,
        maxPrize: 500,
        totalWinners: 100,
      },
    ]);
  });

  it('models streak economics and resets streak after winning draws', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        accumulated: true,
        jackpotWinners: 0,
        jackpotPrize: 0,
        totalRevenue: 100,
      }),
      makeGame({
        id: 2,
        date: '2024-01-08',
        numbers: [7, 8, 9, 10, 11, 12],
        accumulated: false,
        jackpotWinners: 0,
        jackpotPrize: 0,
        totalRevenue: 200,
      }),
      makeGame({
        id: 3,
        date: '2024-01-15',
        numbers: [13, 14, 15, 16, 17, 18],
        accumulated: false,
        jackpotWinners: 2,
        jackpotPrize: 1000,
        totalRevenue: 300,
      }),
      makeGame({
        id: 4,
        date: '2024-01-22',
        numbers: [19, 20, 21, 22, 23, 24],
        accumulated: false,
        jackpotWinners: 1,
        jackpotPrize: 500,
        totalRevenue: 400,
      }),
      makeGame({
        id: 5,
        date: '2024-01-29',
        numbers: [25, 26, 27, 28, 29, 30],
        accumulated: true,
        jackpotWinners: 0,
        jackpotPrize: 0,
        totalRevenue: 500,
      }),
    ];

    const result = calculateStreakEconomics(games);

    expect(result).toEqual([
      { streak: 0, count: 3, avgCollection: 333.3, avgPrize: 250 },
      { streak: 1, count: 1, avgCollection: 200, avgPrize: 0 },
      { streak: 2, count: 1, avgCollection: 300, avgPrize: 1000 },
    ]);
  });

  it('splits regular vs special draws by prize and date seasonality', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotPrize: 10_000_000,
      }),
      makeGame({
        id: 2,
        date: '2024-12-31',
        numbers: [7, 8, 9, 10, 11, 12],
        jackpotPrize: 55_000_000,
      }),
      makeGame({
        id: 3,
        date: '2024-12-30',
        numbers: [13, 14, 15, 16, 17, 18],
        jackpotPrize: 45_000_000,
      }),
      makeGame({
        id: 4,
        date: '2024-12-29',
        numbers: [19, 20, 21, 22, 23, 24],
        jackpotPrize: 60_000_000,
      }),
      makeGame({
        id: 5,
        date: '2024-02-02',
        numbers: [25, 26, 27, 28, 29, 30],
        jackpotPrize: 0,
      }),
    ];

    const comparison = calculateTypeComparison(games);

    expect(comparison).toEqual({
      regular: {
        avgPrize: 35_000_000,
        maxPrize: 60_000_000,
        count: 3,
      },
      special: {
        avgPrize: 50_000_000,
        maxPrize: 55_000_000,
        count: 2,
      },
    });
  });

  it('returns zeroed prize stats when no draw has jackpot prize', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotPrize: 0,
      }),
    ];

    const comparison = calculateTypeComparison(games);

    expect(comparison.regular).toEqual({ avgPrize: 0, maxPrize: 0, count: 1 });
    expect(comparison.special).toEqual({ avgPrize: 0, maxPrize: 0, count: 0 });
  });
});
