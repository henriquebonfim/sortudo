import { describe, it, expect } from 'vitest';
import { combinations } from '../../src/domain/math/combinations';
import { mean, variance, standardDeviation, sum, max, min } from '../../src/domain/math/statistics';

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
});
