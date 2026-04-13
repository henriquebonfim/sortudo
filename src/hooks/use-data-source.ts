import type { DataSource } from '@/store/data';
import { useDataSourceStore } from '@/store/data';

export type { DataSource };

export function useDataSourceActions() {
  const switchTo = useDataSourceStore((s) => s.switchTo);
  const clearLocalData = useDataSourceStore((s) => s.clearLocalData);
  const markLocalReady = useDataSourceStore((s) => s.markLocalReady);
  const setSource = useDataSourceStore((s) => s.setSource);

  return {
    switchTo,
    clearLocalData,
    markLocalReady,
    setSource,
  };
}
