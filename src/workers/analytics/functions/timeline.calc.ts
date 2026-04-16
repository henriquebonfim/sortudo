import { ANALYSIS_CONFIG } from '@/workers/core/constants';
import type { Game } from '@/workers/core/types';
import { calculatePercentage, getYear, max, sum } from '@/workers/core/utils';

export function calculatePrizeEvolution(games: Game[]) {
  const byYear: Record<
    number,
    { prizes: number[]; revenues: number[]; distributed: number; winners: number }
  > = {};
  for (const game of games) {
    const year = getYear(game.date);
    if (!byYear[year]) byYear[year] = { prizes: [], revenues: [], distributed: 0, winners: 0 };
    if (game.jackpotPrize > 0) byYear[year].prizes.push(game.jackpotPrize);
    if (game.totalRevenue > 0) byYear[year].revenues.push(game.totalRevenue);
    byYear[year].distributed +=
      game.jackpotWinners * game.jackpotPrize +
      game.quinaWinners * game.quinaPrize +
      game.quadraWinners * game.quadraPrize;
    byYear[year].winners += game.jackpotWinners || 0;
  }
  return Object.entries(byYear)
    .map(([year, d]) => ({
      year: parseInt(year),
      maxPrize: max(d.prizes),
      totalDistributed: d.distributed,
      totalRevenue: sum(d.revenues),
      totalGames: d.prizes.length,
      totalWinners: d.winners,
      megaDaVirada: false,
    }))
    .sort((a, b) => a.year - b.year);
}

export function calculateAccumulationTrend(games: Game[]) {
  const byYear: Record<number, { acc: number; noAcc: number }> = {};
  for (const game of games) {
    const year = getYear(game.date);
    if (!byYear[year]) byYear[year] = { acc: 0, noAcc: 0 };
    if (game.accumulated) byYear[year].acc++;
    else byYear[year].noAcc++;
  }
  return Object.entries(byYear)
    .map(([year, d]) => ({
      year: parseInt(year),
      accumulated: d.acc,
      nonAccumulated: d.noAcc,
      pctAccumulated: calculatePercentage(d.acc, d.acc + d.noAcc, ANALYSIS_CONFIG.PRECISION),
    }))
    .sort((a, b) => a.year - b.year);
}
