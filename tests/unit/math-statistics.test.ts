import { describe, it, expect } from 'vitest';
import { mean, variance, standardDeviation, sum, max, min } from '@/domain/math/statistics';

describe('Math Statistics Utilities', () => {
  const data = [2, 4, 4, 4, 5, 5, 7, 9];
  // n = 8
  // Sum = 2+4+4+4+5+5+7+9 = 40
  // Mean = 40 / 8 = 5
  // Variance = ((2-5)^2 + 3*(4-5)^2 + 2*(5-5)^2 + (7-5)^2 + (9-5)^2) / 8
  // Variance = (9 + 3*1 + 0 + 4 + 16) / 8 = 32 / 8 = 4
  // StdDev = sqrt(4) = 2

  it('sum should return the correct total', () => {
    expect(sum(data)).toBe(40);
    expect(sum([])).toBe(0);
  });

  it('mean should return the arithmetic average', () => {
    expect(mean(data)).toBe(5);
    expect(mean([])).toBe(0);
  });

  it('variance should return the population variance', () => {
    expect(variance(data)).toBe(4);
    expect(variance([])).toBe(0);
  });

  it('standardDeviation should return the population standard deviation', () => {
    expect(standardDeviation(data)).toBe(2);
    expect(standardDeviation([])).toBe(0);
  });

  it('max should return the maximum value', () => {
    expect(max(data)).toBe(9);
    expect(max([])).toBe(0);
  });

  it('min should return the minimum value', () => {
    expect(min(data)).toBe(2);
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
