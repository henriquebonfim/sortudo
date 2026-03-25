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
