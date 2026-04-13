import { combinations } from '@/lib/analytics';
import {
  BALLS_PER_DRAW,
  MAX_LOTTERY_NUMBER,
  REVENUE_ALLOCATION,
  TICKET_PRICE,
  TOTAL_COMBINATIONS,
} from '@/shared/constants';
import { useLotteryStore } from '@/store/lottery';
import { useMemo } from 'react';

export function useLotteryMath() {
  return useMemo(() => {
    const prizeReturn = REVENUE_ALLOCATION.PRIZE_POOL || 0.4379;
    const expectedValue = TICKET_PRICE * prizeReturn;

    return {
      expectedReturn: {
        betAmount: TICKET_PRICE,
        expectedValue,
        loss: TICKET_PRICE - expectedValue,
        percentageLoss: Math.round((1 - prizeReturn) * 100),
        returnPercentage: Math.round(prizeReturn * 100),
      },
      chancePerNumber: (BALLS_PER_DRAW / MAX_LOTTERY_NUMBER) * 100,
      combosTable: Array.from({ length: 15 }, (_, i) => {
        const n = i + 6;
        return { n, combos: combinations(n, 6), label: `${n}` };
      }),
      ticketPrice: TICKET_PRICE,
      thresholdDraws: Math.round(TOTAL_COMBINATIONS / 2),
      thresholdCost: Math.round(TOTAL_COMBINATIONS / 2) * TICKET_PRICE,
    };
  }, []);
}

export function useAggregatedRevenue() {
  const games = useLotteryStore((s) => s.games);
  const metadata = useLotteryStore((s) => s.metadata);

  return useMemo(() => {
    let totalRevenue = 0;
    let totalJackpotWinners = 0;
    let totalPrizeDistributed = 0;

    for (const game of games) {
      totalRevenue += game.totalRevenue || 0;
      totalJackpotWinners += game.jackpotWinners || 0;
      totalPrizeDistributed +=
        game.jackpotWinners * game.jackpotPrize +
        game.quinaWinners * game.quinaPrize +
        game.quadraWinners * game.quadraPrize;
    }

    const totalBillions = Math.floor(totalRevenue / 1_000_000_000);
    const fractionBillions = Math.floor((totalRevenue % 1_000_000_000) / 1_000_000);

    const firstYear = metadata?.firstGameDate
      ? new Date(metadata.firstGameDate).getFullYear()
      : 1996;
    const lastYear = metadata?.lastGameDate
      ? new Date(metadata.lastGameDate).getFullYear()
      : new Date().getFullYear();
    const yearsOfOperation = lastYear - firstYear;

    return {
      totalRevenue,
      totalBillions,
      fractionBillions,
      drawCount: games.length,
      yearsOfOperation,
      totalJackpotWinners,
      totalPrizeDistributed,
    };
  }, [games, metadata]);
}

export function useNotableGame() {
  const games = useLotteryStore((s) => s.games);
  return useMemo(() => {
    if (games.length === 0) return null;
    return [...games].sort((a, b) => (b.jackpotPrize || 0) - (a.jackpotPrize || 0))[0];
  }, [games]);
}
