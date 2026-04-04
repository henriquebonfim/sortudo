import { sum } from '@/domain/math';
import { calculatePercentage } from '@/lib';
import { Draw } from '../data/draw';
import { ANALYSIS_CONFIG, BALLS_PER_DRAW, LOW_HIGH_BOUNDARY, PRIMES } from '../lottery.constants';
import { CalculatorUtils } from './calculator-utils';

export class DrawAnalyzer {
  static calculateParityDistribution(draws: Draw[]) {
    const counts: Record<string, number> = {};

    for (const d of draws) {
      const oddCount = d.numbers.filter(num => num % 2 !== 0).length;
      const evenCount = BALLS_PER_DRAW - oddCount;
      const key = `${oddCount}I/${evenCount}P`;
      counts[key] = (counts[key] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([label, count]) => {
        const [odd] = label.split('I').map(Number);
        return {
          label,
          count,
          odd,
          even: BALLS_PER_DRAW - odd,
          percentage: calculatePercentage(count, draws.length)
        };
      })
      .sort((a, b) => b.count - a.count);
  }

  static calculateSumDistribution(draws: Draw[]) {
    const bucketSize = ANALYSIS_CONFIG.SUM_BUCKET_SIZE;
    const counts: Record<number, number> = {};

    for (const d of draws) {
      const s = sum(d.numbers);
      const bucket = Math.floor(s / bucketSize) * bucketSize;
      counts[bucket] = (counts[bucket] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([bucketKey, count]) => {
        const min = parseInt(bucketKey);
        return { bucket: `${min}–${min + bucketSize - 1}`, min, max: min + bucketSize - 1, count };
      })
      .sort((a, b) => a.min - b.min);
  }

  static calculateNumberProfile(draws: Draw[]) {
    const primesSet = new Set(PRIMES);
    let lowCount = 0, highCount = 0, totalPrimes = 0, totalM5 = 0, totalM10 = 0, fullySpread = 0, clustered = 0, validDraws = 0;
    const overlapCounts = new Array(BALLS_PER_DRAW + 1).fill(0);
    let lastDrawNumbers: number[] = [];

    const sorted = CalculatorUtils.sortDrawsById(draws);

    for (const d of sorted) {
      if (d.numbers.length !== BALLS_PER_DRAW) continue;
      validDraws++;
      const numbers = [...d.numbers].sort((a, b) => a - b);

      for (const num of numbers) {
        if (num <= LOW_HIGH_BOUNDARY) lowCount++; else highCount++;
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

      if (lastDrawNumbers.length === BALLS_PER_DRAW) {
        const overlap = numbers.filter(num => lastDrawNumbers.includes(num)).length;
        overlapCounts[overlap]++;
      }
      lastDrawNumbers = numbers;
    }

    const totalBalls = validDraws * BALLS_PER_DRAW || 1;
    const overlapTotal = validDraws > 0 ? validDraws - 1 : 1;

    return {
      lowHighSplit: { low: calculatePercentage(lowCount, totalBalls, 2), high: calculatePercentage(highCount, totalBalls, 2) },
      primesPercentage: calculatePercentage(totalPrimes, totalBalls, 2),
      multiplesOf5Percentage: calculatePercentage(totalM5, totalBalls, 2),
      multiplesOf10Percentage: calculatePercentage(totalM10, totalBalls, 2),
      decadeAnalysis: {
        fullySpreadPct: calculatePercentage(fullySpread, validDraws, 2),
        clusteredPct: calculatePercentage(clustered, validDraws, 2),
      },
      drawOverlaps: {
        zero: calculatePercentage(overlapCounts[0], overlapTotal, 2),
        one: calculatePercentage(overlapCounts[1], overlapTotal, 2),
        two: calculatePercentage(overlapCounts[2], overlapTotal, 2),
        threePlus: calculatePercentage(sum(overlapCounts.slice(3)), overlapTotal, 2),
      },
    };
  }
}
