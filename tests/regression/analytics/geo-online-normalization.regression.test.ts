import { calculateGeoWinners } from '@/workers/analytics/functions/geo.calc';
import { describe, expect, it } from 'vitest';
import { makeGame } from '../../fixtures/games';

// 10% layer: lock down high-risk edge behavior that historically tends to regress.
describe('geo winner normalization regression', () => {
  it('aggregates online channels consistently and preserves state mapping', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotWinners: 4,
        locations: ['Canal Eletrônico', 'INTERNET'],
      }),
      makeGame({
        id: 2,
        date: '2024-01-08',
        numbers: [7, 8, 9, 10, 11, 12],
        jackpotWinners: 2,
        locations: ['Sao Paulo (SP)', 'Santos/SP'],
      }),
      makeGame({
        id: 3,
        date: '2024-01-15',
        numbers: [13, 14, 15, 16, 17, 18],
        jackpotWinners: 3,
        locations: ['Rio de Janeiro/RJ', 'Niteroi RJ', 'CANAL'],
      }),
    ];

    const geo = calculateGeoWinners(games);

    expect(geo[0]).toMatchObject({ state: 'ONLINE', total: 5, percentage: 55.6 });
    expect(geo).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ state: 'SP', total: 2, percentage: 22.2 }),
        expect.objectContaining({ state: 'RJ', total: 2, percentage: 22.2 }),
      ])
    );
  });
});
