import { FeatureWorkerClient } from '@/lib/worker-client';
import type { LotteryStats, Game } from '@/lib/lottery/types';

/**
 * Commands for the Analytics worker.
 */
export enum AnalyticsCommandType {
  CALCULATE_STATS = 'CALCULATE_STATS',
}

export interface AnalyticsCommand {
  type: AnalyticsCommandType;
  payload: { games: Game[] };
}

/**
 * Feature-specific worker client for the Analytics domain.
 * Manages the analytics worker lifecycle and provides a clean Promise-based API.
 */
export class AnalyticsWorkerClient extends FeatureWorkerClient<AnalyticsCommand, LotteryStats> {
  private static instance: AnalyticsWorkerClient | null = null;

  // Uses Vite's worker import syntax
  private constructor() {
    const worker = new Worker(new URL('./analytics.worker.ts', import.meta.url), {
      type: 'module',
    });
    super(worker);
  }

  static getInstance(): AnalyticsWorkerClient {
    if (!AnalyticsWorkerClient.instance) {
      AnalyticsWorkerClient.instance = new AnalyticsWorkerClient();
    }
    return AnalyticsWorkerClient.instance;
  }

  /**
   * Calculates all statistics from the provided games.
   */
  async calculateStats(payload: { games: Game[] }): Promise<LotteryStats> {
    return this.send({
      type: AnalyticsCommandType.CALCULATE_STATS,
      payload,
    });
  }
}
