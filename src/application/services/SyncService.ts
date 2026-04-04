import { DrawMapper } from '@/domain/lottery/draw';
import { StatisticsService } from '@/domain/lottery/services';
import { Draw, LotteryMetadata } from '@/domain/lottery/draw';
import { LotteryStats } from '@/domain/lottery/draw';

interface SyncData {
  draws: Draw[];
  stats: LotteryStats | null;
  metadata: LotteryMetadata | null;
}

export class SyncService {
  /**
   * Fetches the latest lottery data and calculates statistics.
   * Centralizes logical flow between repository and domain analyzers.
   */
  static async fetchLatestData(): Promise<SyncData> {
    try {
      const res = await fetch('/data.json');
      if (!res.ok) throw new Error('Failed to load static data');
      const data = await res.json();
      
      const rawDraws = data.draws || data.concursos || [];
      const draws = DrawMapper.toDomainList(rawDraws);
      
      const metadata = DrawMapper.extractMetadata(data, draws);
      const stats = draws.length > 0 ? StatisticsService.calculateAllStats(draws) : null;

      return {
        draws,
        stats,
        metadata
      };
    } catch (err) {
      console.error('SyncService error:', err);
      throw err;
    }
  }
}
