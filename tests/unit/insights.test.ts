import { describe, it, expect } from 'vitest';
import { StatisticsService } from '@/domain/lottery/statistics.service';
import { Draw } from '@/domain/lottery/draw.model';

describe('StatisticsService (Unit Tests for Insights)', () => {
  it('should correctly calculate overlaps, geographical winners, and low/high split', () => {
    const mockData: Draw[] = [
      {
        id: 1,
        date: '2024-01-01',
        numbers: [1, 2, 3, 4, 10, 20],
        jackpotWinners: 0,
        jackpotPrize: 0,
        quinaWinners: 0,
        quinaPrize: 0,
        quadraWinners: 0,
        quadraPrize: 0,
        accumulated: true,
        totalRevenue: 1000,
        prizeEstimate: 0,
        accumulatedJackpot: 500
      },
      {
        id: 2,
        date: '2024-01-08',
        numbers: [1, 5, 6, 7, 30, 40],
        jackpotWinners: 1,
        jackpotPrize: 5000,
        quinaWinners: 0,
        quinaPrize: 0,
        quadraWinners: 0,
        quadraPrize: 0,
        accumulated: false,
        totalRevenue: 2000,
        prizeEstimate: 0,
        locations: ['CAMPINAS/SP'],
      },
      {
        id: 3,
        date: '2024-01-15',
        numbers: [11, 12, 13, 14, 15, 60],
        jackpotWinners: 2,
        jackpotPrize: 3000,
        quinaWinners: 0,
        quinaPrize: 0,
        quadraWinners: 0,
        quadraPrize: 0,
        accumulated: false,
        totalRevenue: 8000,
        prizeEstimate: 0,
        locations: ['SAO PAULO/SP', 'RIO DE JANEIRO/RJ'],
      }
    ];

    const stats = StatisticsService.calculateAllStats(mockData);

    expect(stats).toBeDefined();

    // 1. Math Overlaps
    const overlaps = stats.numberProfile.drawOverlaps;
    expect(overlaps.one).toBe(50);
    expect(overlaps.zero).toBe(50);

    // 2. Geographical Winners
    expect(stats.geoWinners).toHaveLength(2); // SP, RJ
    expect(stats.geoWinners.find(g => g.state === 'SP')).toBeDefined();
    
    // 3. Low/High Split
    expect(stats.numberProfile.lowHighSplit.low).toBe(88.89);
  });
});
