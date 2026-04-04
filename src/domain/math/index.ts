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
