import type { Game, SearchResult } from '@/workers/core/types';
import type { WorkerRequest, WorkerSuccessResponse } from '@/workers/worker-protocol';

// ─── Worker Commands & Types ───────────────────────────────────────────────────

export enum SearchCommandType {
  SEARCH_COMBINATION = 'SEARCH_COMBINATION',
}

export interface SearchCombinationPayload {
  numbers: number[];
  games: Game[];
}

export type SearchCombinationCommand = WorkerRequest<
  SearchCommandType.SEARCH_COMBINATION,
  SearchCombinationPayload
>;

export type SearchCommand = SearchCombinationCommand;

// ─── Responses ────────────────────────────────────────────────────────────────

export type SearchCombinationResponse = WorkerSuccessResponse<
  SearchCommandType.SEARCH_COMBINATION,
  SearchResult
>;
