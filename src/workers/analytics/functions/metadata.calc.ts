import { ANALYSIS_CONFIG } from '@/workers/core/constants';
import type { Game, LotteryMetadata, TopJackpotWinnersDraw } from '@/workers/core/types';
import { calculatePercentage, sum } from '@/workers/core/utils';

export function calculateMeta(games: Game[], metadata: LotteryMetadata) {
  let totalWinners = 0,
    withoutWinnerCount = 0,
    maxPrize = 0,
    sumWinningJackpots = 0,
    winningCount = 0;
  for (const game of games) {
    const winners = game.jackpotWinners || 0;
    totalWinners += winners;
    if (winners === 0) withoutWinnerCount++;
    else {
      winningCount++;
      sumWinningJackpots += game.jackpotPrize || 0;
    }
    if ((game.jackpotPrize || 0) > maxPrize) maxPrize = game.jackpotPrize || 0;
  }
  return {
    ...metadata,
    totalJackpotWinners: totalWinners,
    pctWithoutWinner: calculatePercentage(
      withoutWinnerCount,
      metadata.totalGames,
      ANALYSIS_CONFIG.PRECISION
    ),
    avgJackpotPrize: winningCount > 0 ? Math.round(sumWinningJackpots / winningCount) : 0,
    highestPrize: maxPrize,
  };
}

export function calculateTopJackpotWinners(games: Game[]): TopJackpotWinnersDraw[] {
  const totalWinnersGlobal = sum(games.map((g) => g.jackpotWinners || 0));
  return games
    .filter((g) => (g.jackpotWinners || 0) > 0)
    .sort((a, b) => (b.jackpotWinners || 0) - (a.jackpotWinners || 0))
    .slice(0, 10)
    .map((g) => ({
      drawId: g.id,
      date: g.date,
      winners: g.jackpotWinners || 0,
      prize: g.jackpotPrize,
      pctOfTotalWinners: calculatePercentage(
        g.jackpotWinners || 0,
        totalWinnersGlobal,
        ANALYSIS_CONFIG.PRECISION
      ),
    }));
}
