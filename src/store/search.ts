import type { SearchResult } from '@/lib/core/types';
import { createStore } from '@/lib/zustand';
import { useLotteryStore } from '@/store/lottery';
import { SearchWorkerClient } from '@/workers/search';

interface SearchState {
  inputs: string[];
  contestId: string;
  searchType: 'numbers' | 'contest';
  lastSearchedContestId: string | null;
  result: SearchResult | null;
  searched: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  setInput: (idx: number, val: string) => void;
  setContestId: (id: string) => void;
  setSearchType: (type: 'numbers' | 'contest') => void;
  resetInputs: (initial?: string[] | string) => void;
  search: () => Promise<void>;
}

export const useSearchStore = createStore<SearchState>('search', (set, get) => ({
  inputs: ['', '', '', '', '', ''],
  contestId: '',
  searchType: 'numbers',
  lastSearchedContestId: null,
  result: null,
  searched: false,
  loading: false,
  error: null,

  setInput: (idx, val) => {
    set((state) => {
      const inputs = [...state.inputs];
      inputs[idx] = val;
      return { inputs };
    });
  },

  setContestId: (id) => set({ contestId: id }),

  setSearchType: (type) =>
    set({
      searchType: type,
      result: null,
      searched: false,
      error: null,
      lastSearchedContestId: null,
    }),

  resetInputs: (initial) => {
    if (typeof initial === 'string') {
      set({
        searchType: 'contest',
        contestId: initial,
        lastSearchedContestId: initial,
        inputs: ['', '', '', '', '', ''],
        result: null,
        searched: false,
        loading: false,
        error: null,
      });
    } else {
      set({
        searchType: 'numbers',
        inputs: initial || ['', '', '', '', '', ''],
        contestId: '',
        lastSearchedContestId: null,
        result: null,
        searched: false,
        loading: false,
        error: null,
      });
    }
  },

  search: async () => {
    const { inputs, contestId, searchType, loading } = get();

    if (loading) return;

    set({ loading: true, error: null });

    try {
      const games = useLotteryStore.getState().games;
      const client = SearchWorkerClient.getInstance();
      let result: SearchResult | null = null;
      let searchedId: string | null = null;

      if (searchType === 'numbers') {
        const numbers = inputs
          .map((v) => parseInt(v, 10))
          .filter((n) => !isNaN(n))
          .sort((a, b) => a - b);

        if (numbers.length !== 6) {
          set({ loading: false });
          return;
        }

        result = await client.searchCombination({
          numbers,
          games,
        });
      } else {
        const id = parseInt(contestId, 10);
        if (isNaN(id)) {
          set({ loading: false });
          return;
        }

        const game = games.find((g) => g.id === id);
        if (game) {
          searchedId = id.toString();
          result = await client.searchCombination({
            numbers: game.numbers,
            games,
          });
        } else {
          set({ error: 'Concurso não encontrado.', loading: false });
          return;
        }
      }

      set({ result, searched: true, loading: false, lastSearchedContestId: searchedId });
    } catch (err) {
      console.error('Search failed:', err);
      set({
        loading: false,
        error: err instanceof Error ? err.message : 'Falha ao buscar resultados.',
      });
    }
  },
}));
