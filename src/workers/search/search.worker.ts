import {
  SearchCombinationResponse,
  SearchCommand,
  SearchCommandType,
} from '@/workers/search/commands';
import { searchCombination } from '@/workers/search/engine';
import { createWorkerErrorResponse } from '@/workers/worker-protocol';

self.onmessage = async (event: MessageEvent<SearchCommand>) => {
  try {
    const { id, type, payload } = event.data;

    switch (type) {
      case SearchCommandType.SEARCH_COMBINATION: {
        const result = await searchCombination(payload.numbers, payload.games);
        const response: SearchCombinationResponse = {
          id,
          type: SearchCommandType.SEARCH_COMBINATION,
          payload: result,
        };
        self.postMessage(response);
        break;
      }
      default:
        throw new Error(`Unknown search command type: ${type}`);
    }
  } catch (error) {
    self.postMessage(createWorkerErrorResponse(event.data.id, error, 'Unknown search error'));
  }
};
