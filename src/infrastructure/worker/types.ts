import type { Draw, SearchResult } from '@/domain/lottery/data/draw';

// ─── Worker Commands & Types ───────────────────────────────────────────────────

export enum WorkerCommandType {
  SEARCH_COMBINATION = 'SEARCH_COMBINATION',
}

export interface SearchCombinationPayload {
  numbers: number[];
  draws: Draw[];
}

export interface SearchCombinationCommand {
  type: WorkerCommandType.SEARCH_COMBINATION;
  payload: SearchCombinationPayload;
}

export type WorkerCommand = SearchCombinationCommand;

// ─── Responses ────────────────────────────────────────────────────────────────

export interface SearchCombinationResponse {
  type: WorkerCommandType.SEARCH_COMBINATION;
  payload: SearchResult;
}

export interface WorkerErrorResponse {
  type: 'ERROR';
  error: string;
}

export type WorkerResponse = SearchCombinationResponse | WorkerErrorResponse;
