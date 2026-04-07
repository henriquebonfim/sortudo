import { createStore } from '@/lib/zustand';
import { useLotteryStore } from '@/store/lottery';
import { SearchWorkerClient } from './search.client';
import type { SearchResult } from '@/lib/lottery/types';

interface SearchState {
  inputs: string[];
  result: SearchResult | null;
  searched: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  setInput: (idx: number, val: string) => void;
  resetInputs: (initial?: string[]) => void;
  search: () => Promise<void>;
}

export const useSearchStore = createStore<SearchState>('search', (set, get) => ({
  inputs: ['', '', '', '', '', ''],
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

  resetInputs: (initial) => {
    set({
      inputs: initial || ['', '', '', '', '', ''],
      result: null,
      searched: false,
      loading: false,
      error: null,
    });
  },

  search: async () => {
    const { inputs } = get();
    const numbers = inputs
      .map((v) => parseInt(v, 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    if (numbers.length !== 6) return;

    set({ loading: true, error: null });

    try {
      const games = useLotteryStore.getState().games;
      const result = await SearchWorkerClient.getInstance().searchCombination({
        numbers,
        games,
      });

      set({ result, searched: true, loading: false });
    } catch (err) {
      console.error('Search failed:', err);
      const error = err instanceof Error ? err.message : 'Search failed unexpectedly';
      set({ loading: false, error, searched: true });
    }
  },
}));
