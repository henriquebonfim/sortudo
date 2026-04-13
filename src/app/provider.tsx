import { lotteryIdb } from '@/lib/core/idb';
import { useDataSourceStore } from '@/store/data';
import { useLotteryStore } from '@/store/lottery';
import { PropsWithChildren, useEffect, useRef } from 'react';

/**
 * Global Application Provider.
 *
 * Composition Root for all cross-store orchestration, bootstrapping, and service injection.
 */
export function AppProvider({ children }: PropsWithChildren) {
  const isLoaded = useRef(false);

  // ── 1. subscribe: dataset change → auto-recalculate analytics ──
  // Using reference check on (s) => s.games ensures that even same-length files
  // will trigger a recalculation if the array reference changed.
  // useEffect(() => {
  //   return useLotteryStore.subscribe(
  //     (s) => s.games,
  //     (newGames, prevGames) => {
  //       if (!newGames || newGames.length === 0) return;
  //       // force recalculate if replacing existing data (switching sources or new upload)
  //       const force = prevGames && prevGames.length > 0;
  //       useAnalyticsStore.getState().calculateStats(force).catch(console.error);
  //     }
  //   );
  // }, []);

  // // ── 2. DIP: Service Injection into the Generator feature ──
  // useEffect(() => {
  //   useGeneratorStore.getState().setServices({
  //     verificationService: (numbers, games) =>
  //       SearchWorkerClient.getInstance().searchCombination({ numbers, games }),
  //     statsProvider: () => {
  //       const stats = useAnalyticsStore.getState().stats;
  //       if (!stats) return null;
  //       return {
  //         hotNumbers: stats.hotNumbers.map((n: { number: number }) => n.number),
  //         coldNumbers: stats.frequencies.ranking
  //           .slice(-10)
  //           .map((n: { number: number }) => n.number),
  //       };
  //     },
  //   });
  // }, []);

  // ── 3. Boot: System initialization ──
  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    async function boot() {
      // 1. Always fetch official baseline (fast static file)
      await useLotteryStore.getState().initialize();

      // 2. Check if user has a persistent local dataset
      try {
        const stored = await lotteryIdb.getLocal();
        if (stored) {
          useDataSourceStore.getState().markLocalReady(true);
          // Note: we don't switch source automatically; official data is preferred on direct load
        }
      } catch (e) {
        console.warn('IDB restoration failed. Restricted environment?', e);
      }
    }
    boot().catch(console.error);
  }, []);

  return <>{children}</>;
}
