import { BALLS_PER_DRAW, MAX_LOTTERY_NUMBER } from '@/lib/lottery/constants';
import { combinations } from '@/lib/lottery/utils';

/**
 * Poisson probability mass function.
 * P(X=k) = (lambda^k * e^-lambda) / k!
 */
export function poissonProbability(lambda: number, k: number): number {
  if (lambda === 0) return k === 0 ? 1 : 0;
  const factorial = (n: number): number => {
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

/**
 * Calculates the true expected value of a lottery ticket considering jackpot size,
 * odds, tickets sold (for splitting risk), and secondary prizes.
 */
export function calculateTrueExpectedValue(
  ticketCost: number,
  jackpot: number,
  jackpotOdds: number,
  ticketsSold: number,
  secondaryPrizesEV: number
): number {
  const lambda = ticketsSold / jackpotOdds;

  // Tax is ~37% in BR for prizes above a certain threshold (simplified)
  const netJackpot = jackpot * 0.63;

  // Probability that at least one person wins (including you)
  // Given you won, how many others win is Poisson(lambda)
  // Expected share = (1 - e^-lambda) / lambda (standard result for joint winners)
  const sharingFactor = lambda > 0 ? (1 - Math.exp(-lambda)) / lambda : 1;

  const expectedJackpotReturn = (netJackpot / jackpotOdds) * sharingFactor;

  return expectedJackpotReturn + secondaryPrizesEV - ticketCost;
}

/**
 * Simulates a binomial point for LLN visualization.
 */
export function simulateBinomialPoint(trials: number, p: number): number {
  let successes = 0;
  for (let i = 0; i < trials; i++) {
    if (Math.random() < p) successes++;
  }
  return (successes / trials) * 100;
}

/**
 * Generates theoretical distribution for parity (binomial approximation)
 */
export function calculateTheoreticalParity(label: string): number {
  const oddPart = label.split('O')[0];
  const odd = parseInt(oddPart);
  if (isNaN(odd)) return 0;

  const even = BALLS_PER_DRAW - odd;
  // Total combinations for 6 numbers (60 total: 30 odd, 30 even)
  const total = 50063860;

  // We have 30 odd and 30 even numbers in 1-60
  const nOdd = MAX_LOTTERY_NUMBER / 2;
  const nEven = MAX_LOTTERY_NUMBER / 2;

  const combos = combinations(nOdd, odd) * combinations(nEven, even);
  return (combos / total) * 100;
}
