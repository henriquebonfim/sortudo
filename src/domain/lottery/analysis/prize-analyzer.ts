import { max, mean, sum } from '@/domain/math';
import { calculatePercentage, getYear, round } from '@/lib';
import { Draw, LotteryStats } from '../data/draw';
import { DECEMBER_30, DECEMBER_31, DECEMBER_MONTH, MEGA_DA_VIRADA_THRESHOLD, SPECIAL_DRAW_MIN_PRIZE } from '../lottery.constants';
import { CalculatorUtils } from './calculator-utils';

export class PrizeAnalyzer {
  static calculateTopJackpotWinners(draws: Draw[]) {
    const totalWinnersGlobal = sum(draws.map(d => d.jackpotWinners || 0));

    return draws
      .filter(d => (d.jackpotWinners || 0) > 0)
      .sort((a, b) => (b.jackpotWinners || 0) - (a.jackpotWinners || 0))
      .slice(0, 10)
      .map(d => ({
        drawId: d.id,
        date: d.date,
        winners: d.jackpotWinners || 0,
        prize: d.jackpotPrize,
        pctOfTotalWinners: calculatePercentage(d.jackpotWinners || 0, totalWinnersGlobal)
      }));
  }

  static calculatePrizeEvolution(draws: Draw[]) {
    const byYear: Record<number, { prizes: number[]; revenues: number[]; distributed: number; megaDaVirada: boolean; winners: number }> = {};

    for (const d of draws) {
      const year = getYear(d.date);
      if (!byYear[year]) byYear[year] = { prizes: [], revenues: [], distributed: 0, megaDaVirada: false, winners: 0 };

      if (d.jackpotPrize > 0) byYear[year].prizes.push(d.jackpotPrize);

      const revenue = d.totalRevenue || 0;
      if (revenue > 0) byYear[year].revenues.push(revenue);

      const distributedAmount = (d.jackpotWinners * d.jackpotPrize) +
        (d.quinaWinners * d.quinaPrize) +
        (d.quadraWinners * d.quadraPrize);
      byYear[year].distributed += distributedAmount;

      byYear[year].winners += d.jackpotWinners || 0;

      if (d.jackpotWinners === 0 && d.jackpotPrize > MEGA_DA_VIRADA_THRESHOLD && d.date.includes(DECEMBER_MONTH)) {
        byYear[year].megaDaVirada = true;
      }
    }

    return Object.entries(byYear)
      .map(([year, data]) => ({
        year: parseInt(year),
        maxPrize: max(data.prizes),
        totalDistributed: data.distributed,
        totalRevenue: sum(data.revenues),
        totalDraws: data.prizes.length,
        totalWinners: data.winners,
        megaDaVirada: data.megaDaVirada,
      }))
      .sort((a, b) => a.year - b.year);
  }

  static calculateAccumulationTrend(draws: Draw[]) {
    const byYear: Record<number, { acc: number; noAcc: number }> = {};

    for (const d of draws) {
      const year = getYear(d.date);
      if (!byYear[year]) byYear[year] = { acc: 0, noAcc: 0 };
      if (d.accumulated) byYear[year].acc++;
      else byYear[year].noAcc++;
    }

    return Object.entries(byYear)
      .map(([year, d]) => ({
        year: parseInt(year),
        accumulated: d.acc,
        nonAccumulated: d.noAcc,
        pctAccumulated: calculatePercentage(d.acc, d.acc + d.noAcc),
      }))
      .sort((a, b) => a.year - b.year);
  }

  static calculatePrizeTierComparison(draws: Draw[]) {
    const stats = {
      sena: { label: '6 Hits (Jackpot)', prizes: [] as number[], winners: 0 },
      quina: { label: '5 Hits (Quina)', prizes: [] as number[], winners: 0 },
      quadra: { label: '4 Hits (Quadra)', prizes: [] as number[], winners: 0 },
    };

    for (const d of draws) {
      if (d.jackpotWinners > 0) {
        stats.sena.prizes.push(d.jackpotPrize);
        stats.sena.winners += d.jackpotWinners;
      }
      if (d.quinaWinners > 0) {
        stats.quina.prizes.push(d.quinaPrize);
        stats.quina.winners += d.quinaWinners;
      }
      if (d.quadraWinners > 0) {
        stats.quadra.prizes.push(d.quadraPrize);
        stats.quadra.winners += d.quadraWinners;
      }
    }

    return Object.entries(stats).map(([tier, data]) => ({
      tier,
      label: data.label,
      avgPrize: mean(data.prizes),
      maxPrize: max(data.prizes),
      totalWinners: data.winners,
    }));
  }

