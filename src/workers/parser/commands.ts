import { GameSchema } from '@/lib/core/schemas';
import type { Game } from '@/workers/core/types';
import {
  createWorkerCommandSchema,
  createWorkerRequestSchema,
  type WorkerRequest,
  type WorkerSuccessResponse,
} from '@/workers/worker-protocol';
import { z } from 'zod';

export enum LotteryParserCommandType {
  PARSE_EXCEL = 'PARSE_EXCEL',
}

export interface ParseExcelPayload {
  data: ArrayBuffer;
}

const ParseExcelPayloadSchema = z.object({
  data: z.instanceof(ArrayBuffer),
});

export const LotteryParserCommandSchema = createWorkerCommandSchema(
  z.literal(LotteryParserCommandType.PARSE_EXCEL),
  ParseExcelPayloadSchema
);

export const LotteryParserWorkerRequestSchema = createWorkerRequestSchema(
  z.literal(LotteryParserCommandType.PARSE_EXCEL),
  ParseExcelPayloadSchema
);

export const ParseExcelResponseSchema = z.array(GameSchema);

export type ParseExcelCommand = WorkerRequest<
  LotteryParserCommandType.PARSE_EXCEL,
  ParseExcelPayload
>;

export type LotteryParserCommand = ParseExcelCommand;

export type ParseExcelResponse = WorkerSuccessResponse<
  LotteryParserCommandType.PARSE_EXCEL,
  Game[]
>;
