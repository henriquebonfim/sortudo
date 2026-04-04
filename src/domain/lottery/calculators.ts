import { Draw } from './draw';
import { LotteryStats } from './lottery.types';
import { 
  MAX_LOTTERY_NUMBER, 
  BALLS_PER_DRAW, 
  PRIMES, 
  LOW_HIGH_BOUNDARY, 
  ANALYSIS_CONFIG,
  MEGA_DA_VIRADA_THRESHOLD,
  DECEMBER_MONTH
} from './lottery.constants';
import { 
  calculatePercentage, 
  round, 
  getDecade, 
  getYear 
} from '@/lib';
import { 
  mean, 
  standardDeviation, 
  sum, 
  max 
} from '@/domain/math';

// ─── Calculator Utilities ────────────────────────────────────────────────────

export class CalculatorUtils {
  /** Returns a copy of draws sorted by ID in ascending order. */
  static sortDrawsById(draws: Draw[]): Draw[] {
    return [...draws].sort((a, b) => a.id - b.id);
  }

  /** Groups draws by year. */
  static groupByYear<T>(draws: Draw[], callback: (d: Draw) => T): Record<number, T[]> {
    const grouped: Record<number, T[]> = {};
    for (const d of draws) {
      const year = new Date(d.date).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(callback(d));
    }
    return grouped;
  }
}

// ─── Frequency Analyzer ──────────────────────────────────────────────────────

export class FrequencyAnalyzer {
  static calculateFrequencies(draws: Draw[]) {
    const frequencies: Record<string, number> = {};
    for (let i = 1; i <= MAX_LOTTERY_NUMBER; i++) frequencies[String(i)] = 0;

    draws.forEach(d => {
      d.numbers.forEach(n => {
        frequencies[String(n)] = (frequencies[String(n)] || 0) + 1;
      });
    });

    const ranking = Object.entries(frequencies)
      .map(([n, f]) => ({ number: Number(n), frequency: f }))
      .sort((a, b) => b.frequency - a.frequency)
      .map((item, idx) => ({ 
        ...item, 
        position: idx + 1,
        percentage: calculatePercentage(item.frequency, draws.length)
      }));

    const freqValues = Object.values(frequencies);

    return {
      frequencies,
      min: ranking[ranking.length - 1] || { number: 0, frequency: 0, position: 0, percentage: 0 },
      max: ranking[0] || { number: 0, frequency: 0, position: 0, percentage: 0 },
      mean: round(mean(freqValues)),
      standardDeviation: round(standardDeviation(freqValues)),
      ranking,
    };
  }

  static calculateTopPairs(draws: Draw[], limit = 20) {
    const pairCounts: Record<string, number> = {};

    for (const d of draws) {
      const numbers = [...d.numbers].sort((a, b) => a - b);
      for (let i = 0; i < numbers.length - 1; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
          const key = `${numbers[i]}-${numbers[j]}`;
          pairCounts[key] = (pairCounts[key] || 0) + 1;
        }
      }
    }

    return Object.entries(pairCounts)
      .map(([pair, count]) => {
        const [number1, number2] = pair.split('-').map(Number);
        return { pair, number1, number2, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  static calculateGapAnalysis(draws: Draw[]) {
    const currentGaps = new Array(MAX_LOTTERY_NUMBER + 1).fill(0);
    const maxGaps = new Array(MAX_LOTTERY_NUMBER + 1).fill(0);

    const sorted = CalculatorUtils.sortDrawsById(draws);

    for (const d of sorted) {
      for (let n = 1; n <= MAX_LOTTERY_NUMBER; n++) currentGaps[n]++;
      for (const num of d.numbers) {
        if (currentGaps[num] > maxGaps[num]) maxGaps[num] = currentGaps[num];
        currentGaps[num] = 0;
      }
    }

    const result = [];
    for (let n = 1; n <= MAX_LOTTERY_NUMBER; n++) {
      result.push({ number: n, currentGap: currentGaps[n], maxGap: maxGaps[n] });
    }

    return result.sort((a, b) => b.currentGap - a.currentGap).slice(0, 20);
  }

  static calculateTemporalFrequency(draws: Draw[], topN = 10) {
    const byDecade: Record<string, Record<number, number>> = {};

    for (const d of draws) {
      const decade = getDecade(d.date);
      if (!byDecade[decade]) byDecade[decade] = {};
      for (const num of d.numbers) {
        byDecade[decade][num] = (byDecade[decade][num] || 0) + 1;
      }
    }

    const globalFreq: Record<number, number> = {};
    for (const freq of Object.values(byDecade)) {
      for (const [num, count] of Object.entries(freq)) {
        globalFreq[parseInt(num)] = (globalFreq[parseInt(num)] || 0) + count;
      }
    }
    const topNumbers = Object.entries(globalFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([n]) => parseInt(n));

    return Object.entries(byDecade)
      .map(([decade, freq]) => ({
        decade,
        data: topNumbers.map(n => ({ number: n, frequency: freq[n] || 0 })),
      }))
      .sort((a, b) => a.decade.localeCompare(b.decade));
  }

  static calculateHotNumbers(draws: Draw[], lastN = 10) {
    const recentDraws = CalculatorUtils.sortDrawsById(draws).slice(-lastN);
    const freq: Record<number, number> = {};

    for (const d of recentDraws) {
      for (const num of d.numbers) freq[num] = (freq[num] || 0) + 1;
    }

    return Object.entries(freq)
      .map(([num, count]) => ({ number: parseInt(num), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

// ─── Geography Analyzer ──────────────────────────────────────────────────────

const CANAL_ELETRONICO_DISPLAY = 'Canal Eletrônico';
const CANAL_ELETRONICO_KEY = 'ELECT';

export class GeographyAnalyzer {
  static calculateGeoWinners(draws: Draw[]) {
    const counts: Record<string, number> = {};
    let totalEntries = 0;

    for (const d of draws) {
      if (!d.locations || d.locations.length === 0) continue;
      
      for (const location of d.locations) {
        if (location === CANAL_ELETRONICO_DISPLAY) {
          counts[CANAL_ELETRONICO_KEY] = (counts[CANAL_ELETRONICO_KEY] || 0) + 1;
          totalEntries++;
          continue;
        }

        const parts = location.split('/');
        const uf = parts.length > 1 ? parts[1].trim() : undefined;
        
        if (uf && /^[A-Z]{2}$/.test(uf)) {
          counts[uf] = (counts[uf] || 0) + 1;
          totalEntries++;
        }
      }
    }

    return Object.entries(counts)
      .map(([state, total]) => ({ 
        state, 
        total,
        percentage: calculatePercentage(total, totalEntries)
      }))
      .sort((a, b) => b.total - a.total);
  }
}

// ─── Draw Analyzer ───────────────────────────────────────────────────────────

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

// ─── Prize Analyzer ──────────────────────────────────────────────────────────

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

  static isSpecialDraw(draw: Draw): boolean {
    const date = draw.date || '';
    const isLateDec = date.endsWith('-12-31') || date.endsWith('-12-30');
    const isHighPrize = (draw.jackpotPrize || 0) > 30_000_000;
    
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
