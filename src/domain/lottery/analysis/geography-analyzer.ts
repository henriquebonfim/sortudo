import { calculatePercentage } from '@/lib';
import { Draw } from '../data/draw';

const CANAL_ELETRONICO_DISPLAY = 'Canal Eletrônico';
const CANAL_ELETRONICO_KEY = 'ELECT';

export class GeographyAnalyzer {
  static calculateGeoWinners(draws: Draw[]) {
    const counts: Record<string, number> = {};
    let totalEntries = 0;

    for (const d of draws) {
      if (!d.locations || d.locations.length === 0) continue;

      for (const location of d.locations) {
        if (location === CANAL_ELETRONICO_DISPLAY) {
          counts[CANAL_ELETRONICO_KEY] = (counts[CANAL_ELETRONICO_KEY] || 0) + 1;
          totalEntries++;
          continue;
        }

        const parts = location.split('/');
        const uf = parts.length > 1 ? parts[1].trim() : undefined;

        if (uf && /^[A-Z]{2}$/.test(uf)) {
          counts[uf] = (counts[uf] || 0) + 1;
          totalEntries++;
        }
      }
    }

    return Object.entries(counts)
      .map(([state, total]) => ({
        state,
        total,
        percentage: calculatePercentage(total, totalEntries)
      }))
      .sort((a, b) => b.total - a.total);
  }
}
