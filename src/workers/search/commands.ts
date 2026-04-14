import { GameSchema, SearchResultSchema } from '@/lib/core/schemas';
import type { Game, SearchResult } from '@/workers/core/types';
import {
  createWorkerCommandSchema,
  createWorkerRequestSchema,
  type WorkerRequest,
  type WorkerSuccessResponse,
} from '@/workers/worker-protocol';
import { z } from 'zod';

// ─── Worker Commands & Types ───────────────────────────────────────────────────

export enum SearchCommandType {
  SEARCH_COMBINATION = 'SEARCH_COMBINATION',
}

export interface SearchCombinationPayload {
  numbers: number[];
  games: Game[];
}

const SearchCombinationPayloadSchema = z.object({
  numbers: z.array(z.number().int().min(1).max(60)).length(6),
  games: z.array(GameSchema),
});

export const SearchCommandSchema = createWorkerCommandSchema(
  z.literal(SearchCommandType.SEARCH_COMBINATION),
  SearchCombinationPayloadSchema
);

export const SearchWorkerRequestSchema = createWorkerRequestSchema(
  z.literal(SearchCommandType.SEARCH_COMBINATION),
  SearchCombinationPayloadSchema
);

export const SearchResponseSchema = SearchResultSchema;

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
