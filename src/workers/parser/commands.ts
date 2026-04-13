import type { Game } from '@/workers/core/types';
import type { WorkerRequest, WorkerSuccessResponse } from '@/workers/worker-protocol';

export enum LotteryParserCommandType {
  PARSE_EXCEL = 'PARSE_EXCEL',
}

export interface ParseExcelPayload {
  data: ArrayBuffer;
}

export type ParseExcelCommand = WorkerRequest<
  LotteryParserCommandType.PARSE_EXCEL,
  ParseExcelPayload
>;

export type LotteryParserCommand = ParseExcelCommand;

export type ParseExcelResponse = WorkerSuccessResponse<
  LotteryParserCommandType.PARSE_EXCEL,
  Game[]
>;
