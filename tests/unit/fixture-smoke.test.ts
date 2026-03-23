import { describe, it, expect } from 'vitest';
import { REAL_DRAWS } from '../fixtures/real-data';

describe('Real Data Fixture', () => {
  it('should load real draws from Mega-Sena.xlsx', () => {
    expect(REAL_DRAWS.length).toBeGreaterThan(2000);
    const first = REAL_DRAWS[0];
    expect(first.id).toBe(1);
    expect(first.numbers).toHaveLength(6);
    expect(first.numbers.every(b => b >= 1 && b <= 60)).toBe(true);
  });
});
