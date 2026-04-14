import type { Game, SearchResult } from '@/lib/core/types';
import { useLotteryStore } from '@/store/lottery';
import { useSearchStore } from '@/store/search';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { searchCombinationMock } = vi.hoisted(() => ({
  searchCombinationMock: vi.fn(),
}));

vi.mock('@/workers/search', () => ({
  SearchWorkerClient: {
    getInstance: () => ({
      searchCombination: searchCombinationMock,
    }),
  },
}));

const baseGame: Game = {
  id: 42,
  date: '2024-01-01',
  numbers: [1, 2, 3, 4, 5, 6],
  jackpotWinners: 1,
  jackpotPrize: 1_000_000,
  quinaWinners: 10,
  quinaPrize: 10_000,
  quadraWinners: 100,
  quadraPrize: 1_000,
  accumulated: false,
  totalRevenue: 1_000_000,
  prizeEstimate: 0,
  locations: ['SP'],
};

const sampleResult: SearchResult = {
  combination: [1, 2, 3, 4, 5, 6],
  jackpot: [baseGame],
  fiveHits: [],
  fourHits: [],
  threeHits: [],
  totalAnalyzed: 1,
};

// 20% layer: verify cross-module orchestration (store + worker + dependent store).
describe('search store integration', () => {
  beforeEach(() => {
    searchCombinationMock.mockReset();

    useLotteryStore.setState({
      metadata: null,
      games: [baseGame],
      isSeeding: false,
      initialized: true,
      error: null,
    });

    useSearchStore.setState({
      inputs: ['', '', '', '', '', ''],
      contestId: '',
      searchType: 'numbers',
      lastSearchedContestId: null,
      result: null,
      searched: false,
      loading: false,
      error: null,
    });
  });

  it('searches by numbers and stores result state', async () => {
    searchCombinationMock.mockResolvedValue(sampleResult);

    useSearchStore.setState({ inputs: ['6', '5', '4', '3', '2', '1'], searchType: 'numbers' });

    await useSearchStore.getState().search();

    expect(searchCombinationMock).toHaveBeenCalledWith({
      numbers: [1, 2, 3, 4, 5, 6],
      games: [baseGame],
    });

    const state = useSearchStore.getState();
    expect(state.searched).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.result).toEqual(sampleResult);
  });

  it('returns contest-not-found error without worker call', async () => {
    useSearchStore.setState({ searchType: 'contest', contestId: '999' });

    await useSearchStore.getState().search();

    expect(searchCombinationMock).not.toHaveBeenCalled();

    const state = useSearchStore.getState();
    expect(state.error).toBe('Concurso não encontrado.');
    expect(state.loading).toBe(false);
    expect(state.searched).toBe(false);
  });
});
