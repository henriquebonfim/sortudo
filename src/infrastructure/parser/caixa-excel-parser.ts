import { Draw } from '@/domain/lottery/draw.model';

/**
 * Normalizes header keys to snake_case without accents.
 */
const REGEX_ACCENTS = /[\u0300-\u036f]/g;
const REGEX_NON_ALPHANUMERIC = /[^\w\s]/g;
const REGEX_WHITESPACE = /\s+/g;

const normalizeKey = (str: string) =>
  str.normalize('NFD')
    .replace(REGEX_ACCENTS, '')
    .toLowerCase()
    .replace(REGEX_NON_ALPHANUMERIC, '')
    .trim()
    .replace(REGEX_WHITESPACE, '_');

const parseCurrency = (val: unknown): number => {
  if (typeof val === 'number') return val;
  if (!val || typeof val !== 'string') return 0;

  // Format assumed: "R$ 1.234.567,89" -> "1234567.89"
  const clean = val
    .replace(/R\$\s?/gi, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .trim();

  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

/**
 * Normalizes "City/UF" strings with null placeholders.
 */
const normalizeLocation = (str: string) => {
  const clean = str.trim();
  if (clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === 'canal eletronico') {
    return 'Canal Eletrônico';
  }
  const parts = clean.split('/').map(s => s.trim());
  if (parts.length === 2) return `${parts[0] || 'não identificado'}/${parts[1] || 'não identificado'}`;
  if (parts.length === 1 && parts[0]) return /^[A-Z]{2}$/.test(parts[0]) ? `não identificado/${parts[0]}` : `${parts[0]}/não identificado`;
  return clean;
};

/**
 * Parses various date formats to ISO YYYY-MM-DD.
 */
const parseDate = (v: unknown): string => {
  if (v instanceof Date) return v.toISOString().split('T')[0];
  if (typeof v === 'number') return new Date(Math.round((v - 25569) * 864e5)).toISOString().split('T')[0];
  if (typeof v !== 'string') return '';
  const [d, m, y] = v.split('/');
  if (!y) return '';
  const fullYear = y.length === 2 ? '20' + y : y;
  return `${fullYear}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

const createColumnMap = (headers: string[]) => {
  const getColIdx = (keys: string[]) => headers.findIndex(h => keys.some(k => h === k || h.includes(k)));

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
    megaVirada: getColIdx(['mega_da_virada', 'especial'])
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
 * Parses Caixa's Mega-Sena Excel data into typed Draw objects.
 */
export function parseCaixaExcel(data: unknown[][]): Draw[] {
  const headerIdx = data.findIndex(row => row.length > 5);
  if (headerIdx === -1) return [];

  const headers = data[headerIdx].map(h => normalizeKey(String(h || '')));
  const mapIdx = createColumnMap(headers);

  return data.slice(headerIdx + 1)
    .filter(row => row.length > 0 && row[0] !== undefined)
    .map(row => {
      const getV = (idx: number) => idx >= 0 ? row[idx] : undefined;
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
        locations: String(getV(mapIdx.location) || '').split(';').map(s => s.trim()).filter(Boolean).map(normalizeLocation),
        notes: String(getV(mapIdx.notes) || '').trim() || undefined,
        accumulatedJackpot: accumulatedJackpot || undefined,
        megaViradaAccumulated: parseCurrency(getV(mapIdx.megaVirada)) || undefined,
      };
    })
    .filter(d => d.id > 0 && d.date);
}
