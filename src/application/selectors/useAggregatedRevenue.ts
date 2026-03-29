import { useLotteryStore } from "@/application/useLotteryStore";
import { useMemo } from "react";

/**
 * Selector hook for aggregated revenue statistics.
 * Decouples calculation logic from the UI (HeroSection).
 */
export function useAggregatedRevenue() {
  const draws = useLotteryStore((state) => state.draws);
  const metadata = useLotteryStore((state) => state.metadata);

  return useMemo(() => {
    if (draws.length === 0) {
      return {
        totalRevenue: 0,
        totalBillions: 0,
        fractionBillions: 0,
        yearsOfOperation: 0,
        drawCount: 0
      };
    }

    const totalRevenue = draws.reduce((acc, draw) => acc + (draw.totalRevenue || 0), 0);
    const totalBillions = Math.floor(totalRevenue / 1_000_000_000);
    const fractionBillions = Math.floor((totalRevenue % 1_000_000_000) / 100_000_000);
    
    const yearsOfOperation = metadata ? 
      new Date(metadata.lastDrawDate).getFullYear() - new Date(metadata.firstDrawDate).getFullYear() : 
      new Date().getFullYear() - 1996;

    return {
      totalRevenue,
      totalBillions,
      fractionBillions,
      yearsOfOperation,
      drawCount: draws.length
    };
  }, [draws, metadata]);
}
