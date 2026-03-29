import { useMemo } from 'react';
import { 
  TICKET_PRICE, 
  BALLS_PER_DRAW, 
  MAX_LOTTERY_NUMBER,
  TOTAL_COMBINATIONS
} from '@/domain/lottery/lottery.constants';
import { RevenueService } from '@/domain/lottery/revenue.service';
import { getCombosTable } from '@/domain/math/combinations.utils';

/**
 * Selector for lottery-related mathematical calculations.
 * Centralizes probability, expected return, and combinatorial data.
 */
export function useLotteryMath() {
  const calculations = useMemo(() => {
    const expectedReturn = RevenueService.calculateExpectedReturn(TICKET_PRICE);
    const chancePerNumber = (BALLS_PER_DRAW / MAX_LOTTERY_NUMBER) * 100;
    const combosTable = getCombosTable();
    const thresholdDraws = Math.round(TOTAL_COMBINATIONS / 2);
    const thresholdCost = thresholdDraws * TICKET_PRICE;

    return {
      expectedReturn,
      chancePerNumber,
      combosTable,
      ticketPrice: TICKET_PRICE,
      thresholdDraws,
      thresholdCost,
    };
  }, []);

  return calculations;
}
