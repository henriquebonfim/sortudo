import { Draw } from '@/domain/lottery/draw.model';
import { calculatePercentage } from '@/lib/formatters';

export class GeographyAnalyzer {
  static calculateGeoWinners(draws: Draw[]) {
    const counts: Record<string, number> = {};
    let totalWinnersParsed = 0;

    for (const d of draws) {
      if (!d.locations || d.locations.length === 0) continue;
      
      for (const locationRaw of d.locations) {
        if (locationRaw.toUpperCase().includes("CANAL ELETRONICO")) {
          counts["ELECT"] = (counts["ELECT"] || 0) + 1;
          totalWinnersParsed++;
          continue;
        }

        const matches = [...locationRaw.matchAll(/\/([A-Z]{2})|^([A-Z]{2})$/gm)];
        if (matches.length > 0) {
          for (const match of matches) {
            const uf = match[1] || match[2];
            if (uf) {
              counts[uf] = (counts[uf] || 0) + 1;
              totalWinnersParsed++;
            }
          }
        } else {
          const tokens = locationRaw.split(/[/,;\s]+/).map(token => token.trim());
          for (const token of tokens) {
            if (/^[A-Z]{2}$/.test(token)) {
              counts[token] = (counts[token] || 0) + 1;
              totalWinnersParsed++;
            }
          }
        }
      }
    }

    return Object.entries(counts)
      .map(([state, total]) => ({ 
        state, 
        total,
        percentage: calculatePercentage(total, totalWinnersParsed)
      }))
      .sort((a, b) => b.total - a.total);
  }
}
