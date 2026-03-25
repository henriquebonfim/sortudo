import { REVENUE_ALLOCATION } from '@/domain/lottery/lottery.constants';

export class RevenueService {
  static calculateExpectedReturn(betAmount: number) {
    const prizeReturn = REVENUE_ALLOCATION.PRIZE_POOL;
    const expectedValue = betAmount * prizeReturn;
    const loss = betAmount - expectedValue;
    const percentageLoss = (loss / betAmount) * 100;

    return {
      betAmount,
      expectedValue,
      loss,
      percentageLoss: Math.round(percentageLoss),
      returnPercentage: Math.round(prizeReturn * 100),
    };
  }
}
