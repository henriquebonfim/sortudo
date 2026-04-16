import { searchCombination } from '@/workers/search/engine';
import { describe, expect, it } from 'vitest';
import { makeGame } from '../../fixtures/games';

describe('search engine', () => {
  it('categorizes matches by hit count and sorts the requested combination', async () => {
    const games = [
      makeGame({ id: 1, date: '2024-01-01', numbers: [1, 2, 3, 4, 5, 6] }),
      makeGame({ id: 2, date: '2024-01-02', numbers: [1, 2, 3, 4, 5, 7] }),
      makeGame({ id: 3, date: '2024-01-03', numbers: [1, 2, 3, 4, 8, 9] }),
      makeGame({ id: 4, date: '2024-01-04', numbers: [1, 2, 3, 10, 11, 12] }),
      makeGame({ id: 5, date: '2024-01-05', numbers: [40, 41, 42, 43, 44, 45] }),
    ];

    const result = await searchCombination([6, 5, 4, 3, 2, 1], games);

    expect(result.combination).toEqual([1, 2, 3, 4, 5, 6]);
    expect(result.totalAnalyzed).toBe(5);
    expect(result.jackpot.map((g) => g.id)).toEqual([1]);
    expect(result.fiveHits.map((g) => g.id)).toEqual([2]);
    expect(result.fourHits.map((g) => g.id)).toEqual([3]);
    expect(result.threeHits.map((g) => g.id)).toEqual([4]);
  });
});
