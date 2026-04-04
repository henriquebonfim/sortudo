/**
 * Calculates the number of combinations (n choose k).
 * Uses an iterative approach to prevent overflow for intermediate values.
 */
export function combinations(n: number, k: number): number {
  if (n < 0 || k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  const realK = k > n / 2 ? n - k : k;
  let result = 1;

  for (let i = 1; i <= realK; i++) {
    result = Math.round((result * (n - i + 1)) / i);
  }
  
  return result;
}

/**
 * Common statistical functions for domain calculations.
 */

export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function variance(arr: number[]): number {
  if (arr.length === 0) return 0;
  const avg = mean(arr);
  return arr.reduce((a, b) => a + (b - avg) ** 2, 0) / arr.length;
}

export function standardDeviation(arr: number[]): number {
  return Math.sqrt(variance(arr));
}

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function max(arr: number[]): number {
  return arr.length > 0 ? arr.reduce((a, b) => (b > a ? b : a), arr[0]) : 0;
}

export function min(arr: number[]): number {
  return arr.length > 0 ? arr.reduce((a, b) => (b < a ? b : a), arr[0]) : 0;
}

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export function poissonProbability(lambda: number, k: number): number {
  if (Number.isNaN(lambda) || Number.isNaN(k)) return 0;
  if (!Number.isFinite(lambda) || !Number.isFinite(k)) return 0;
  if (lambda < 0 || k < 0) return 0;
  
  const result = (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
  return Number.isFinite(result) ? result : 0;
}

export function calculateTrueExpectedValue(
  ticketCost: number,
  jackpotAmount: number,
  jackpotOdds: number,
  ticketsSoldEstimated: number,
  secondaryPrizesEV: number = 0
): number {
  const lambda = ticketsSoldEstimated / jackpotOdds;
  const shareFactor = lambda > 0.01 
    ? (1 - Math.exp(-lambda)) / lambda 
    : 1.0;
  
  const expectedJackpotValue = (jackpotAmount * shareFactor) / jackpotOdds;
  
  return expectedJackpotValue + secondaryPrizesEV - ticketCost;
}

/**
 * Generates a random number following a standard normal distribution (mean=0, stdDev=1)
 * using the Box-Muller transform.
 */
export function boxMullerRandom(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Simulates a binomial convergence point (e.g., Law of Large Numbers)
 * using the normal approximation to the binomial distribution.
 */
export function simulateBinomialPoint(trials: number, p: number = 0.5): number {
  if (trials <= 0) return p;
  const expectedValue = trials * p;
  const stdDev = Math.sqrt(trials * p * (1 - p));
  const noise = boxMullerRandom();
  const simulatedHits = expectedValue + noise * stdDev;
  return parseFloat(((simulatedHits / trials) * 100).toFixed(2));
}

// ─── Combinatorial Utilities ─────────────────────────────────────────────────

export interface ComboEntry {
  n: number;
  combos: number;
  label: string;
}

export const getCombosTable = (start: number = 6, count: number = 15, choose: number = 6): ComboEntry[] => {
  return Array.from({ length: count }, (_, i) => {
    const n = i + start;
    return {
      n,
      combos: combinations(n, choose),
      label: `${n}`,
    };
  });
};
