import type { Draw, SearchResult } from '@/domain/lottery/draw';

/**
 * Searches for a specific combination of numbers within the draw history.
 * PURE logic, safe for workers.
 */
export async function searchCombination(
  numbers: number[],
  draws: Draw[]
): Promise<SearchResult> {
  const set = new Set(numbers);
  const result: SearchResult = {
    combination: [...numbers].sort((a, b) => a - b),
    jackpot: [],
    fiveHits: [],
    fourHits: [],
    threeHits: [],
    totalAnalyzed: draws.length,
  };

  for (const c of draws) {
    const matches = c.numbers.filter((b) => set.has(b)).length;
    if (matches === 6) result.jackpot.push(c);
    else if (matches === 5) result.fiveHits.push(c);
    else if (matches === 4) result.fourHits.push(c);
    else if (matches === 3) result.threeHits.push(c);
  }

  return result;
}
