import { searchCombination } from '@/domain/lottery/search-engine';
import { WorkerCommand, WorkerCommandType, WorkerResponse } from './types';

self.onmessage = async (event: MessageEvent<WorkerCommand>) => {
  try {
    const { type, payload } = event.data;

    switch (type) {
      case WorkerCommandType.SEARCH_COMBINATION: {
        const result = await searchCombination(payload.numbers, payload.draws);
        const response: WorkerResponse = {
          type: WorkerCommandType.SEARCH_COMBINATION,
          payload: result,
        };
        self.postMessage(response);
        break;
      }
      default:
        throw new Error(`Unknown command type: ${(event.data as WorkerCommand).type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