  static calculateStreakEconomics(draws: Draw[]) {
    const sorted = CalculatorUtils.sortDrawsById(draws);
    let currentStreak = 0;
    const byStreak: Record<number, { count: number; totalCollection: number; totalPrize: number }> = {};

    for (const d of sorted) {
      if (!byStreak[currentStreak]) byStreak[currentStreak] = { count: 0, totalCollection: 0, totalPrize: 0 };
      byStreak[currentStreak].count++;
      byStreak[currentStreak].totalCollection += d.totalRevenue || 0;
      if (d.jackpotWinners > 0) byStreak[currentStreak].totalPrize += d.jackpotPrize || 0;

      const isAccumulated = d.accumulated || d.jackpotWinners === 0;
      if (isAccumulated) currentStreak++;
      else currentStreak = 0;
    }

    return Object.entries(byStreak).map(([streak, d]) => ({
      streakLength: parseInt(streak),
      drawsCount: d.count,
      avgCollection: d.count > 0 ? round(d.totalCollection / d.count) : 0,
      avgPrize: d.count > 0 ? round(d.totalPrize / d.count) : 0,
    })).sort((a, b) => a.streakLength - b.streakLength);
  }

  static calculateMeta(draws: Draw[], metadata?: { totalDraws: number; firstDrawDate: string; lastDrawDate: string }) {
    if (!metadata || draws.length === 0) {
      return { totalDraws: 0, firstDrawDate: '-', lastDrawDate: '-', totalJackpotWinners: 0, pctWithoutWinner: 0, avgJackpotPrize: 0, highestPrize: 0 };
    }

    let totalWinners = 0;
    let withoutWinnerCount = 0;
    let maxPrize = 0;
    let sumWinningJackpots = 0;
    let winningCount = 0;

    for (const d of draws) {
      const winners = d.jackpotWinners || 0;
      totalWinners += winners;
      if (winners === 0) withoutWinnerCount++;
      else {
        winningCount++;
        sumWinningJackpots += d.jackpotPrize || 0;
      }
      if ((d.jackpotPrize || 0) > maxPrize) maxPrize = d.jackpotPrize || 0;
    }

    return {
      totalDraws: metadata.totalDraws,
      firstDrawDate: metadata.firstDrawDate,
      lastDrawDate: metadata.lastDrawDate,
      totalJackpotWinners: totalWinners,
      pctWithoutWinner: calculatePercentage(withoutWinnerCount, metadata.totalDraws),
      avgJackpotPrize: winningCount > 0 ? Math.round(sumWinningJackpots / winningCount) : 0,
      highestPrize: maxPrize,
    };
  }

  static isSpecialDraw(draw: Draw): boolean {
    const date = draw.date || '';
    const isLateDec = date.endsWith(DECEMBER_31) || date.endsWith(DECEMBER_30);
    const isHighPrize = (draw.jackpotPrize || 0) > SPECIAL_DRAW_MIN_PRIZE;

    return isLateDec && isHighPrize;
  }

  static calculateTypeComparison(draws: Draw[]): LotteryStats['typeComparison'] {
    const special = draws.filter(d => PrizeAnalyzer.isSpecialDraw(d));
    const regular = draws.filter(d => !PrizeAnalyzer.isSpecialDraw(d));

    const getStats = (list: Draw[]) => {
      const prizes = list.filter(d => d.jackpotPrize > 0).map(d => d.jackpotPrize);
      return {
        avgPrize: round(mean(prizes)),
        maxPrize: max(prizes),
        count: list.length
      };
    };

    return {
      regular: getStats(regular),
      special: getStats(special)
    };
  }
}
