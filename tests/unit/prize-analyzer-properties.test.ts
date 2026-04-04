import { PrizeAnalyzer } from '@/domain/lottery/analysis';
import { Draw } from '@/domain/lottery/data/draw';
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';

describe('Domain - PrizeAnalyzer Property Tests', () => {
  const drawArb = fc.record({
    id: fc.integer({ min: 1, max: 10000 }),
    date: fc.date({ min: new Date('1990-01-01'), max: new Date('2030-12-31') }).map(d => {
      try {
        return d.toISOString().split('T')[0];
      } catch (e) {
        return '2020-01-01';
      }
    }),
    numbers: fc.array(fc.integer({ min: 1, max: 60 }), { minLength: 6, maxLength: 6 }),
    jackpotWinners: fc.integer({ min: 0, max: 100 }),
    jackpotPrize: fc.integer({ min: 0, max: 500_000_000 }),
    quinaWinners: fc.integer({ min: 0, max: 1000 }),
    quinaPrize: fc.integer({ min: 0, max: 100_000 }),
    quadraWinners: fc.integer({ min: 0, max: 10000 }),
    quadraPrize: fc.integer({ min: 0, max: 5_000 }),
    accumulated: fc.boolean(),
    totalRevenue: fc.integer({ min: 0, max: 1_000_000_000 }),
  }) as fc.Arbitrary<Draw>;

  describe('calculateMeta Properties', () => {
    it('should always return non-negative statistics', () => {
      fc.assert(
        fc.property(fc.array(drawArb, { minLength: 1, maxLength: 20 }), (draws: Draw[]) => {
          const metadata = {
            totalDraws: draws.length,
            firstDrawDate: draws[0].date,
            lastDrawDate: draws[draws.length - 1].date
          };
          const meta = PrizeAnalyzer.calculateMeta(draws, metadata);

          return (
            meta.totalDraws === draws.length &&
            meta.totalJackpotWinners >= 0 &&
            meta.pctWithoutWinner >= 0 &&
            meta.pctWithoutWinner <= 100 &&
            meta.highestPrize >= 0
          );
        })
      );
    });

    it('should handle empty or missing metadata gracefully (coverage for line 116)', () => {
      const result = PrizeAnalyzer.calculateMeta([], undefined);
      expect(result.totalDraws).toBe(0);
      expect(result.firstDrawDate).toBe('-');
    });
  });

  describe('calculateAccumulationTrend Properties', () => {
    it('percentage accumulated should never exceed 100%', () => {
      fc.assert(fc.property(fc.array(drawArb, { minLength: 1 }), (draws: Draw[]) => {
        const trend = PrizeAnalyzer.calculateAccumulationTrend(draws);
        return trend.every((t: { pctAccumulated: number }) => t.pctAccumulated >= 0 && t.pctAccumulated <= 100);
      }));
    });
  });

  describe('isSpecialDraw Properties', () => {
    it('should only return true for high prizes in December', () => {
      fc.assert(fc.property(drawArb, (draw: Draw) => {
        const result = PrizeAnalyzer.isSpecialDraw(draw);
        const isYearEnd = draw.date.endsWith('-12-31') || draw.date.endsWith('-12-30');
        const isHigh = draw.jackpotPrize > 30_000_000;

        if (result) {
          return isYearEnd && isHigh;
        }
        return true;
      }));
    });
  });
});
