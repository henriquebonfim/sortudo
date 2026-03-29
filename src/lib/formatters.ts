/**
 * Domain-level number and currency formatting utilities.
 * Separated from ui/cn utilities by concern.
 */

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}k`;
  return `R$ ${value.toFixed(0)}`;
}

export function calculatePercentage(value: number, total: number, decimals = 1): number {
  if (!total) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value / total) * 100 * factor) / factor;
}

export function round(value: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

/**
 * Extracts year from YYYY-MM-DD string.
 */
export function getYear(date: string): number {
  return parseInt(date.substring(0, 4), 10);
}

/**
 * Extracts decade string (e.g., "1990s") from YYYY-MM-DD string.
 */
export function getDecade(date: string): string {
  const year = getYear(date);
  const decade = Math.floor(year / 10) * 10;
  return `Década de ${String(decade).substring(2)}`;
}
