import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { combinations } from '@/domain/math/combinations';
import { poissonProbability } from '@/domain/math/statistics';

describe('Domain Math - Property Based Tests', () => {
  describe('combinations (nCr) Properties', () => {
    it('should always return a non-negative integer', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), fc.integer({ min: 0, max: 100 }), (n, k) => {
          const result = combinations(n, k);
          return Number.isInteger(result) && result >= 0;
        })
      );
    });

    it('should satisfy symmetry property: nCr(n, k) === nCr(n, n-k)', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 60 }), fc.integer({ min: 0, max: 60 }), (n, k) => {
          if (k > n) return true;
          const left = combinations(n, k);
          const right = combinations(n, n - k);
          // For very large n, we might hit precision issues depending on implementation,
          // but for n <= 60 (Mega-Sena range) it should be exact.
          return left === right;
        })
      );
    });

    it('should satisfy Pascal\'s identity: nCr(n, k) = nCr(n-1, k-1) + nCr(n-1, k)', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 30 }), fc.integer({ min: 1, max: 29 }), (n, k) => {
          const left = combinations(n, k);
          const right = combinations(n - 1, k - 1) + combinations(n - 1, k);
          return left === right;
        })
      );
    });

    it('should return 1 when k=0 or k=n', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 1000 }), (n) => {
          return combinations(n, 0) === 1 && combinations(n, n) === 1;
        })
      );
    });

    it('should return 0 when k > n', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 100 }), fc.integer({ min: 1, max: 50 }), (n, diff) => {
          return combinations(n, n + diff) === 0;
        })
      );
    });
  });

  describe('poissonProbability Properties', () => {
    it('should always return a probability between 0 and 1', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 0.001, max: 100, noNaN: true, noDefaultInfinity: true }), // lambda
          fc.integer({ min: 0, max: 200 }),                                         // k
          (lambda, k) => {
            const p = poissonProbability(lambda, k);
            return p >= 0 && p <= 1;
          }
        )
      );
    });

    it('should return 0 for negative lambda', () => {
      fc.assert(
        fc.property(
          fc.double({ max: -0.001, noNaN: true, noDefaultInfinity: true }), 
          fc.integer({ min: 0, max: 100 }),
          (lambda, k) => {
            return poissonProbability(lambda, k) === 0;
          }
        )
      );
    });
  });
});
