import type { Game, LotteryStats } from '@/workers/core/types';
import type { WorkerRequest, WorkerSuccessResponse } from '@/workers/worker-protocol';

export enum AnalyticsCommandType {
  CALCULATE_STATS = 'CALCULATE_STATS',
}

export interface CalculateStatsPayload {
  games: Game[];
}

export type AnalyticsCommand = WorkerRequest<
  AnalyticsCommandType.CALCULATE_STATS,
  CalculateStatsPayload
>;

export type AnalyticsSuccessResponse = WorkerSuccessResponse<
  AnalyticsCommandType.CALCULATE_STATS,
  LotteryStats
>;
