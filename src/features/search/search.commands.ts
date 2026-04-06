import type { Game, SearchResult } from '@/lib/lottery/types';

// ─── Worker Commands & Types ───────────────────────────────────────────────────

export enum SearchCommandType {
  SEARCH_COMBINATION = 'SEARCH_COMBINATION',
}

export interface SearchCombinationPayload {
  numbers: number[];
  games: Game[];
}

export interface SearchCombinationCommand {
  id: string;
  type: SearchCommandType.SEARCH_COMBINATION;
  payload: SearchCombinationPayload;
}

export type SearchCommand = SearchCombinationCommand;

// ─── Responses ────────────────────────────────────────────────────────────────

export interface SearchCombinationResponse {
  id: string;
  type: SearchCommandType.SEARCH_COMBINATION;
  payload: SearchResult;
}

export interface SearchErrorResponse {
  id: string;
  type: 'ERROR';
  error: string;
}

export type SearchResponse = SearchCombinationResponse | SearchErrorResponse;
