import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeGame } from '../../fixtures/games';

const { fetchLotteryDataMock, parseExcelMock, saveLocalMock } = vi.hoisted(() => ({
  fetchLotteryDataMock: vi.fn(),
  parseExcelMock: vi.fn(),
  saveLocalMock: vi.fn(),
}));

vi.mock('@/services/lottery', () => ({
  fetchLotteryData: fetchLotteryDataMock,
}));

vi.mock('@/workers/parser', () => ({
  LotteryParserWorkerClient: {
    getInstance: () => ({
      parseExcel: parseExcelMock,
    }),
  },
}));

vi.mock('@/lib/core/idb', () => ({
  lotteryIdb: {
    saveLocal: saveLocalMock,
  },
}));

import { useLotteryStore } from '@/store/lottery';

describe.sequential('lottery store', () => {
  beforeEach(() => {
    fetchLotteryDataMock.mockReset();
    parseExcelMock.mockReset();
    saveLocalMock.mockReset();

    useLotteryStore.setState({
      metadata: null,
      games: [],
      isSeeding: false,
      initialized: false,
      error: null,
    });
  });

  it('skips initialization when already initialized unless forced', async () => {
    useLotteryStore.setState({
      metadata: null,
      games: [],
      isSeeding: false,
      initialized: true,
      error: null,
    });

    await useLotteryStore.getState().initialize();

    expect(fetchLotteryDataMock).not.toHaveBeenCalled();
    expect(useLotteryStore.getState().isSeeding).toBe(false);
  });

  it('initializes games and metadata from the fetch service', async () => {
    const game = makeGame({
      id: 1,
      date: '2024-01-01',
      numbers: [1, 2, 3, 4, 5, 6],
    });
    const metadata = {
      totalGames: 1,
      firstGameDate: game.date,
      lastGameDate: game.date,
      lastUpdate: '2024-01-02T00:00:00.000Z',
    };

    fetchLotteryDataMock.mockResolvedValue({ games: [game], metadata, stats: null });

    await useLotteryStore.getState().initialize(true);

    expect(fetchLotteryDataMock).toHaveBeenCalledTimes(1);
    expect(useLotteryStore.getState()).toMatchObject({
      games: [game],
      metadata,
      initialized: true,
      error: null,
      isSeeding: false,
    });
  });

  it('stores a readable error when initialization fails', async () => {
    fetchLotteryDataMock.mockRejectedValue(new Error('network down'));

    await useLotteryStore.getState().initialize(true);

    expect(useLotteryStore.getState()).toMatchObject({
      error: 'network down',
      initialized: false,
      isSeeding: false,
    });
  });

  it('loads a local file, persists it, and marks the store initialized', async () => {
    const game = makeGame({
      id: 2,
      date: '2024-01-02',
      numbers: [7, 8, 9, 10, 11, 12],
    });
    parseExcelMock.mockResolvedValue([game]);

    const file = new File(['mock xlsx bytes'], 'games.xlsx');

    await useLotteryStore.getState().loadFromFile(file);

    expect(parseExcelMock).toHaveBeenCalledTimes(1);
    expect(saveLocalMock).toHaveBeenCalledWith(
      [game],
      expect.objectContaining({
        totalGames: 1,
        firstGameDate: game.date,
        lastGameDate: game.date,
      })
    );
    expect(useLotteryStore.getState()).toMatchObject({
      games: [game],
      initialized: true,
      error: null,
      isSeeding: false,
    });
  });

  it('surfaces an error when the local file contains no games', async () => {
    parseExcelMock.mockResolvedValue([]);
    const file = new File(['mock xlsx bytes'], 'empty.xlsx');

    await expect(useLotteryStore.getState().loadFromFile(file)).rejects.toThrow(
      'Nenhum jogo encontrado no arquivo.'
    );

    expect(useLotteryStore.getState()).toMatchObject({
      error: 'Nenhum jogo encontrado no arquivo.',
      isSeeding: false,
    });
    expect(saveLocalMock).not.toHaveBeenCalled();
  });
});
