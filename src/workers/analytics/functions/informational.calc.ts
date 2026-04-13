import { ANALYSIS_CONFIG, BALLS_PER_DRAW, LOW_HIGH_BOUNDARY, PRIMES } from '@/workers/core/constants';
import type { Game } from '@/workers/core/types';
import { calculatePercentage, sortGamesById, sum } from '@/workers/core/utils';

function countMatches(draw: number[], combination: number[]): number {
  const drawSet = new Set(draw);
  return combination.filter((n) => drawSet.has(n)).length;
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
  const overlapHistory: {
    drawId: number;
    prevDrawId: number;
    date: string;
    numbers: number[];
    count: number;
  }[] = [];
  let lastGame: Game | null = null;
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

    if (lastGame) {
      const overlapping = numbers.filter((num) => lastGame!.numbers.includes(num));
      const overlap = countMatches(lastGame.numbers, numbers);
      overlapCounts[overlap]++;

      if (overlap >= 1) {
        overlapHistory.push({
          drawId: game.id,
          prevDrawId: lastGame.id,
          date: game.date,
          numbers: overlapping,
          count: overlap,
        });
      }
    }
    lastGame = game;
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
      zero: calculatePercentage(overlapCounts[0], overlapTotal, 1),
      one: calculatePercentage(overlapCounts[1], overlapTotal, 1),
      two: calculatePercentage(overlapCounts[2], overlapTotal, 2),
      threePlus: calculatePercentage(sum(overlapCounts.slice(3)), overlapTotal, 2),
      totalWithOverlap: overlapHistory.length,
    },
    overlapHistory: overlapHistory.reverse(),
  };
}
