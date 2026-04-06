/**
 * Home-page math for analogies and metrics.
 */
export function calculateHitChance(total: number, multiplier: number): number {
  return Math.round(total / multiplier);
}

export function calculateCoinOdds(count: number): number {
  return Math.pow(2, count) / 2;
}
