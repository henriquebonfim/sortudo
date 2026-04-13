import type { Game } from '@/workers/core/types';
import { BRAZIL_STATES, calculatePercentage } from '@/workers/core/utils';
function normalizeStateCode(loc: string): string | null {
  const text = loc.toUpperCase().trim();

  if (text.includes('CANAL ELETR') || text === 'ELECT' || text.includes('INTERNET')) {
    return 'ELECT';
  }
  const parenMatch = text.match(/\(([A-Z]{2})\)$/);
  if (parenMatch && BRAZIL_STATES.includes(parenMatch[1] as any)) return parenMatch[1];

  // Check for common separators: 'CIDADE/UF' or 'CIDADE-UF'
  const parts = text.split(/[/ -]/);
  const lastSegment = parts[parts.length - 1].trim();
  if (BRAZIL_STATES.includes(lastSegment as any)) return lastSegment;

  // Direct match if it's just the state code
  if (BRAZIL_STATES.includes(text as any)) return text;

  return null;
}

export function calculateGeoWinners(games: Game[]) {
  const geoMap: Record<string, number> = {};

  for (const game of games) {
    const winners = game.jackpotWinners || 0;
    if (winners === 0 || !game.locations?.length) continue;

    const weight = winners / game.locations.length;

    for (const loc of game.locations) {
      const state = normalizeStateCode(loc);
      if (state) {
        geoMap[state] = (geoMap[state] || 0) + weight;
      }
    }
  }

  const grandTotal = Object.values(geoMap).reduce((a, b) => a + b, 0) || 1;

  return Object.entries(geoMap)
    .map(([state, total]) => ({
      state,
      total: Math.round(total),
      percentage: calculatePercentage(total, grandTotal, 1),
    }))
    .sort((a, b) => b.total - a.total);
}
