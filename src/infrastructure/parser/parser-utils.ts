/**
 * Utility functions for parsing lottery data.
 */

const REGEX_ACCENTS = /[\u0300-\u036f]/g;
const REGEX_NON_ALPHANUMERIC = /[^\w\s]/g;
const REGEX_WHITESPACE = /\s+/g;

/**
 * Normalizes header keys to snake_case without accents.
 */
export const normalizeKey = (str: string): string =>
  str.normalize('NFD')
    .replace(REGEX_ACCENTS, '')
    .toLowerCase()
    .replace(REGEX_NON_ALPHANUMERIC, '')
    .trim()
    .replace(REGEX_WHITESPACE, '_');

/**
 * Parses currency strings like "R$ 1.234.567,89" into numbers.
 */
export const parseCurrency = (val: unknown): number => {
  if (typeof val === 'number') return val;
  if (!val || typeof val !== 'string') return 0;

  const clean = val
    .replace(/R\$\s?/gi, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .trim();

  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

/**
 * Normalizes "City/UF" strings.
 */
export const normalizeLocation = (str: string): string => {
  const clean = str.trim();
  const normalizedLower = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  
  if (normalizedLower === 'canal eletronico') {
    return 'Canal Eletrônico';
  }
  
  const parts = clean.split('/').map(s => s.trim());
  if (parts.length === 2) {
    return `${parts[0] || 'não identificado'}/${parts[1] || 'não identificado'}`;
  }
  
  if (parts.length === 1 && parts[0]) {
    return /^[A-Z]{2}$/.test(parts[0]) 
      ? `não identificado/${parts[0]}` 
      : `${parts[0]}/não identificado`;
  }
  
  return clean;
};

/**
 * Parses various date formats to ISO YYYY-MM-DD.
 */
export const parseDate = (v: unknown): string => {
  if (v instanceof Date) return v.toISOString().split('T')[0];
  if (typeof v === 'number') {
    // Excel date (days since 1900-01-01)
    return new Date(Math.round((v - 25569) * 864e5)).toISOString().split('T')[0];
  }
  if (typeof v !== 'string') return '';
  
  const [d, m, y] = v.split('/');
  if (!y) return '';
  
  const fullYear = y.length === 2 ? '20' + y : y;
  return `${fullYear}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};
