import { calculateGeoWinners } from '@/workers/analytics/functions/geo.calc';
import { describe, expect, it } from 'vitest';
import { makeGame } from '../../fixtures/games';

describe('geo analytics calculations', () => {
  it('distributes winners by normalized state with weighted splits per location', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotWinners: 2,
        locations: ['Sao Paulo/SP', 'Rio de Janeiro/RJ'],
      }),
      makeGame({
        id: 2,
        date: '2024-01-08',
        numbers: [7, 8, 9, 10, 11, 12],
        jackpotWinners: 3,
        locations: ['CANAL ELETRONICO'],
      }),
      makeGame({
        id: 3,
        date: '2024-01-15',
        numbers: [13, 14, 15, 16, 17, 18],
        jackpotWinners: 1,
        locations: ['Atlantis'],
      }),
      makeGame({
        id: 4,
        date: '2024-01-22',
        numbers: [19, 20, 21, 22, 23, 24],
        jackpotWinners: 0,
        locations: ['SP'],
      }),
    ];

    const geo = calculateGeoWinners(games);

    expect(geo).toEqual([
      { state: 'ONLINE', total: 3, percentage: 60 },
      { state: 'SP', total: 1, percentage: 20 },
      { state: 'RJ', total: 1, percentage: 20 },
    ]);
  });

  it('returns empty geo stats when no valid winner location exists', () => {
    const games = [
      makeGame({
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 5, 6],
        jackpotWinners: 0,
        locations: ['SP'],
      }),
      makeGame({
        id: 2,
        date: '2024-01-08',
        numbers: [7, 8, 9, 10, 11, 12],
        jackpotWinners: 1,
        locations: ['Unknown Place'],
      }),
    ];

    expect(calculateGeoWinners(games)).toEqual([]);
  });
});
