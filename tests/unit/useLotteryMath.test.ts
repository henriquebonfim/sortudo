import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLotteryMath } from '@/application/selectors';
import { TICKET_PRICE, TOTAL_COMBINATIONS } from '@/domain/lottery/lottery.constants';

// Mock dependencies if necessary, but since they are pure logic we can test their integration
vi.mock('@/domain/lottery/services', () => ({
  RevenueService: {
    calculateExpectedReturn: vi.fn((price) => ({
      betAmount: price,
      expectedValue: price * 0.43,
      loss: price * 0.57,
      percentageLoss: 57,
      returnPercentage: 43
    }))
  }
}));

describe('useLotteryMath', () => {
  it('should return correct mathematical constants and derived calculations', () => {
    // We can use renderHook from @testing-library/react if available, 
    // or just execute it as a function since it relies on useMemo (React might complain without a dispatcher, but testing-library handles it)
    const { result } = renderHook(() => useLotteryMath());

    expect(result.current.ticketPrice).toBe(TICKET_PRICE);
    expect(result.current.expectedReturn.expectedValue).toBe(TICKET_PRICE * 0.43);
    
    // thresholdDraws = Math.round(TOTAL_COMBINATIONS / 2)
    expect(result.current.thresholdDraws).toBe(Math.round(TOTAL_COMBINATIONS / 2));
    
    // thresholdCost = thresholdDraws * TICKET_PRICE
    expect(result.current.thresholdCost).toBe(result.current.thresholdDraws * TICKET_PRICE);
    
    expect(result.current.combosTable).toBeDefined();
    expect(Array.isArray(result.current.combosTable)).toBe(true);
  });
});
