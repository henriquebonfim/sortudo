import type { Game, SearchResult } from '@/workers/core/types';
import { countMatches } from '@/workers/core/utils';

/**
 * Search engine for matching combinations against historical games.
 */
export async function searchCombination(numbers: number[], games: Game[]): Promise<SearchResult> {
  const result: SearchResult = {
    combination: [...numbers].sort((a, b) => a - b),
    jackpot: [],
    fiveHits: [],
    fourHits: [],
    threeHits: [],
    totalAnalyzed: games.length,
  };

  for (const game of games) {
    const matches = countMatches(game.numbers, numbers);
    if (matches === 6) result.jackpot.push(game);
    else if (matches === 5) result.fiveHits.push(game);
    else if (matches === 4) result.fourHits.push(game);
    else if (matches === 3) result.threeHits.push(game);
  }

  return result;
}
