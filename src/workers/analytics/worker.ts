import { AnalyticsCommand, AnalyticsCommandType, AnalyticsSuccessResponse } from '@/workers/analytics/commands';
import { calculateAllStats } from '@/workers/analytics/engine';
import { createWorkerErrorResponse } from '@/workers/worker-protocol';

/**
 * Analytics Worker
 * Handles heavy statistical computations for the lottery dashboard.
 */

self.onmessage = async (event: MessageEvent<AnalyticsCommand>) => {
  const { id, type, payload } = event.data;

  try {
    switch (type) {
      case AnalyticsCommandType.CALCULATE_STATS: {
        const stats = calculateAllStats(payload.games);
        const response: AnalyticsSuccessResponse = {
          id,
          type: AnalyticsCommandType.CALCULATE_STATS,
          payload: stats,
        };
        self.postMessage(response);
        break;
      }
      default:
        throw new Error(`Unknown analytics command type: ${type}`);
    }
  } catch (error) {
    self.postMessage(createWorkerErrorResponse(id, error, 'Unknown analytics error'));
  }
};
