import { describe, expect, it } from 'vitest';
import { BRAZIL_STATES, normalizeStateCode } from '../../../src/workers/core/utils';

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
