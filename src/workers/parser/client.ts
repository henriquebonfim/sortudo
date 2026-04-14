import type { Game } from '@/workers/core/types';
import {
  LotteryParserCommand,
  LotteryParserCommandSchema,
  LotteryParserCommandType,
  ParseExcelPayload,
  ParseExcelResponseSchema,
} from '@/workers/parser/commands';
import { FeatureWorkerClient } from '@/workers/worker-client';
import { createModuleWorker } from '@/workers/worker-runtime';

export class LotteryParserWorkerClient extends FeatureWorkerClient<LotteryParserCommand, Game[]> {
  private static instance: LotteryParserWorkerClient | null = null;

  private constructor() {
    const worker = createModuleWorker(new URL('./worker.ts', import.meta.url));
    super(worker, 45000, {
      commandSchema: LotteryParserCommandSchema,
      responseSchema: ParseExcelResponseSchema,
    });
  }

  static getInstance(): LotteryParserWorkerClient {
    if (!LotteryParserWorkerClient.instance) {
      LotteryParserWorkerClient.instance = new LotteryParserWorkerClient();
    }
    return LotteryParserWorkerClient.instance;
  }

  async parseExcel(data: ArrayBuffer): Promise<Game[]> {
    const payload: ParseExcelPayload = { data };

    return this.send(
      {
        type: LotteryParserCommandType.PARSE_EXCEL,
        payload,
      },
      [data]
    );
  }
}
