import { GameSchema, LotteryStatsSchema } from '@/lib/core/schemas';
import type { Game, LotteryStats } from '@/workers/core/types';
import {
  createWorkerCommandSchema,
  createWorkerRequestSchema,
  type WorkerRequest,
  type WorkerSuccessResponse,
} from '@/workers/worker-protocol';
import { z } from 'zod';

export enum AnalyticsCommandType {
  CALCULATE_STATS = 'CALCULATE_STATS',
}

export interface CalculateStatsPayload {
  games: Game[];
}

const CalculateStatsPayloadSchema = z.object({
  games: z.array(GameSchema),
});

export const AnalyticsCommandSchema = createWorkerCommandSchema(
  z.literal(AnalyticsCommandType.CALCULATE_STATS),
  CalculateStatsPayloadSchema
);

export const AnalyticsWorkerRequestSchema = createWorkerRequestSchema(
  z.literal(AnalyticsCommandType.CALCULATE_STATS),
  CalculateStatsPayloadSchema
);

export const AnalyticsResponseSchema = LotteryStatsSchema;

export type AnalyticsCommand = WorkerRequest<
  AnalyticsCommandType.CALCULATE_STATS,
  CalculateStatsPayload
>;

export type AnalyticsSuccessResponse = WorkerSuccessResponse<
  AnalyticsCommandType.CALCULATE_STATS,
  LotteryStats
>;
