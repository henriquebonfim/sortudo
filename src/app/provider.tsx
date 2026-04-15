import { lotteryIdb } from '@/lib/core/idb';
import { useAnalyticsStore } from '@/store/analytics';
import { useDataSourceStore } from '@/store/data';
import { useGeneratorStore } from '@/store/generator';
import { useLotteryStore } from '@/store/lottery';
import { SearchWorkerClient } from '@/workers/search';
import { PropsWithChildren, useEffect, useRef } from 'react';

/**
 * Global Application Provider.
 *
 * Composition Root for all cross-store orchestration, bootstrapping, and service injection.
 */
export function AppProvider({ children }: PropsWithChildren) {
  const isLoaded = useRef(false);

  // 1. Sync: Dataset change → auto-recalculate analytics
  useEffect(
    () =>
      useLotteryStore.subscribe(
        (s) => s.games,
        (games) => {
          if (games?.length) {
            useAnalyticsStore.getState().calculateStats().catch(console.error);
          }
        }
      ),
    []
  );
  // 2. DIP: Service Injection into the Generator feature
  useEffect(() => {
    useGeneratorStore.getState().setServices({
      verificationService: (numbers, games) =>
        SearchWorkerClient.getInstance().searchCombination({ numbers, games }),
      statsProvider: () => {
        const stats = useAnalyticsStore.getState().stats;
        return stats
          ? {
              hotNumbers: stats.hotNumbers.map((n) => n.number),
              coldNumbers: stats.frequencies.ranking.slice(-10).map((n) => n.number),
            }
          : null;
      },
    });
  }, []);

  // 3. Boot: Initialize baseline and check local storage
  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    (async () => {
      await useLotteryStore.getState().initialize();
      const stored = await lotteryIdb.getLocal().catch(() => null);
      if (stored) useDataSourceStore.getState().markLocalReady(true);
    })().catch(console.error);
  }, []);

  return <>{children}</>;
}
