import {
  AnalyticsCommandSchema,
  AnalyticsCommandType,
  AnalyticsWorkerRequestSchema,
} from '@/workers/analytics/commands';
import {
  LotteryParserCommandSchema,
  LotteryParserCommandType,
  LotteryParserWorkerRequestSchema,
} from '@/workers/parser/commands';
import {
  SearchCommandSchema,
  SearchCommandType,
  SearchWorkerRequestSchema,
} from '@/workers/search/commands';
import { describe, expect, it } from 'vitest';
import { makeGame } from '../../fixtures/games';

describe('feature worker command schemas', () => {
  const validGame = makeGame({
    id: 100,
    date: '2024-01-01',
    numbers: [1, 2, 3, 4, 5, 6],
  });

  it('validates analytics command and request envelopes', () => {
    const command = {
      type: AnalyticsCommandType.CALCULATE_STATS,
      payload: { games: [validGame] },
    };

    expect(AnalyticsCommandSchema.parse(command)).toEqual(command);
    expect(
      AnalyticsWorkerRequestSchema.parse({
        id: 'a-1',
        ...command,
      })
    ).toMatchObject({ id: 'a-1' });
  });

  it('validates search command and rejects invalid combination lengths', () => {
    const valid = {
      type: SearchCommandType.SEARCH_COMBINATION,
      payload: { numbers: [1, 2, 3, 4, 5, 6], games: [validGame] },
    };

    expect(SearchCommandSchema.parse(valid)).toEqual(valid);
    expect(
      SearchWorkerRequestSchema.parse({
        id: 's-1',
        ...valid,
      })
    ).toMatchObject({ id: 's-1' });

    expect(() =>
      SearchCommandSchema.parse({
        type: SearchCommandType.SEARCH_COMBINATION,
        payload: { numbers: [1, 2, 3], games: [validGame] },
      })
    ).toThrow();
  });

  it('validates parser command and rejects non-arraybuffer payload', () => {
    const valid = {
      type: LotteryParserCommandType.PARSE_EXCEL,
      payload: { data: new ArrayBuffer(8) },
    };

    expect(LotteryParserCommandSchema.parse(valid)).toEqual(valid);
    expect(
      LotteryParserWorkerRequestSchema.parse({
        id: 'p-1',
        ...valid,
      })
    ).toMatchObject({ id: 'p-1' });

    expect(() =>
      LotteryParserCommandSchema.parse({
        type: LotteryParserCommandType.PARSE_EXCEL,
        payload: { data: 'not-buffer' },
      })
    ).toThrow();
  });
});
