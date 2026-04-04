// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useAggregatedRevenue } from "@/application/selectors";
import { useLotteryStore } from "@/application/useLotteryStore";

describe("useAggregatedRevenue", () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useLotteryStore.setState({ draws: [], metadata: null });
  });

  it("returns default values when draws array is empty", () => {
    const { result } = renderHook(() => useAggregatedRevenue());

    expect(result.current).toEqual({
      totalRevenue: 0,
      totalBillions: 0,
      fractionBillions: 0,
      yearsOfOperation: 0,
      drawCount: 0
    });
  });

  it("calculates aggregated statistics accurately for given draws", () => {
    useLotteryStore.setState({
      draws: [
        {
          id: 1,
          date: "2024-01-01",
          totalRevenue: 1_200_000_000, // 1.2 Billion
          jackpotWinners: 2,
          jackpotPrize: 50_000_000, // 100M total
          quinaWinners: 100,
          quinaPrize: 50_000,       // 5M total
          quadraWinners: 1000,
          quadraPrize: 1_000,       // 1M total
          drawNumbers: [1,2,3,4,5,6]
        },
        {
          id: 2,
          date: "2024-01-08",
          totalRevenue: 2_550_000_000, // 2.55 Billion
          jackpotWinners: 0,
          jackpotPrize: 0,
          quinaWinners: 10,
          quinaPrize: 50_000,       // 500k total
          quadraWinners: 200,
          quadraPrize: 1_000,       // 200k total
          drawNumbers: [1,2,3,4,5,6]
        }
      ],
      metadata: {
        totalDraws: 2,
        firstDrawDate: "1996-03-11",
        lastDrawDate: "2024-01-08",
        highestPrizeDrawId: 1
      }
    });

    const { result } = renderHook(() => useAggregatedRevenue());

    // Total Revenue: 1.2B + 2.55B = 3.75B
    expect(result.current.totalRevenue).toBe(3_750_000_000);
    expect(result.current.totalBillions).toBe(3);
    // 750M / 100M = 7.5, floor = 7
    expect(result.current.fractionBillions).toBe(7);
    
    // Years of Operation: 2024 - 1996 = 28
    expect(result.current.yearsOfOperation).toBe(28);
    expect(result.current.drawCount).toBe(2);

    expect(result.current.totalJackpotWinners).toBe(2);
    // Prizes: (100M + 5M + 1M) + (0 + 0.5M + 0.2M) = 106M + 0.7M = 106.7M
    expect(result.current.totalPrizeDistributed).toBe(106_700_000);
  });
});
