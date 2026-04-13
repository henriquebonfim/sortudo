import { lotteryIdb } from '@/lib/core/idb';
import { createStore } from '@/lib/zustand';

export type DataSource = 'official' | 'local';

interface DataSourceState {
  source: DataSource;
  hasLocalData: boolean;
  // Actions
  setSource: (source: DataSource) => void;
  markLocalReady: (ready?: boolean) => void;
  switchTo: (source: DataSource) => Promise<void>;
  clearLocalData: () => Promise<void>;
}

export const useDataSourceStore = createStore<DataSourceState>('data-source', (set) => ({
  source: 'official',
  hasLocalData: false,

  setSource: (source) => set({ source }),
  markLocalReady: (ready = true) => set({ hasLocalData: ready }),

  clearLocalData: async () => {
    await lotteryIdb.clearLocal();
    set({ hasLocalData: false, source: 'official' });
  },

  switchTo: async (source) => {
    if (source === 'local') {
      const stored = await lotteryIdb.getLocal();
      if (!stored) return;
      // Update lottery store at call-time (not import-time) — avoids circular imports
      const { setState } = await import('@/store/lottery').then((m) => ({
        setState: m.useLotteryStore.setState,
      }));
      setState({
        games: stored.games,
        metadata: stored.metadata,
        initialized: true,
        error: null,
      });
    } else {
      // Re-fetch official data fresh from network
      const { useLotteryStore } = await import('@/store/lottery');
      await useLotteryStore.getState().initialize(true);
    }
    set({ source });
    // subscribe() in AppProvider picks up games change → auto-triggers analytics
  },
}));
