import { describe, it, expect } from 'vitest';
import { combinations } from '@/domain/math/combinations';

describe('Math Domain Logic', () => {
  describe('combinations (nCr)', () => {
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
      // Validates Math.round fix — all results must be whole numbers
      for (let k = 6; k <= 15; k++) {
        const result = combinations(60, k);
        expect(Number.isInteger(result)).toBe(true);
        expect(result).toBeGreaterThan(0);
      }
    });
  });
});
