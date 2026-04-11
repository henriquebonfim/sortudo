import { LotteryMetadata } from '@/lib/lottery/types';
import { useMemo } from 'react';

/**
 * Hook to manage analytics-specific metadata presentation logic.
 */
export function useAnalyticsMetadata(metadata: LotteryMetadata | null) {
  const isStale = useMemo(() => {
    if (!metadata?.lastUpdate) return false;
    const last = new Date(metadata.lastUpdate).getTime();
    const now = new Date().getTime();
    return now - last > 7 * 24 * 60 * 60 * 1000;
  }, [metadata]);

  const freshnessLabel = useMemo(() => {
    if (!metadata?.lastUpdate) return null;
    const days = Math.floor(
      (new Date().getTime() - new Date(metadata.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return 'Atualizado hoje';
    if (days === 1) return 'Atualizado ontem';
    return `Há ${Math.abs(days)} dias`;
  }, [metadata]);

  return {
    isStale,
    freshnessLabel,
  };
}
