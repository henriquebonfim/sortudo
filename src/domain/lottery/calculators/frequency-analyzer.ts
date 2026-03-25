import { Draw } from '@/domain/lottery/draw.model';
import { MAX_LOTTERY_NUMBER } from '@/domain/lottery/lottery.constants';
import { calculatePercentage, round, getDecade } from '@/lib/formatters';
import { CalculatorUtils } from './calculator-utils';
import { mean, standardDeviation } from '@/domain/math/statistics';

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
