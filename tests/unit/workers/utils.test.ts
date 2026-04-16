import { describe, expect, it } from 'vitest';
import {
  BRAZIL_STATES,
  calculatePercentage,
  countMatches,
  getDecade,
  getYear,
  max,
  mean,
  normalizeStateCode,
  round,
  sortGamesById,
  standardDeviation,
  sum,
} from '../../../src/workers/core/utils';

describe('normalizeStateCode', () => {
  it('should normalize electronic channel correctly', () => {
    expect(normalizeStateCode('CANAL ELETRÔNICO')).toBe('ONLINE');
    expect(normalizeStateCode('ELECT')).toBe('ONLINE');
    expect(normalizeStateCode('INTERNET')).toBe('ONLINE');
  });

  it('should extract state code from parentheses', () => {
    expect(normalizeStateCode('SÃO PAULO (SP)')).toBe('SP');
    expect(normalizeStateCode('RIO DE JANEIRO (RJ)')).toBe('RJ');
  });

  it('should extract state code from separators', () => {
    expect(normalizeStateCode('SANTOS/SP')).toBe('SP');
    expect(normalizeStateCode('CURITIBA-PR')).toBe('PR');
    expect(normalizeStateCode('CUIABA MT')).toBe('MT');
  });

  it('should match direct state codes', () => {
    expect(normalizeStateCode('MG')).toBe('MG');
    expect(normalizeStateCode('BA')).toBe('BA');
  });

  it('should return null for invalid states', () => {
    expect(normalizeStateCode('INVALID')).toBeNull();
    expect(normalizeStateCode('XX')).toBeNull();
    expect(normalizeStateCode('')).toBeNull();
  });

  it('should handle all valid Brazil states', () => {
    BRAZIL_STATES.forEach((state) => {
      expect(normalizeStateCode(state)).toBe(state);
      expect(normalizeStateCode(`CITY/${state}`)).toBe(state);
    });
  });
});

describe('math and helper utilities', () => {
  it('calculates percentage with safe zero-total fallback', () => {
    expect(calculatePercentage(25, 200, 2)).toBe(12.5);
    expect(calculatePercentage(1, 0, 2)).toBe(0);
  });

  it('sorts game-like records by id, including missing ids', () => {
    const sorted = sortGamesById([{ id: 10 }, {}, { id: 2 }]);
    expect(sorted).toEqual([{}, { id: 2 }, { id: 10 }]);
  });

  it('computes sum, mean, max, and standard deviation for normal and empty arrays', () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
    expect(mean([1, 2, 3, 4])).toBe(2.5);
    expect(mean([])).toBe(0);
    expect(max([10, 7, 3])).toBe(10);
    expect(max([])).toBe(0);
    expect(standardDeviation([1, 2, 3])).toBeCloseTo(0.816, 3);
    expect(standardDeviation([])).toBe(0);
  });

  it('rounds values and derives year/decade and draw matches', () => {
    expect(round(10.456, 2)).toBe(10.46);
    expect(getYear('2024-12-31')).toBe(2024);
    expect(getDecade('2024-12-31')).toBe('2020');
    expect(countMatches([1, 2, 3, 4, 5, 6], [1, 3, 5, 7, 9, 11])).toBe(3);
  });
});
