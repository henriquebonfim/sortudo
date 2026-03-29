/**
 * Common statistical functions for domain calculations.
 */

/**
 * Calculates the arithmetic mean of an array of numbers.
 */
export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Calculates the variance of an array of numbers.
 */
export function variance(arr: number[]): number {
  if (arr.length === 0) return 0;
  const avg = mean(arr);
  return arr.reduce((a, b) => a + (b - avg) ** 2, 0) / arr.length;
}

/**
 * Calculates the standard deviation of an array of numbers.
 */
export function standardDeviation(arr: number[]): number {
  return Math.sqrt(variance(arr));
}

/**
 * Calculates the sum of an array of numbers.
 */
export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

/**
 * Returns the maximum value in an array of numbers, or 0 if empty.
 */
export function max(arr: number[]): number {
  return arr.length > 0 ? Math.max(...arr) : 0;
}

/**
 * Returns the minimum value in an array of numbers, or 0 if empty.
 */
export function min(arr: number[]): number {
  return arr.length > 0 ? Math.min(...arr) : 0;
}

/**
 * Calculates the factorial of a given number.
 * Used for combination formulas and Poisson computations.
 */
function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Calculates the Poisson distribution probability for exactly k occurrences
 * given a known expected average rate (lambda).
 * 
 * P(k) = (lambda^k * e^-lambda) / k!
 */
export function poissonProbability(lambda: number, k: number): number {
  if (lambda < 0 || k < 0) return 0;
  
  const numerator = Math.pow(lambda, k) * Math.exp(-lambda);
  const denominator = factorial(k);
  
  return numerator / denominator;
}

/**
 * Calculates the Expected Value (EV) of a ticket based on the jackpot, 
 * secondary prize pool, and ticket cost, while factoring in the risk
 * of splitting the jackpot with other winners via Poisson distribution.
 */
export function calculateTrueExpectedValue(
  ticketCost: number,
  jackpotAmount: number,
  jackpotOdds: number,
  ticketsSoldEstimated: number,
  secondaryPrizesEV: number = 0
): number {
  const lambda = ticketsSoldEstimated / jackpotOdds;
  
  // Expected fraction of the jackpot we win if we win (accounts for splitting)
  // E(1/X | X>=1) where X is total winners including us.
  // Approximation for large numbers: (1 - e^-lambda) / lambda
  // This handles the "Sharing the Pot" risk.
  const shareFactor = lambda > 0.01 
    ? (1 - Math.exp(-lambda)) / lambda 
    : 1.0;
  
  const expectedJackpotValue = (jackpotAmount * shareFactor) / jackpotOdds;
  
  return expectedJackpotValue + secondaryPrizesEV - ticketCost;
}
