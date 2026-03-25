import { describe, it, expect } from 'vitest';
import { REAL_DRAWS } from '../fixtures/real-data';

describe('Real Data Parser Validation', () => {
  it('should parse the entire historical dataset correctly', () => {
    // Current count is around 2986+
    expect(REAL_DRAWS.length).toBeGreaterThan(2980);
    
    // Check first draw (Concurso 1)
    const first = REAL_DRAWS[0];
    expect(first.id).toBe(1);
    expect(first.date).toBe('1996-03-11');
    expect(first.numbers).toEqual([4, 5, 30, 33, 41, 52]);
    
    // Check invariants across all draws
    REAL_DRAWS.forEach(c => {
      expect(c.id).toBeGreaterThan(0);
      expect(c.numbers).toHaveLength(6);
      expect(c.numbers.every(b => b >= 1 && b <= 60)).toBe(true);
      // Ensure numbers are sorted (parser responsibility)
      for (let i = 0; i < 5; i++) {
        expect(c.numbers[i]).toBeLessThan(c.numbers[i+1]);
      }
      expect(c.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('should have valid financial and winner data for recent draws', () => {
    const recent = REAL_DRAWS[REAL_DRAWS.length - 1];
    expect(recent.id).toBeGreaterThan(2980);
    // Even if 0 winners, the field should be a number
    expect(typeof recent.jackpotWinners).toBe('number');
    expect(typeof recent.jackpotPrize).toBe('number');
  });
});
