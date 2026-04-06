import { searchCombination } from '@/features/search/lib/search';
import { SearchCommand, SearchCommandType, SearchCombinationResponse } from './search.commands';

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
    const data = event.data as unknown as Record<string, unknown>;
    const id = typeof data?.id === 'string' ? data.id : 'unknown';
    self.postMessage({
      id,
      type: 'ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
