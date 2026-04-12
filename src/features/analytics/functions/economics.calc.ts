import { Game } from '@/lib/lottery/types';
import { max, mean, round, sortGamesById } from '@/lib/lottery/utils';

export function calculatePrizeTierComparison(games: Game[]) {
  const stats = {
    sena: { label: '6 Hits (Jackpot)', prizes: [] as number[], winners: 0 },
    quina: { label: '5 Hits (Quina)', prizes: [] as number[], winners: 0 },
    quadra: { label: '4 Hits (Quadra)', prizes: [] as number[], winners: 0 },
  };
  for (const game of games) {
    if (game.jackpotWinners > 0) {
      stats.sena.prizes.push(game.jackpotPrize);
      stats.sena.winners += game.jackpotWinners;
    }
    if (game.quinaWinners > 0) {
      stats.quina.prizes.push(game.quinaPrize);
      stats.quina.winners += game.quinaWinners;
    }
    if (game.quadraWinners > 0) {
      stats.quadra.prizes.push(game.quadraPrize);
      stats.quadra.winners += game.quadraWinners;
    }
  }
  return Object.entries(stats).map(([tier, data]) => ({
    tier,
    label: data.label,
    avgPrize: round(mean(data.prizes)),
    maxPrize: max(data.prizes),
    totalWinners: data.winners,
  }));
}

export function calculateStreakEconomics(games: Game[]) {
  const sorted = sortGamesById(games);
  let currentStreak = 0;
  const byStreak: Record<number, { count: number; totalCollection: number; totalPrize: number }> =
    {};

  for (const game of sorted) {
    if (!byStreak[currentStreak]) {
      byStreak[currentStreak] = { count: 0, totalCollection: 0, totalPrize: 0 };
    }
    
    byStreak[currentStreak].count++;
    byStreak[currentStreak].totalCollection += game.totalRevenue || 0;
    
    if (game.jackpotWinners > 0) {
      byStreak[currentStreak].totalPrize += game.jackpotPrize || 0;
    }

    if (game.accumulated || game.jackpotWinners === 0) {
      currentStreak++;
    } else {
      currentStreak = 0;
    }
  }

  return Object.entries(byStreak)
    .map(([streak, d]) => ({
      streak: parseInt(streak),
      count: d.count,
      avgCollection: round(d.totalCollection / d.count),
      avgPrize: round(d.totalPrize / Math.max(1, d.count - (byStreak[parseInt(streak) + 1]?.count || 0))),
    }))
    .sort((a, b) => a.streak - b.streak);
}

export function calculateTypeComparison(games: Game[]) {
  const special = games.filter(
    (g) => g.jackpotPrize > 30_000_000 && (g.date.endsWith('-12-31') || g.date.endsWith('-12-30'))
  );
  const regular = games.filter((g) => !special.includes(g));
  const getStats = (list: Game[]) => {
    const prizes = list.filter((g) => g.jackpotPrize > 0).map((g) => g.jackpotPrize);
    return { avgPrize: round(mean(prizes)), maxPrize: max(prizes), count: list.length };
  };
  return { regular: getStats(regular), special: getStats(special) };
}
