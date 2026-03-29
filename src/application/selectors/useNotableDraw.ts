import { useLotteryStore } from "@/application/useLotteryStore";
import { useMemo } from "react";
import type { Draw } from "@/domain/lottery/lottery.types";

/**
 * Selector hook for finding the most notable draw (highest revenue).
 * Decouples sorting and finding logic from the UI (CaseStudy).
 */
export function useNotableDraw(): Draw | null {
  const draws = useLotteryStore((state) => state.draws);

  return useMemo(() => {
    if (draws.length === 0) return null;
    
    // Create a shallow copy before sorting to avoid mutating the store's array
    return [...draws].sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))[0] || null;
  }, [draws]);
}
