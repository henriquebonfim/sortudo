import {
  LotteryParserCommand,
  LotteryParserCommandType,
  ParseExcelResponse,
} from '@/workers/parser/commands';
import { parseExcelToGames } from '@/workers/parser/engine';
import { createWorkerErrorResponse } from '@/workers/worker-protocol';

self.onmessage = async (event: MessageEvent<LotteryParserCommand>) => {
  const { id, type, payload } = event.data;

  try {
    switch (type) {
      case LotteryParserCommandType.PARSE_EXCEL: {
        const games = parseExcelToGames(payload.data);
        const response: ParseExcelResponse = {
          id,
          type: LotteryParserCommandType.PARSE_EXCEL,
          payload: games,
        };
        self.postMessage(response);
        break;
      }
      default:
        throw new Error(`Unknown parser command type: ${type}`);
    }
  } catch (error) {
    self.postMessage(createWorkerErrorResponse(id, error, 'Unknown parser error'));
  }
};
