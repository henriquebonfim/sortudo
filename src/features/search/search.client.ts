import { FeatureWorkerClient } from '@/lib/worker-client';
import {
  SearchCommand,
  SearchCommandType,
  SearchResponse,
  SearchCombinationPayload,
} from './search.commands';
import type { SearchResult } from '@/lib/lottery/types';

/**
 * Feature-specific worker client for the Search domain.
 * Manages the search worker lifecycle and provides a clean Promise-based API.
 */
export class SearchWorkerClient extends FeatureWorkerClient<SearchCommand, SearchResult> {
  private static instance: SearchWorkerClient | null = null;

  // Uses Vite's worker import syntax
  private constructor() {
    const worker = new Worker(new URL('./search.worker.ts', import.meta.url), { type: 'module' });
    super(worker);
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
