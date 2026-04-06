import { calculateAllStats } from './lib/calculations';
import { Game } from '@/lib/lottery/types';

/**
 * Analytics Worker
 * Handles heavy statistical computations for the lottery dashboard.
 */

self.onmessage = async (e: MessageEvent) => {
  const { id, type, payload } = e.data;

  try {
    if (type === 'CALCULATE_STATS') {
      const { games } = payload as { games: Game[] };
      const stats = calculateAllStats(games);
      self.postMessage({ id, payload: stats });
    } else {
      throw new Error(`Unknown action type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      id,
      error: error instanceof Error ? error.message : 'Unknown analytics error',
    });
  }
};
