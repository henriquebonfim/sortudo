import { createStore, del, get, set } from 'idb-keyval';
import type { Game, LotteryMetadata } from './types';

interface LocalSnapshot {
  games: Game[];
  metadata: LotteryMetadata;
  savedAt: string;
}

// Isolated store — won't collide with anything else
const idbStore = createStore('sortudo-local-data', 'snapshots');

/**
 * Persisted Storage Layer (IndexedDB)
 *
 * Safely manages our large local datasets without the 5MB limit of localStorage.
 */
export const lotteryIdb = {
  saveLocal: async (games: Game[], metadata: LotteryMetadata): Promise<void> => {
    try {
      await set(
        'local',
        { games, metadata, savedAt: new Date().toISOString() } satisfies LocalSnapshot,
        idbStore
      );
    } catch (e) {
      console.error('Failed to save to IndexedDB. Persistence disabled.', e);
      // Fail silently to the caller; we just don't have persistence.
    }
  },

  getLocal: async (): Promise<LocalSnapshot | undefined> => {
    try {
      return await get<LocalSnapshot>('local', idbStore);
    } catch (e) {
      console.warn('Failed to read from IndexedDB.', e);
      return undefined;
    }
  },

  clearLocal: async (): Promise<void> => {
    try {
      await del('local', idbStore);
    } catch (e) {
      console.error('Failed delete IDB entry.', e);
    }
  },
};
