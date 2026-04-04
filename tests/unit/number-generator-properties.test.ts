import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { NumberGenerator, GenerationMode } from '@/domain/lottery/generators/number-generator';
import { Draw } from '@/domain/lottery/draw.model';

describe('Domain - NumberGenerator Property Tests', () => {
  const modes: GenerationMode[] = [
    'random', 'hot', 'cold', 'sequential', 'dates', 'primes', 'fibonacci', 'winners',
    '0odds-6evens', '1odd-5evens', '2odds-4evens', '3odds-3evens', '4odds-2evens', '5odds-1even', '6odds-0evens'
  ];

  const contextArb = fc.record({
    hotNumbers: fc.array(fc.integer({ min: 1, max: 60 }), { minLength: 10, maxLength: 20 }),
    coldNumbers: fc.array(fc.integer({ min: 1, max: 60 }), { minLength: 10, maxLength: 20 }),
    draws: fc.array(fc.record({
      id: fc.integer(),
      date: fc.string(),
      numbers: fc.array(fc.integer({ min: 1, max: 60 }), { minLength: 6, maxLength: 6 }),
    }) as fc.Arbitrary<Draw>, { minLength: 1, maxLength: 5 }),
  });

  it('should always generate exactly 6 unique numbers between 1 and 60', () => {
    fc.assert(
      fc.property(fc.constantFrom(...modes), contextArb, (mode, ctx) => {
        const numbers = NumberGenerator.generate(mode, ctx);
        
        const isCorrectLength = numbers.length === 6;
        const areInBound = numbers.every(n => n >= 1 && n <= 60);
        const areUnique = new Set(numbers).size === 6;
        const areSorted = numbers.every((n, i) => i === 0 || n >= numbers[i - 1]);

        return isCorrectLength && areInBound && areUnique && areSorted;
      })
    );
  });

  describe('Odd/Even Distribution Properties', () => {
    it('should respect the enforced parity distributions', () => {
      const parityModes: Record<string, number> = {
        '0odds-6evens': 0,
        '1odd-5evens': 1,
        '3odds-3evens': 3,
        '6odds-0evens': 6
      };

      Object.entries(parityModes).forEach(([mode, expectedOdds]) => {
        const numbers = NumberGenerator.generate(mode as GenerationMode, { hotNumbers: [], coldNumbers: [], draws: [] });
        const oddsCount = numbers.filter(n => n % 2 !== 0).length;
        expect(oddsCount).toBe(expectedOdds);
      });
    });
  });

  it('should handle empty context by falling back to full pool (coverage for lines 49, 50, 56)', () => {
    const emptyCtx = { hotNumbers: [], coldNumbers: [], draws: [] };
    
    // Explicitly test branches discovered as "uncovered"
    const hotResult = NumberGenerator.generate('hot', emptyCtx);
    const coldResult = NumberGenerator.generate('cold', emptyCtx);
    const winnersResult = NumberGenerator.generate('winners', emptyCtx);

    expect(hotResult.length).toBe(6);
    expect(coldResult.length).toBe(6);
    expect(winnersResult.length).toBe(6);
  });
});
