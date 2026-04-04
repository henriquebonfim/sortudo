import { describe, it, expect } from 'vitest';
import { combinations } from '@/domain/math/combinations';
import { mean, variance, standardDeviation, sum, max, min, poissonProbability, calculateTrueExpectedValue } from '@/domain/math/statistics';

describe('Domain Math & Statistics', () => {
  describe('Combinations (nCr)', () => {
    it('should calculate combinations correctly', () => {
      expect(combinations(60, 6)).toBe(50063860);
      expect(combinations(6, 6)).toBe(1);
      expect(combinations(6, 4)).toBe(15);
      expect(combinations(10, 2)).toBe(45);
    });

    it('should return 0 for invalid inputs', () => {
      expect(combinations(5, 6)).toBe(0);
      expect(combinations(5, -1)).toBe(0);
    });

    it('should return integers for all valid Mega-Sena game sizes', () => {
      for (let k = 6; k <= 15; k++) {
        const result = combinations(60, k);
        expect(Number.isInteger(result)).toBe(true);
        expect(result).toBeGreaterThan(0);
      }
    });
  });

  describe('Statistics Utilities', () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9];

    it('should calculate mean, variance and stdDev correctly', () => {
      expect(sum(data)).toBe(40);
      expect(mean(data)).toBe(5);
      expect(variance(data)).toBe(4);
      expect(standardDeviation(data)).toBe(2);
    });

    it('should calculate max and min', () => {
      expect(max(data)).toBe(9);
      expect(min(data)).toBe(2);
    });

    it('should handle empty arrays gracefully', () => {
      expect(sum([])).toBe(0);
      expect(mean([])).toBe(0);
      expect(variance([])).toBe(0);
      expect(standardDeviation([])).toBe(0);
      expect(max([])).toBe(0);
      expect(min([])).toBe(0);
    });

    it('should handle single element arrays', () => {
      const single = [10];
      expect(sum(single)).toBe(10);
      expect(mean(single)).toBe(10);
      expect(variance(single)).toBe(0);
      expect(standardDeviation(single)).toBe(0);
      expect(max(single)).toBe(10);
      expect(min(single)).toBe(10);
    });
  });

  describe('Poisson and Expected Value', () => {
    it('calculates poissonProbability', () => {
      expect(poissonProbability(1, 0)).toBeCloseTo(0.367879, 4); // exp(-1)
      expect(poissonProbability(1, 1)).toBeCloseTo(0.367879, 4); // exp(-1)
      expect(poissonProbability(3, 2)).toBeCloseTo(0.224, 3);
      expect(poissonProbability(-1, 5)).toBe(0); // validate negative lambda handling
    });

    it('calculates true expected value with jackpot splitting risk', () => {
      // 5 cost, 10M jackpot, 50M odds, 25M sold
      // lambda = 25M / 50M = 0.5
      const ev = calculateTrueExpectedValue(5, 10_000_000, 50_000_000, 25_000_000, 0);
      // shareFactor = (1 - exp(-0.5)) / 0.5 ≈ 0.7869
      // expectedJackpot = (10M * 0.7869) / 50M = 0.157...
      // ev = 0.157 - 5 = -4.84
      expect(ev).toBeCloseTo(-4.84, 2);
    });
  });
});
