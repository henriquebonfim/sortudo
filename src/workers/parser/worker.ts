import {
  LotteryParserCommand,
  LotteryParserCommandType,
  LotteryParserWorkerRequestSchema,
  ParseExcelResponse,
} from '@/workers/parser/commands';
import { parseExcelToGames } from '@/workers/parser/engine';
import { registerValidatedWorkerHandler } from '@/workers/worker-runtime';

registerValidatedWorkerHandler<LotteryParserCommand, ParseExcelResponse>({
  requestSchema: LotteryParserWorkerRequestSchema,
  invalidPayloadMessage: 'Invalid parser command payload',
  unknownErrorMessage: 'Unknown parser error',
  handleCommand: ({ id, type, payload }) => {
    switch (type) {
      case LotteryParserCommandType.PARSE_EXCEL:
        return {
          id,
          type: LotteryParserCommandType.PARSE_EXCEL,
          payload: parseExcelToGames(payload.data),
        };
      default:
        throw new Error(`Unknown parser command type: ${type}`);
    }
  },
});
