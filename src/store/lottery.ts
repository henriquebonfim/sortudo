import { lotteryIdb } from '@/lib/core/idb';
import { Game, LotteryMetadata } from '@/lib/core/types';
import { createStore } from '@/lib/zustand';
import { fetchLotteryData } from '@/services/lottery';
import { LotteryParserWorkerClient } from '@/workers/parser';

export { LotteryParserWorkerClient } from '@/workers/parser';
export interface LotteryState {
  metadata: LotteryMetadata | null;
  games: Game[];
  isSeeding: boolean;
  initialized: boolean;
  error: string | null;

  // Actions
  initialize: (force?: boolean) => Promise<void>;
  loadFromFile: (file: File) => Promise<void>;
}

const buildMetadata = (games: Game[]): LotteryMetadata => ({
  totalGames: games.length,
  firstGameDate: games[0]?.date || '',
  lastGameDate: games[games.length - 1]?.date || '',
  lastUpdate: new Date().toISOString(),
});

export const useLotteryStore = createStore<LotteryState>('lottery', (set, get) => ({
  metadata: null,
  games: [],
  isSeeding: false,
  initialized: false,
  error: null,

  initialize: async (force = false) => {
    if (get().initialized && !force) return;

    set({ isSeeding: true, error: null });
    try {
      const { games, metadata } = await fetchLotteryData();

      set({ games, metadata, initialized: true });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to initialize' });
    } finally {
      set({ isSeeding: false });
    }
  },

  loadFromFile: async (file: File) => {
    set({ isSeeding: true, error: null });
    try {
      const buffer = await file.arrayBuffer();
      const games = await LotteryParserWorkerClient.getInstance().parseExcel(buffer);

      if (games.length === 0) {
        throw new Error('Nenhum jogo encontrado no arquivo.');
      }

      const metadata = buildMetadata(games);

      await lotteryIdb.saveLocal(games, metadata);

      set({ games, metadata, initialized: true });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Falha ao processar arquivo' });
      throw err;
    } finally {
      set({ isSeeding: false });
    }
  },
}));
