import { Game, SearchResult } from '@/lib/lottery/types';

/**
 * Search Engine for combinations
 */
export async function searchCombination(numbers: number[], games: Game[]): Promise<SearchResult> {
  const set = new Set(numbers);
  const result: SearchResult = {
    combination: [...numbers].sort((a, b) => a - b),
    jackpot: [],
    fiveHits: [],
    fourHits: [],
    threeHits: [],
    totalAnalyzed: games.length,
  };

  for (const game of games) {
    const matches = game.numbers.filter((b) => set.has(b)).length;
    if (matches === 6) result.jackpot.push(game);
    else if (matches === 5) result.fiveHits.push(game);
    else if (matches === 4) result.fourHits.push(game);
    else if (matches === 3) result.threeHits.push(game);
  }

  return result;
}
