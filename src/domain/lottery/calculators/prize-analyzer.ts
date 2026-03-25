import { Draw } from '@/domain/lottery/draw.model';
import { MEGA_DA_VIRADA_THRESHOLD, DECEMBER_MONTH } from '@/domain/lottery/lottery.constants';
import { calculatePercentage, round, getYear } from '@/lib/formatters';
import { CalculatorUtils } from './calculator-utils';
import { sum, mean, max } from '@/domain/math/statistics';

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
    const byYear: Record<number, { prizes: number[]; megaDaVirada: boolean }> = {};

    for (const d of draws) {
      const year = getYear(d.date);
      if (!byYear[year]) byYear[year] = { prizes: [], megaDaVirada: false };
      if (d.jackpotPrize > 0) byYear[year].prizes.push(d.jackpotPrize);
      if (d.jackpotWinners === 0 && d.jackpotPrize > MEGA_DA_VIRADA_THRESHOLD && d.date.includes(DECEMBER_MONTH)) {
        byYear[year].megaDaVirada = true;
      }
    }

    return Object.entries(byYear)
      .map(([year, data]) => ({
        year: parseInt(year),
        maxPrize: max(data.prizes),
        avgPrize: mean(data.prizes),
        totalDraws: data.prizes.length,
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
    const sena = draws.filter(d => d.jackpotWinners > 0).map(d => d.jackpotPrize);
    const quina = draws.filter(d => d.quinaWinners > 0).map(d => d.quinaPrize);
    const quadra = draws.filter(d => d.quadraWinners > 0).map(d => d.quadraPrize);

    const totalW = (field: 'jackpotWinners' | 'quinaWinners' | 'quadraWinners') =>
      sum(draws.map(d => d[field] || 0));

    return [
      { tier: 'sena', label: '6 Hits (Jackpot)', avgPrize: mean(sena), maxPrize: max(sena), totalWinners: totalW('jackpotWinners') },
      { tier: 'quina', label: '5 Hits (Quina)', avgPrize: mean(quina), maxPrize: max(quina), totalWinners: totalW('quinaWinners') },
      { tier: 'quadra', label: '4 Hits (Quadra)', avgPrize: mean(quadra), maxPrize: max(quadra), totalWinners: totalW('quadraWinners') },
    ];
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
    const winners = sum(draws.map(d => d.jackpotWinners || 0));
    const withoutWinner = draws.filter(d => (d.jackpotWinners || 0) === 0).length;
    const jackpotPrizes = draws.map(d => d.jackpotPrize || 0);
    const winningJackpotPrizes = draws.filter(d => (d.jackpotWinners || 0) > 0).map(d => d.jackpotPrize || 0);

    return {
      totalDraws: metadata.totalDraws,
      firstDrawDate: metadata.firstDrawDate,
      lastDrawDate: metadata.lastDrawDate,
      totalJackpotWinners: winners,
      pctWithoutWinner: calculatePercentage(withoutWinner, metadata.totalDraws),
      avgJackpotPrize: Math.round(mean(winningJackpotPrizes)),
      highestPrize: max(jackpotPrizes),
    };
  }
}
