/**
 * Calculates the number of combinations (n choose k).
 * Uses an iterative approach to prevent overflow for intermediate values.
 * 
 * @param n - Total number of items
 * @param k - Number of items to choose
 * @returns The number of combinations
 */
export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) {
    return 0;
  }
  if (k === 0 || k === n) {
    return 1;
  }
  if (k > n / 2) {
    k = n - k;
  }
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = Math.round((res * (n - i + 1)) / i);
  }
  return res;
}
