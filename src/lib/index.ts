import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CHART_COLORS } from '@/components/lottery/chart.constants';

// ─── UI Utilities ────────────────────────────────────────────────────────────

/**
 * Merges Tailwind CSS class names. Shadcn/ui convention.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Formatting Utilities ─────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}k`;
  return `R$ ${value.toFixed(0)}`;
}

const pow10 = (decimals: number) => Math.pow(10, decimals);

export function calculatePercentage(value: number, total: number, decimals = 1): number {
  if (!total) return 0;
  const factor = pow10(decimals);
  return Math.round((value / total) * 100 * factor) / factor;
}

export function round(value: number, decimals = 1): number {
  const factor = pow10(decimals);
  return Math.round(value * factor) / factor;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/** Extracts year from YYYY-MM-DD string. */
export function getYear(date: string): number {
  return parseInt(date.substring(0, 4), 10);
}

/** Extracts decade string (e.g., "Década de 90") from YYYY-MM-DD string. */
export function getDecade(date: string): string {
  const year = getYear(date);
  const decade = Math.floor(year / 10) * 10;
  return `Década de ${String(decade).substring(2)}`;
}

// ─── Visual Utilities ─────────────────────────────────────────────────────────

/**
 * Maps a frequency value to an interpolated color on a cold→warm gradient.
 */
export function getBallColor(freq: number, min: number, max: number): string {
  const t = max === min ? 0.5 : (freq - min) / (max - min);
  if (t < 0.33) return interpolate(CHART_COLORS.BLUE, CHART_COLORS.GREEN, t / 0.33);
  if (t < 0.66) return interpolate(CHART_COLORS.GREEN, CHART_COLORS.AMBER, (t - 0.33) / 0.33);
  return interpolate(CHART_COLORS.AMBER, CHART_COLORS.RED, (t - 0.66) / 0.34);
}

function interpolate(a: string, b: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ] as const;
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(ab + (bb - ab) * t)})`;
}

// ─── Infrastructure Utilities ─────────────────────────────────────────────────

/**
 * Triggers a browser file download of the given data serialized as JSON.
 */
export function downloadAsJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
