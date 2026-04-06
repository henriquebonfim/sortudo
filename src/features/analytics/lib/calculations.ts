import {
  ANALYSIS_CONFIG,
  BALLS_PER_DRAW,
  LOW_HIGH_BOUNDARY,
  MAX_LOTTERY_NUMBER,
  PRIMES,
} from '@/lib/lottery/constants';
import { Game, LotteryMetadata, LotteryStats, TopJackpotWinnersDraw } from '@/lib/lottery/types';
import {
  calculatePercentage,
  getDecade,
  getYear,
  max,
  mean,
  round,
  sortGamesById,
  standardDeviation,
  sum,
} from '@/lib/lottery/utils';

export function calculateParityDistribution(games: Game[]) {
  const counts: Record<string, number> = {};
  for (const game of games) {
    const oddCount = game.numbers.filter((num) => num % 2 !== 0).length;
    const evenCount = BALLS_PER_DRAW - oddCount;
    const key = `${oddCount}O/${evenCount}E`;
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([label, count]) => {
      const [odd] = label.split('O').map(Number);
      return {
        label,
        count,
        odd,
        even: BALLS_PER_DRAW - odd,
        percentage: calculatePercentage(count, games.length),
      };
    })
    .sort((a, b) => b.count - a.count);
}

export function calculateNumberProfile(games: Game[]) {
  const primesSet = new Set(PRIMES);
  let lowCount = 0,
    highCount = 0,
    totalPrimes = 0,
    totalM5 = 0,
    totalM10 = 0,
    fullySpread = 0,
    clustered = 0,
    validGames = 0;
  const overlapCounts = new Array(BALLS_PER_DRAW + 1).fill(0);
  let lastGameNumbers: number[] = [];
  const sorted = sortGamesById(games);

  for (const game of sorted) {
    if (game.numbers.length !== BALLS_PER_DRAW) continue;
    validGames++;
    const numbers = [...game.numbers].sort((a, b) => a - b);

    for (const num of numbers) {
      if (num <= LOW_HIGH_BOUNDARY) lowCount++;
      else highCount++;
      if (primesSet.has(num)) totalPrimes++;
      if (num % 5 === 0) totalM5++;
      if (num % 10 === 0) totalM10++;
    }

    const decadesSet = new Set();
    const decadeCounts: Record<number, number> = {};
    let hasClustered = false;
    for (const num of numbers) {
      const decade = Math.floor(num / ANALYSIS_CONFIG.DECADE_SIZE) * ANALYSIS_CONFIG.DECADE_SIZE;
      decadesSet.add(decade);
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
      if (decadeCounts[decade] >= ANALYSIS_CONFIG.CLUSTERED_THRESHOLD) hasClustered = true;
    }
    if (decadesSet.size === ANALYSIS_CONFIG.FULLY_SPREAD_SIZE) fullySpread++;
    if (hasClustered) clustered++;

    if (lastGameNumbers.length === BALLS_PER_DRAW) {
      const overlap = numbers.filter((num) => lastGameNumbers.includes(num)).length;
      overlapCounts[overlap]++;
    }
    lastGameNumbers = numbers;
  }

  const overlapTotal = validGames > 0 ? validGames - 1 : 1;
  return {
    lowHighSplit: {
      low: calculatePercentage(lowCount, validGames * BALLS_PER_DRAW || 1, 2),
      high: calculatePercentage(highCount, validGames * BALLS_PER_DRAW || 1, 2),
    },
    primesPercentage: calculatePercentage(totalPrimes, validGames * BALLS_PER_DRAW || 1, 2),
    multiplesOf5Percentage: calculatePercentage(totalM5, validGames * BALLS_PER_DRAW || 1, 2),
    multiplesOf10Percentage: calculatePercentage(totalM10, validGames * BALLS_PER_DRAW || 1, 2),
    decadeAnalysis: {
      fullySpreadPct: calculatePercentage(fullySpread, validGames, ANALYSIS_CONFIG.PRECISION),
      clusteredPct: calculatePercentage(clustered, validGames, ANALYSIS_CONFIG.PRECISION),
    },
    gameOverlaps: {
      zero: calculatePercentage(overlapCounts[0], overlapTotal, ANALYSIS_CONFIG.PRECISION),
      one: calculatePercentage(overlapCounts[1], overlapTotal, ANALYSIS_CONFIG.PRECISION),
      two: calculatePercentage(overlapCounts[2], overlapTotal, ANALYSIS_CONFIG.PRECISION),
      threePlus: calculatePercentage(
        sum(overlapCounts.slice(3)),
        overlapTotal,
        ANALYSIS_CONFIG.PRECISION
      ),
    },
  };
}

