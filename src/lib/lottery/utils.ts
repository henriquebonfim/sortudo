// --- Utilities ---
export function calculatePercentage(part: number, total: number, decimals: number = 1): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100 * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function sortGamesById<T extends { id?: number }>(games: T[]): T[] {
  return [...games].sort((a, b) => (a.id || 0) - (b.id || 0));
}

export function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function mean(arr: number[]): number {
  return arr.length === 0 ? 0 : sum(arr) / arr.length;
}

export function max(arr: number[]): number {
  return arr.length > 0 ? Math.max(...arr) : 0;
}

export function min(arr: number[]): number {
  return arr.length > 0 ? Math.min(...arr) : 0;
}

export function standardDeviation(arr: number[]): number {
  if (arr.length === 0) return 0;
  const m = mean(arr);
  const variance = arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

export function round(v: number, d = 1) {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function getYear(date: string) {
  return parseInt(date.substring(0, 4), 10);
}

export function getDecade(date: string) {
  const y = getYear(date);
  return `${Math.floor(y / 10) * 10}`;
}

// --- Formatting ---
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}k`;
  return `R$ ${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

// --- Combinatorics ---
export function combinations(n: number, k: number): number {
  if (n < 0 || k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const realK = k > n / 2 ? n - k : k;
  let result = 1;
  for (let i = 1; i <= realK; i++) result = Math.round((result * (n - i + 1)) / i);
  return result;
}
