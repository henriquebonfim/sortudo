import { ANALYSIS_CONFIG, BALLS_PER_DRAW, MAX_LOTTERY_NUMBER } from '@/workers/core/constants';
import type { Game } from '@/workers/core/types';
import {
  calculatePercentage,
  getDecade,
  getYear,
  mean,
  round,
  sortGamesById,
  standardDeviation,
  sum,
} from '@/workers/core/utils';

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
        odds: odd,
        evens: BALLS_PER_DRAW - odd,
        percentage: calculatePercentage(count, games.length),
      };
    })
    .sort((a, b) => b.count - a.count);
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
      return { numbers: [number1, number2], count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function calculateHotNumbers(games: Game[]) {
  const recent = sortGamesById(games).slice(-10);
  const counts: Record<number, number> = {};
  for (let i = 1; i <= MAX_LOTTERY_NUMBER; i++) counts[i] = 0;

  for (const game of recent) {
    for (const num of game.numbers) {
      if (counts[num] !== undefined) counts[num]++;
    }
  }

  return Object.entries(counts)
    .map(([num, count]) => ({
      number: parseInt(num),
      frequency: count,
    }))
    .sort((a, b) => b.frequency - a.frequency || a.number - b.number);
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

export function calculateTemporalFrequency(games: Game[]) {
  const targetNumbers = Array.from({ length: MAX_LOTTERY_NUMBER }, (_, i) => i + 1);
  const sorted = sortGamesById(games);
  const latestYear =
    sorted.length > 0 ? getYear(sorted[sorted.length - 1].date) : new Date().getFullYear();

  const byGroup: Record<string, { counts: Record<number, number>; total: number }> = {};

  for (const game of games) {
    const year = getYear(game.date);
    const decade = getDecade(game.date);

    const key = year === latestYear ? String(year) : decade;

    if (!byGroup[key]) {
      byGroup[key] = { counts: {}, total: 0 };
      for (const num of targetNumbers) byGroup[key].counts[num] = 0;
    }

    byGroup[key].total++;
    for (const num of game.numbers) {
      if (byGroup[key].counts[num] !== undefined) {
        byGroup[key].counts[num]++;
      }
    }
  }

  return Object.entries(byGroup)
    .map(([label, entry]) => ({
      decade: label,
      data: Object.entries(entry.counts)
        .map(([num, count]) => ({
          number: parseInt(num),
          frequency: round((count / entry.total) * 100, 1),
        }))
        .sort((a, b) => a.number - b.number),
    }))
    .sort((a, b) => a.decade.localeCompare(b.decade));
}
