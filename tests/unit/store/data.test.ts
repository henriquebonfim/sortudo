import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeGame } from '../../fixtures/games';

const { clearLocalMock, getLocalMock, invalidateStatsMock, initializeMock, lotterySetStateMock } =
  vi.hoisted(() => ({
    clearLocalMock: vi.fn(),
    getLocalMock: vi.fn(),
    invalidateStatsMock: vi.fn(),
    initializeMock: vi.fn(),
    lotterySetStateMock: vi.fn(),
  }));

vi.mock('@/lib/core/idb', () => ({
  lotteryIdb: {
    clearLocal: clearLocalMock,
    getLocal: getLocalMock,
  },
}));

vi.mock('@/store/analytics', () => ({
  useAnalyticsStore: {
    getState: () => ({
      invalidateStats: invalidateStatsMock,
    }),
  },
}));

vi.mock('@/store/lottery', () => ({
  useLotteryStore: {
    getState: () => ({
      initialize: initializeMock,
    }),
    setState: lotterySetStateMock,
  },
}));

import { useDataSourceStore } from '@/store/data';

describe.sequential('data source store', () => {
  beforeEach(() => {
    clearLocalMock.mockReset();
    getLocalMock.mockReset();
    invalidateStatsMock.mockReset();
    initializeMock.mockReset();
    lotterySetStateMock.mockReset();

    useDataSourceStore.setState({ source: 'official', hasLocalData: false });
  });

  it('updates source flags through direct actions', () => {
    useDataSourceStore.getState().setSource('local');
    useDataSourceStore.getState().markLocalReady();

    expect(useDataSourceStore.getState()).toMatchObject({
      source: 'local',
      hasLocalData: true,
    });

    useDataSourceStore.getState().markLocalReady(false);

    expect(useDataSourceStore.getState().hasLocalData).toBe(false);
  });

  it('switches to local data when stored games are available', async () => {
    const storedGame = makeGame({
      id: 1,
      date: '2024-01-01',
      numbers: [1, 2, 3, 4, 5, 6],
    });

    getLocalMock.mockResolvedValue({
      games: [storedGame],
      metadata: {
        totalGames: 1,
        firstGameDate: storedGame.date,
        lastGameDate: storedGame.date,
        lastUpdate: '2024-01-02T00:00:00.000Z',
      },
    });

    await useDataSourceStore.getState().switchTo('local');

    expect(getLocalMock).toHaveBeenCalledTimes(1);
    expect(invalidateStatsMock).toHaveBeenCalledTimes(1);
    expect(lotterySetStateMock).toHaveBeenCalledWith({
      games: [storedGame],
      metadata: {
        totalGames: 1,
        firstGameDate: storedGame.date,
        lastGameDate: storedGame.date,
        lastUpdate: '2024-01-02T00:00:00.000Z',
      },
      initialized: true,
      error: null,
    });
    expect(useDataSourceStore.getState().source).toBe('local');
  });

  it('ignores a local switch when there is no stored data', async () => {
    getLocalMock.mockResolvedValue(null);

    await useDataSourceStore.getState().switchTo('local');

    expect(getLocalMock).toHaveBeenCalledTimes(1);
    expect(invalidateStatsMock).not.toHaveBeenCalled();
    expect(lotterySetStateMock).not.toHaveBeenCalled();
    expect(useDataSourceStore.getState().source).toBe('official');
  });

  it('reinitializes official data when switching back to official', async () => {
    initializeMock.mockResolvedValue(undefined);
    useDataSourceStore.setState({ source: 'local', hasLocalData: true });

    await useDataSourceStore.getState().switchTo('official');

    expect(invalidateStatsMock).toHaveBeenCalledTimes(1);
    expect(initializeMock).toHaveBeenCalledWith(true);
    expect(useDataSourceStore.getState().source).toBe('official');
  });

  it('clears local data and resets the source to official', async () => {
    clearLocalMock.mockResolvedValue(undefined);
    initializeMock.mockResolvedValue(undefined);

    await useDataSourceStore.getState().clearLocalData();

    expect(clearLocalMock).toHaveBeenCalledTimes(1);
    expect(invalidateStatsMock).toHaveBeenCalledTimes(1);
    expect(initializeMock).toHaveBeenCalledWith(true);
    expect(useDataSourceStore.getState()).toMatchObject({
      source: 'official',
      hasLocalData: false,
    });
  });
});
