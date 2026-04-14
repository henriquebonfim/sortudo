import {
  AnalyticsCommand,
  AnalyticsCommandType,
  AnalyticsSuccessResponse,
  AnalyticsWorkerRequestSchema,
} from '@/workers/analytics/commands';
import { calculateAllStats } from '@/workers/analytics/engine';
import { registerValidatedWorkerHandler } from '@/workers/worker-runtime';

/**
 * Analytics Worker
 * Handles heavy statistical computations for the lottery dashboard.
 */

registerValidatedWorkerHandler<AnalyticsCommand, AnalyticsSuccessResponse>({
  requestSchema: AnalyticsWorkerRequestSchema,
  invalidPayloadMessage: 'Invalid analytics command payload',
  unknownErrorMessage: 'Unknown analytics error',
  handleCommand: ({ id, type, payload }) => {
    switch (type) {
      case AnalyticsCommandType.CALCULATE_STATS:
        return {
          id,
          type: AnalyticsCommandType.CALCULATE_STATS,
          payload: calculateAllStats(payload.games),
        };
      default:
        throw new Error(`Unknown analytics command type: ${type}`);
    }
  },
});
