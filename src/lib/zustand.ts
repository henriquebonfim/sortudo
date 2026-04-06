import { create, StateCreator } from 'zustand';
import { devtools, persist, PersistOptions, subscribeWithSelector } from 'zustand/middleware';

/**
 * Factory for a standard store with DevTools and SubscribeWithSelector.
 *
 * Using 'any' for the middleware list to allow flexible composition without
 * complex generic propagation in every store file.
 */
export function createStore<T extends object>(name: string, fn: StateCreator<T, [], []>) {
  return create<T>()(subscribeWithSelector(devtools(fn, { name })));
}

/**
 * Factory for a persisted store with DevTools, SubscribeWithSelector and optional partialization.
 */
export function createPersistedStore<T extends object, P>(
  name: string,
  fn: StateCreator<T, [], []>,
  partialize?: (s: T) => P
) {
  const persistOptions: PersistOptions<T, P> = {
    name,
    partialize,
    version: 1,
  };

  return create<T>()(subscribeWithSelector(devtools(persist(fn, persistOptions), { name })));
}
