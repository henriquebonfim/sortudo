import {
  SearchCombinationResponse,
  SearchCommand,
  SearchCommandType,
  SearchWorkerRequestSchema,
} from '@/workers/search/commands';
import { searchCombination } from '@/workers/search/engine';
import { registerValidatedWorkerHandler } from '@/workers/worker-runtime';

registerValidatedWorkerHandler<SearchCommand, SearchCombinationResponse>({
  requestSchema: SearchWorkerRequestSchema,
  invalidPayloadMessage: 'Invalid search command payload',
  unknownErrorMessage: 'Unknown search error',
  handleCommand: async ({ id, type, payload }) => {
    switch (type) {
      case SearchCommandType.SEARCH_COMBINATION:
        return {
          id,
          type: SearchCommandType.SEARCH_COMBINATION,
          payload: await searchCombination(payload.numbers, payload.games),
        };
      default:
        throw new Error(`Unknown search command type: ${type}`);
    }
  },
});
