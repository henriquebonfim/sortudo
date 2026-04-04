import { Draw } from '@/domain/lottery/data/draw';
import { searchCombination } from '@/domain/lottery/search/search-engine';
import { describe, expect, it } from 'vitest';

const MOCK_DRAWS: Draw[] = [
  {
    id: 1,
    date: '2024-01-01',
    numbers: [1, 2, 3, 10, 20, 30],
    jackpotWinners: 0,
    jackpotPrize: 0,
    quinaWinners: 0,
    quinaPrize: 0,
    quadraWinners: 0,
    quadraPrize: 0,
    accumulated: true,
    totalRevenue: 0,
    prizeEstimate: 0,
  },
  {
    id: 2,
    date: '2024-01-02',
    numbers: [1, 2, 3, 4, 5, 10],
    jackpotWinners: 0,
    jackpotPrize: 0,
    quinaWinners: 0,
    quinaPrize: 0,
    quadraWinners: 0,
    quadraPrize: 0,
    accumulated: true,
    totalRevenue: 0,
    prizeEstimate: 0,
  }
];

describe('SearchEngine', () => {
  it('should find a jackpot (6 matches) correctly', async () => {
    const result = await searchCombination([1, 2, 3, 10, 20, 30], MOCK_DRAWS);
    expect(result.jackpot).toHaveLength(1);
    expect(result.jackpot[0].id).toBe(1);
  });

  it('should find partial matches (fiveHits, fourHits, threeHits)', async () => {
    const result = await searchCombination([1, 2, 3, 4, 5, 6], MOCK_DRAWS);
    // [1, 2, 3, 4, 5, 10] matches [1, 2, 3, 4, 5] -> 5 matches (fiveHits)
    expect(result.fiveHits).toHaveLength(1);
    expect(result.fiveHits[0].id).toBe(2);

    // [1, 2, 3, 10, 20, 30] matches [1, 2, 3] -> 3 matches (threeHits)
    expect(result.threeHits).toHaveLength(1);
    expect(result.threeHits[0].id).toBe(1);
  });

  it('should utilize the repository index if provided', async () => {
    const mockRepo = {
      getDrawsByNumber: async (num: number) => {
        return MOCK_DRAWS.filter(c => c.numbers.includes(num));
      }
    };

    const result = await searchCombination([20, 21, 22, 23, 24, 25], MOCK_DRAWS, mockRepo);
    // Only draw 1 contains 20
    expect(result.totalAnalyzed).toBe(MOCK_DRAWS.length);
  });
});
