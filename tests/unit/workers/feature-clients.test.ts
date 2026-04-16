import { AnalyticsWorkerClient } from '@/workers/analytics/client';
import { AnalyticsCommandType } from '@/workers/analytics/commands';
import { LotteryParserWorkerClient } from '@/workers/parser/client';
import { LotteryParserCommandType } from '@/workers/parser/commands';
import { SearchWorkerClient } from '@/workers/search/client';
import { SearchCommandType } from '@/workers/search/commands';
import { FeatureWorkerClient } from '@/workers/worker-client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeGame } from '../../fixtures/games';

class FakeWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();

  constructor(_url: URL, _options: WorkerOptions) {}
}

describe.sequential('feature worker clients', () => {
  beforeEach(() => {
    vi.stubGlobal('Worker', FakeWorker as unknown as typeof Worker);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('wires analytics worker commands and preserves singleton instance', async () => {
    const sendSpy = vi.spyOn(FeatureWorkerClient.prototype as never, 'send').mockResolvedValue({
      ok: true,
    } as never);

    const client = AnalyticsWorkerClient.getInstance();
    expect(AnalyticsWorkerClient.getInstance()).toBe(client);

    const games = [makeGame({ id: 1, date: '2024-01-01', numbers: [1, 2, 3, 4, 5, 6] })];
    const result = await client.calculateStats({ games });

    expect(result).toEqual({ ok: true });
    expect(sendSpy).toHaveBeenCalledWith({
      type: AnalyticsCommandType.CALCULATE_STATS,
      payload: { games },
    });
  });

  it('wires search worker commands and preserves singleton instance', async () => {
    const sendSpy = vi.spyOn(FeatureWorkerClient.prototype as never, 'send').mockResolvedValue({
      combination: [1, 2, 3, 4, 5, 6],
      jackpot: [],
      fiveHits: [],
      fourHits: [],
      threeHits: [],
      totalAnalyzed: 0,
    } as never);

    const client = SearchWorkerClient.getInstance();
    expect(SearchWorkerClient.getInstance()).toBe(client);

    const games = [makeGame({ id: 2, date: '2024-01-02', numbers: [1, 2, 3, 4, 5, 6] })];
    const result = await client.searchCombination({ numbers: [1, 2, 3, 4, 5, 6], games });

    expect(result).toMatchObject({ combination: [1, 2, 3, 4, 5, 6] });
    expect(sendSpy).toHaveBeenCalledWith({
      type: SearchCommandType.SEARCH_COMBINATION,
      payload: { numbers: [1, 2, 3, 4, 5, 6], games },
    });
  });

  it('wires parser worker commands and transfers the buffer', async () => {
    const sendSpy = vi
      .spyOn(FeatureWorkerClient.prototype as never, 'send')
      .mockResolvedValue([
        makeGame({ id: 3, date: '2024-01-03', numbers: [1, 2, 3, 4, 5, 6] }),
      ] as never);

    const client = LotteryParserWorkerClient.getInstance();
    expect(LotteryParserWorkerClient.getInstance()).toBe(client);

    const buffer = new ArrayBuffer(8);
    const result = await client.parseExcel(buffer);

    expect(result).toHaveLength(1);
    expect(sendSpy).toHaveBeenCalledWith(
      {
        type: LotteryParserCommandType.PARSE_EXCEL,
        payload: { data: buffer },
      },
      [buffer]
    );
  });
});
