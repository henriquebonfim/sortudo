import type { Draw } from '@/domain/lottery/data/draw';
import type { GenerationContext } from '@/domain/lottery/generators/number-generator';
import { NumberGenerator } from '@/domain/lottery/generators/number-generator';
import { PRIMES } from '@/domain/lottery/lottery.constants';
import { describe, expect, it } from 'vitest';

const MOCK_DRAW: Draw = {
  id: 1,
  date: '2024-01-01',
  numbers: [10, 20, 30, 40, 50, 60],
  jackpotWinners: 0,
  jackpotPrize: 0,
  quinaWinners: 0,
  quinaPrize: 0,
  quadraWinners: 0,
  quadraPrize: 0,
  accumulated: false,
  totalRevenue: 0,
  prizeEstimate: 0,
};

const HOT_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const COLD_NUMBERS = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];

const CTX: GenerationContext = {
  hotNumbers: HOT_NUMBERS,
  coldNumbers: COLD_NUMBERS,
  draws: [MOCK_DRAW],
};

function isValidCombination(nums: number[]): boolean {
  return (
    nums.length === 6 &&
    new Set(nums).size === 6 &&
    nums.every((n) => n >= 1 && n <= 60)
  );
}

describe('NumberGenerator', () => {
  it('generates exactly 6 unique numbers in [1,60] for random mode', () => {
    for (let i = 0; i < 20; i++) {
      const result = NumberGenerator.generate('random', CTX);
      expect(isValidCombination(result)).toBe(true);
    }
  });

  it('sequential mode always returns [1,2,3,4,5,6]', () => {
    const result = NumberGenerator.generate('sequential', CTX);
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('winners mode returns a real historical draw', () => {
    const result = NumberGenerator.generate('winners', CTX);
    expect(result).toEqual([10, 20, 30, 40, 50, 60]);
  });

  it('winners mode with no draws falls back to random', () => {
    const ctx: GenerationContext = { ...CTX, draws: [] };
    const result = NumberGenerator.generate('winners', ctx);
    expect(isValidCombination(result)).toBe(true);
  });

  it('hot mode only picks from hotNumbers pool', () => {
    for (let i = 0; i < 20; i++) {
      const result = NumberGenerator.generate('hot', CTX);
      expect(result.every((n) => HOT_NUMBERS.includes(n))).toBe(true);
      expect(isValidCombination(result)).toBe(true);
    }
  });

  it('cold mode only picks from coldNumbers pool', () => {
    for (let i = 0; i < 20; i++) {
      const result = NumberGenerator.generate('cold', CTX);
      expect(result.every((n) => COLD_NUMBERS.includes(n))).toBe(true);
      expect(isValidCombination(result)).toBe(true);
    }
  });

  it('primes mode only picks prime numbers', () => {
    for (let i = 0; i < 20; i++) {
      const result = NumberGenerator.generate('primes', CTX);
      expect(result.every((n) => PRIMES.includes(n))).toBe(true);
      expect(isValidCombination(result)).toBe(true);
    }
  });

  it('fibonacci mode only picks fibonacci numbers', () => {
    const FIB = [1, 2, 3, 5, 8, 13, 21, 34, 55];
    for (let i = 0; i < 20; i++) {
      const result = NumberGenerator.generate('fibonacci', CTX);
      expect(result.every((n) => FIB.includes(n))).toBe(true);
      expect(isValidCombination(result)).toBe(true);
    }
  });

  it('dates mode only picks numbers 1–31', () => {
    for (let i = 0; i < 20; i++) {
      const result = NumberGenerator.generate('dates', CTX);
      expect(result.every((n) => n >= 1 && n <= 31)).toBe(true);
      expect(isValidCombination(result)).toBe(true);
    }
  });

  it.each([
    ['3odds-3evens', 3, 3],
    ['2odds-4evens', 2, 4],
    ['4odds-2evens', 4, 2],
    ['0odds-6evens', 0, 6],
    ['6odds-0evens', 6, 0],
    ['1odd-5evens', 1, 5],
    ['5odds-1even', 5, 1],
  ] as const)('%s mode produces exactly %i odds and %i evens', (mode, expectedOdds, expectedEvens) => {
    for (let i = 0; i < 10; i++) {
      const result = NumberGenerator.generate(mode, CTX);
      const odds = result.filter((n) => n % 2 !== 0).length;
      const evens = result.filter((n) => n % 2 === 0).length;
      expect(odds).toBe(expectedOdds);
      expect(evens).toBe(expectedEvens);
      expect(isValidCombination(result)).toBe(true);
    }
  });

  it('returns sorted results', () => {
    for (let i = 0; i < 20; i++) {
      const result = NumberGenerator.generate('random', CTX);
      const sorted = [...result].sort((a, b) => a - b);
      expect(result).toEqual(sorted);
    }
  });
});
