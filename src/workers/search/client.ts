import type { SearchResult } from '@/workers/core/types';
import {
  SearchCombinationPayload,
  SearchCommand,
  SearchCommandSchema,
  SearchCommandType,
  SearchResponseSchema,
} from '@/workers/search/commands';
import { FeatureWorkerClient } from '@/workers/worker-client';
import { createModuleWorker } from '@/workers/worker-runtime';

/**
 * Feature-specific worker client for the Search domain.
 * Manages the search worker lifecycle and provides a clean Promise-based API.
 */
export class SearchWorkerClient extends FeatureWorkerClient<SearchCommand, SearchResult> {
  private static instance: SearchWorkerClient | null = null;

  // Uses Vite's worker import syntax
  private constructor() {
    const worker = createModuleWorker(new URL('./worker.ts', import.meta.url));
    super(worker, 45000, {
      commandSchema: SearchCommandSchema,
      responseSchema: SearchResponseSchema,
    });
  }

  static getInstance(): SearchWorkerClient {
    if (!SearchWorkerClient.instance) {
      SearchWorkerClient.instance = new SearchWorkerClient();
    }
    return SearchWorkerClient.instance;
  }

  /**
   * Performs a history lookup for the given combination against all games.
   */
  async searchCombination(payload: SearchCombinationPayload): Promise<SearchResult> {
    return this.send({
      type: SearchCommandType.SEARCH_COMBINATION,
      payload,
    });
  }
}
