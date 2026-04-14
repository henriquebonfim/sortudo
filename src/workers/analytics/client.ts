import {
  AnalyticsCommand,
  AnalyticsCommandSchema,
  AnalyticsCommandType,
  AnalyticsResponseSchema,
} from '@/workers/analytics/commands';
import type { Game, LotteryStats } from '@/workers/core/types';
import { FeatureWorkerClient } from '@/workers/worker-client';
import { createModuleWorker } from '@/workers/worker-runtime';

/**
 * Feature-specific worker client for the Analytics domain.
 * Manages the analytics worker lifecycle and provides a clean Promise-based API.
 */
export class AnalyticsWorkerClient extends FeatureWorkerClient<AnalyticsCommand, LotteryStats> {
  private static instance: AnalyticsWorkerClient | null = null;

  // Uses Vite's worker import syntax
  private constructor() {
    const worker = createModuleWorker(new URL('./worker.ts', import.meta.url));
    super(worker, 45000, {
      commandSchema: AnalyticsCommandSchema,
      responseSchema: AnalyticsResponseSchema,
    });
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
