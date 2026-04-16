/**
 * Returns the theoretical probability for a specific parity pattern (Odd/Even).
 */
export function calculateTheoreticalParity(label: string): number {
  const theoreticalMap: Record<string, number> = {
    '0O/6E': 1.2,
    '1O/5E': 8.5,
    '2O/4E': 23.8,
    '3O/3E': 32.9,
    '4O/2E': 23.8,
    '5O/1E': 8.5,
    '6O/0E': 1.2,
  };
  return theoreticalMap[label] || 0;
}

/**
 * Calculates Poisson probability $P(k;\lambda)$.
 */
export function poissonProbability(lambda: number, k: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;

  let fact = 1;
  for (let i = 2; i <= k; i++) fact *= i;

  return (Math.pow(lambda, k) * Math.exp(-lambda)) / fact;
}

export function combinations(n: number, k: number): number {
  if (n < 0 || k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const realK = k > n / 2 ? n - k : k;
  let result = 1;
  for (let i = 1; i <= realK; i++) result = Math.round((result * (n - i + 1)) / i);
  return result;
}
