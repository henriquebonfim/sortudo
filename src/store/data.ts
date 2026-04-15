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

export const useDataSourceStore = createStore<DataSourceState>('data-source', (set, get) => ({
  source: 'official',
  hasLocalData: false,

  setSource: (source) => set({ source }),
  markLocalReady: (ready = true) => set({ hasLocalData: ready }),

  clearLocalData: async () => {
    await lotteryIdb.clearLocal();
    const { useAnalyticsStore } = await import('@/store/analytics');
    const { useLotteryStore } = await import('@/store/lottery');
    useAnalyticsStore.getState().invalidateStats();
    await useLotteryStore.getState().initialize(true);
    set({ hasLocalData: false, source: 'official' });
  },

  switchTo: async (source) => {
    if (source === get().source) return;
    if (source === 'local') {
      const stored = await lotteryIdb.getLocal();
      if (!stored) return;
      const { useAnalyticsStore } = await import('@/store/analytics');
      // Update lottery store at call-time (not import-time) — avoids circular imports
      const { setState } = await import('@/store/lottery').then((m) => ({
        setState: m.useLotteryStore.setState,
      }));
      useAnalyticsStore.getState().invalidateStats();
      setState({
        games: stored.games,
        metadata: stored.metadata,
        initialized: true,
        error: null,
      });
    } else {
      // Re-fetch official data fresh from network
      const { useLotteryStore } = await import('@/store/lottery');
      const { useAnalyticsStore } = await import('@/store/analytics');
      useAnalyticsStore.getState().invalidateStats();
      await useLotteryStore.getState().initialize(true);
    }
    set({ source });
    // subscribe() in AppProvider picks up games change → auto-triggers analytics
  },
}));