export function calculateSumDistribution(games: Game[]) {
  const bucketSize = ANALYSIS_CONFIG.SUM_BUCKET_SIZE;
  const counts: Record<number, number> = {};
  for (const game of games) {
    const s = sum(game.numbers);
    const bucket = Math.floor(s / bucketSize) * bucketSize;
    counts[bucket] = (counts[bucket] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([bucketKey, count]) => {
      const minVal = parseInt(bucketKey);
      return {
        bucket: `${minVal}–${minVal + bucketSize - 1}`,
        min: minVal,
        max: minVal + bucketSize - 1,
        count,
      };
    })
    .sort((a, b) => a.min - b.min);
}

export function calculateFrequencies(games: Game[]) {
  const counts: Record<number, number> = {};
  for (let i = 1; i <= MAX_LOTTERY_NUMBER; i++) counts[i] = 0;
  for (const game of games) {
    for (const num of game.numbers) counts[num] = (counts[num] || 0) + 1;
  }
  const freqValues = Object.values(counts);
  const ranking = Object.entries(counts)
    .map(([num, freq]) => ({
      number: parseInt(num),
      frequency: freq,
      percentage: calculatePercentage(freq, games.length, ANALYSIS_CONFIG.PRECISION),
    }))
    .sort((a, b) => b.frequency - a.frequency || a.number - b.number)
    .map((item, index) => ({ ...item, position: index + 1 }));

  return {
    frequencies: counts,
    min: { number: ranking[ranking.length - 1].number, frequency: Math.min(...freqValues) },
    max: { number: ranking[0].number, frequency: Math.max(...freqValues) },
    mean: round(mean(freqValues)),
    standardDeviation: round(standardDeviation(freqValues)),
    ranking,
  };
}

export function calculateTopPairs(games: Game[], limit = 10) {
  const pairs: Record<string, number> = {};
  for (const game of games) {
    const sortedNum = [...game.numbers].sort((a, b) => a - b);
    for (let i = 0; i < sortedNum.length; i++) {
      for (let j = i + 1; j < sortedNum.length; j++) {
        const key = `${sortedNum[i]}-${sortedNum[j]}`;
        pairs[key] = (pairs[key] || 0) + 1;
      }
    }
  }
  return Object.entries(pairs)
    .map(([pair, count]) => {
      const [number1, number2] = pair.split('-').map(Number);
      return { pair, number1, number2, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function calculateHotNumbers(games: Game[]) {
  const recent = sortGamesById(games).slice(-100);
  const counts: Record<number, number> = {};
  for (const game of recent) {
    for (const num of game.numbers) counts[num] = (counts[num] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([num, count]) => ({ number: parseInt(num), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export function calculateGapAnalysis(games: Game[]) {
  const sorted = sortGamesById(games);
  const gaps: Record<number, { current: number; max: number }> = {};
  for (let i = 1; i <= MAX_LOTTERY_NUMBER; i++) gaps[i] = { current: 0, max: 0 };
  for (const game of sorted) {
    const drawSet = new Set(game.numbers);
    for (let i = 1; i <= MAX_LOTTERY_NUMBER; i++) {
      if (drawSet.has(i)) {
        if (gaps[i].current > gaps[i].max) gaps[i].max = gaps[i].current;
        gaps[i].current = 0;
      } else gaps[i].current++;
    }
  }
  return Object.entries(gaps).map(([num, data]) => ({
    number: parseInt(num),
    currentGap: data.current,
    maxGap: data.max,
  }));
}

export function calculateTemporalFrequency(games: Game[], limit = 10) {
  const byDecade: Record<string, Record<number, number>> = {};
  for (const game of games) {
    const decade = getDecade(game.date);
    if (!byDecade[decade]) {
      byDecade[decade] = {};
      for (let i = 1; i <= MAX_LOTTERY_NUMBER; i++) byDecade[decade][i] = 0;
    }
    for (const num of game.numbers) {
      if (byDecade[decade][num] !== undefined) byDecade[decade][num]++;
    }
  }
  return Object.entries(byDecade).map(([decade, counts]) => ({
    decade,
    data: Object.entries(counts)
      .map(([num, frequency]) => ({ number: parseInt(num), frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit),
  }));
}

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
      megaDaVirada: false, // Simplified
    }))
    .sort((a, b) => a.year - b.year);
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
    avgPrize: mean(data.prizes),
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
    if (!byStreak[currentStreak])
      byStreak[currentStreak] = { count: 0, totalCollection: 0, totalPrize: 0 };
    byStreak[currentStreak].count++;
    byStreak[currentStreak].totalCollection += game.totalRevenue || 0;
    if (game.jackpotWinners > 0) byStreak[currentStreak].totalPrize += game.jackpotPrize || 0;
    if (game.accumulated || game.jackpotWinners === 0) currentStreak++;
    else currentStreak = 0;
  }
  return Object.entries(byStreak)
    .map(([streak, d]) => ({
      streakLength: parseInt(streak),
      gamesCount: d.count,
      avgCollection: d.count > 0 ? round(d.totalCollection / d.count) : 0,
      avgPrize: d.count > 0 ? round(d.totalPrize / d.count) : 0,
    }))
    .sort((a, b) => a.streakLength - b.streakLength);
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

export function calculateGeoWinners(games: Game[]) {
  const geoMap: Record<string, number> = {};
  let totalWinners = 0;
  for (const game of games) {
    if (!game.locations) continue;
    for (const loc of game.locations) {
      const stateMatch = loc.match(/\(([A-Z]{2})\)$/);
      let state = stateMatch ? stateMatch[1] : loc;
      if (state.includes('/')) {
        const parts = state.split('/');
        state = parts[parts.length - 1] || state;
      }
      geoMap[state] = (geoMap[state] || 0) + game.jackpotWinners / game.locations.length;
    }
    totalWinners += game.jackpotWinners;
  }
  return Object.entries(geoMap)
    .map(([state, total]) => ({
      state,
      total: Math.round(total),
      percentage: calculatePercentage(total, totalWinners, ANALYSIS_CONFIG.PRECISION),
    }))
    .sort((a, b) => b.total - a.total);
}

export function calculateAllStats(games: Game[]): LotteryStats {
  if (games.length === 0) throw new Error('No games available');

  const metadata: LotteryMetadata = {
    totalGames: games.length,
    firstGameDate: games[0].date,
    lastGameDate: games[games.length - 1].date,
    lastUpdate: new Date().toISOString(),
  };

  return {
    meta: calculateMeta(games, metadata),
    frequencies: calculateFrequencies(games),
    topJackpotWinners: calculateTopJackpotWinners(games),
    geoWinners: calculateGeoWinners(games),
    parityDistribution: calculateParityDistribution(games),
    prizeEvolution: calculatePrizeEvolution(games),
    sumDistribution: calculateSumDistribution(games),
    topPairs: calculateTopPairs(games, 20),
    accumulationTrend: calculateAccumulationTrend(games),
    prizeTierComparison: calculatePrizeTierComparison(games),
    temporalFrequency: calculateTemporalFrequency(games, 10),
    gapAnalysis: calculateGapAnalysis(games),
    hotNumbers: calculateHotNumbers(games),
    numberProfile: calculateNumberProfile(games),
    streakEconomics: calculateStreakEconomics(games),
    typeComparison: calculateTypeComparison(games),
  };
}
