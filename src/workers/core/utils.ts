export const BRAZIL_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

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

export function standardDeviation(arr: number[]): number {
  if (arr.length === 0) return 0;
  const m = mean(arr);
  const variance = arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

export function round(v: number, d = 1): number {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function getYear(date: string): number {
  return parseInt(date.substring(0, 4), 10);
}

export function getDecade(date: string): string {
  const y = getYear(date);
  return `${Math.floor(y / 10) * 10}`;
}

export function countMatches(draw: number[], combination: number[]): number {
  const drawSet = new Set(draw);
  return combination.filter((n) => drawSet.has(n)).length;
}

export function normalizeStateCode(loc: string): string | null {
  const text = loc.toUpperCase().trim();

  if (
    text.includes('CANAL ELETR') ||
    text.includes('ELECT') ||
    text.includes('ONLINE') ||
    text.includes('INTERNET') ||
    text.includes('CANAL')
  ) {
    return 'ONLINE';
  }

  const parenMatch = text.match(/\(([A-Z]{2})\)$/);
  if (parenMatch && BRAZIL_STATES.includes(parenMatch[1] as (typeof BRAZIL_STATES)[number])) {
    return parenMatch[1];
  }

  const parts = text.split(/[/ -]/);
  const lastSegment = parts[parts.length - 1].trim();
  if (BRAZIL_STATES.includes(lastSegment as (typeof BRAZIL_STATES)[number])) {
    return lastSegment;
  }

  if (BRAZIL_STATES.includes(text as (typeof BRAZIL_STATES)[number])) {
    return text;
  }

  return null;
}
