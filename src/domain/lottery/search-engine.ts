import { Draw } from '@/domain/lottery/draw.model';
import type { SearchResult } from '@/domain/lottery/lottery.types';

export async function searchCombination(
  numbers: number[],
  draws: Draw[],
  repo?: { getDrawsByNumber: (num: number) => Promise<Draw[]> }
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

  let pool = draws;
  if (repo && numbers.length > 0) {
    const filtered = await repo.getDrawsByNumber(numbers[0]);
    if (filtered.length > 0) {
      pool = filtered;
    }
  }

  for (const c of pool) {
    const matches = c.numbers.filter((b) => set.has(b)).length;
    if (matches === 6) result.jackpot.push(c);
    else if (matches === 5) result.fiveHits.push(c);
    else if (matches === 4) result.fourHits.push(c);
    else if (matches === 3) result.threeHits.push(c);
  }

  return result;
}
