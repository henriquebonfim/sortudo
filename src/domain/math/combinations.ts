/**
 * Calculates the number of combinations (n choose k).
 * Uses an iterative approach to prevent overflow for intermediate values.
 * 
 * @param n - Total number of items (must be non-negative)
 * @param k - Number of items to choose (must be non-negative)
 * @returns The number of combinations
 */
export function combinations(n: number, k: number): number {
  // Input validation
  if (n < 0 || k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  // Use symmetry property: nCr(n, k) = nCr(n, n-k)
  // This minimizes the number of iterations
  const realK = k > n / 2 ? n - k : k;
  
  let result = 1;
  for (let i = 1; i <= realK; i++) {
    // result = result * (n - i + 1) / i
    // We round to handle potential floating point precision issues with division,
    // although combinations are mathematically always integers.
    result = Math.round((result * (n - i + 1)) / i);
  }
  
  return result;
}
