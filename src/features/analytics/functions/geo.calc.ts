import { Game } from '@/lib/lottery/types';
import { calculatePercentage, normalizeStateCode } from '@/lib/lottery/utils';

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
