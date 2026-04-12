import { Game } from './types';
import { normalizeStateCode } from './utils';
import * as XLSX from 'xlsx';

// ─── Parser Utilities ────────────────────────────────────────────────────────

const REGEX_ACCENTS = /[\u0300-\u036f]/g;
const REGEX_NON_ALPHANUMERIC = /[^\w\s]/g;
const REGEX_WHITESPACE = /\s+/g;

/**
 * Normalizes header keys to snake_case without accents.
 */
const normalizeKey = (str: string): string =>
  str
    .normalize('NFD')
    .replace(REGEX_ACCENTS, '')
    .toLowerCase()
    .replace(REGEX_NON_ALPHANUMERIC, '')
    .trim()
    .replace(REGEX_WHITESPACE, '_');

/**
 * Parses currency strings like "R$ 1.234.567,89" into numbers.
 */
const parseCurrency = (val: unknown): number => {
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
const normalizeLocation = (str: string): string => {
  return normalizeStateCode(str) || 'não identificado/não identificado';
};

/**
 * Parses various date formats to ISO YYYY-MM-DD.
 */
const parseDate = (v: unknown): string => {
  if (v instanceof Date) return v.toISOString().split('T')[0];
  if (typeof v === 'number') {
    // Excel date (days since 1900-01-01)
    return new Date(Math.round((v - 25569) * 864e5)).toISOString().split('T')[0];
  }
  if (typeof v !== 'string') return '';

  const dFormat = v.split('/');
  if (dFormat.length < 3) return '';

  const [d, m, y] = dFormat;
  const fullYear = y.length === 2 ? '20' + y : y;
  return `${fullYear}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

// ─── Caixa Excel Parser ──────────────────────────────────────────────────────

const createColumnMap = (headers: string[]) => {
  const getColIdx = (keys: string[]) =>
    headers.findIndex((h) => keys.some((k) => h === k || h.includes(k)));

  return {
    id: getColIdx(['concurso', 'numero']),
    date: getColIdx(['data_do_sorteio', 'data_sorteio', 'data']),
    jackpotWinners: getColIdx(['ganhadores_6']),
    jackpotPrize: getColIdx(['rateio_6']),
    quinaWinners: getColIdx(['ganhadores_5']),
    quinaPrize: getColIdx(['rateio_5']),
    quadraWinners: getColIdx(['ganhadores_4']),
    quadraPrize: getColIdx(['rateio_4']),
    revenue: getColIdx(['arrecadacao', 'arrecadada']),
    accumulatedSena: getColIdx(['acumulado_6', 'acumulado_sena']),
    estimate: getColIdx(['estimativa']),
    location: getColIdx(['cidade_uf', 'uf', 'cidade']),
    notes: getColIdx(['observacao', 'nota']),
    megaVirada: getColIdx(['mega_da_virada', 'especial']),
  };
};

const extractDrawNumbers = (row: unknown[], headers: string[]): number[] => {
  const numbers: number[] = [];
  headers.forEach((key, i) => {
    if (key.startsWith('bola') || key.startsWith('dezena')) {
      const num = parseInt(String(row[i] || '').replace(/\D/g, ''), 10);
      if (!isNaN(num)) numbers.push(num);
    }
  });
  return numbers.sort((a, b) => a - b);
};

/**
 * Parses Caixa's Mega-Sena Excel data into typed Game objects.
 */
function parseCaixaExcel(data: unknown[][]): Game[] {
  const headerIdx = data.findIndex((row) => row.length > 5);
  if (headerIdx === -1) return [];

  const headers = data[headerIdx].map((h) => normalizeKey(String(h || '')));
  const mapIdx = createColumnMap(headers);

  return data
    .slice(headerIdx + 1)
    .filter((row) => row.length > 0 && row[0] !== undefined)
    .map((row) => {
      const getV = (idx: number) => (idx >= 0 ? row[idx] : undefined);
      const accumulatedJackpot = parseCurrency(getV(mapIdx.accumulatedSena));

      return {
        id: Math.floor(Number(getV(mapIdx.id) || 0)),
        date: parseDate(getV(mapIdx.date)),
        numbers: extractDrawNumbers(row, headers),
        jackpotWinners: Number(getV(mapIdx.jackpotWinners)) || 0,
        jackpotPrize: parseCurrency(getV(mapIdx.jackpotPrize)),
        quinaWinners: Number(getV(mapIdx.quinaWinners)) || 0,
        quinaPrize: parseCurrency(getV(mapIdx.quinaPrize)),
        quadraWinners: Number(getV(mapIdx.quadraWinners)) || 0,
        quadraPrize: parseCurrency(getV(mapIdx.quadraPrize)),
        accumulated: accumulatedJackpot > 0,
        totalRevenue: parseCurrency(getV(mapIdx.revenue)),
        prizeEstimate: parseCurrency(getV(mapIdx.estimate)),
        locations: String(getV(mapIdx.location) || '')
          .split(';')
          .map((s) => s.trim())
          .filter(Boolean)
          .map(normalizeLocation),
        notes: String(getV(mapIdx.notes) || '').trim() || undefined,
        accumulatedJackpot: accumulatedJackpot || undefined,
        megaViradaAccumulated: parseCurrency(getV(mapIdx.megaVirada)) || undefined,
      } as Game;
    })
    .filter((d) => d.id > 0 && d.date);
}

// ─── Parser Factory ──────────────────────────────────────────────────────────

type ParserType = 'caixa-excel' | 'caixa-json';

class ParserFactory {
  static getParser(type: ParserType): (data: unknown[][]) => Game[] {
    switch (type) {
      case 'caixa-excel':
        return parseCaixaExcel;
      case 'caixa-json':
        // Placeholder for future JSON parser
        return (data: unknown[][]) => data as unknown as Game[];
      default:
        throw new Error(`Unsupported parser type: ${type}`);
    }
  }

  /**
   * Automatically detects the parser type based on data structure or file extension.
   */
  static detectAndParse(data: unknown): Game[] {
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      return parseCaixaExcel(data as unknown[][]);
    }

    // Default fallback or more complex detection logic
    return data as Game[];
  }
}

// ─── Excel Reader ────────────────────────────────────────────────────────────

/**
 * Reads an Excel file (as ArrayBuffer or Buffer) and parses it into Game domain models.
 * Includes workarounds for Caixa's corrupted XLSX range headers.
 */
export function parseExcelToGames(data: ArrayBuffer | Uint8Array): Game[] {
  // Safe check for Buffer to avoid ReferenceError in browser/worker environments
  const globalObj = globalThis as unknown as { Buffer?: { isBuffer: (val: unknown) => boolean } };
  const isBuffer =
    typeof globalThis !== 'undefined' && globalObj.Buffer && globalObj.Buffer.isBuffer(data);
  const workbook = XLSX.read(data, { type: isBuffer ? 'buffer' : 'array' });

  if (!workbook.SheetNames.length) {
    throw new Error('The file is empty.');
  }

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error('Could not find a valid worksheet.');
  }

  /**
   * WORKAROUND: Some official Caixa XLSX files have a corrupted or truncated "!ref" (range).
   * This causes sheet_to_json to only return the header row.
   * We manually scan the keys to find the REAL max row.
   */
  const cells = Object.keys(worksheet).filter((k) => k[0] !== '!');
  let maxRow = 0;
  for (const cell of cells) {
    const rowNum = parseInt(cell.replace(/^[A-Z]+/, ''), 10);
    if (!isNaN(rowNum) && rowNum > maxRow) maxRow = rowNum;
  }

  // header: 1 returns an array of arrays (rows), which our parser needs
  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    blankrows: false,
    // If we found rows beyond the !ref, force the range
    // We assume columns A-Z (0-25) are enough for Mega-Sena data
    range: maxRow > 0 ? { s: { c: 0, r: 0 }, e: { c: 25, r: maxRow } } : undefined,
  });

  // This transforms the raw rows into the domain model (Draw[])
  const draws = ParserFactory.getParser('caixa-excel')(rows as unknown[][]);
  draws.sort((a, b) => a.id - b.id);

  return draws;
}
