import { Draw } from '@/domain/lottery/draw.model';
import { 
  normalizeKey, 
  parseCurrency, 
  parseDate, 
  normalizeLocation 
} from './parser-utils';

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
        prizeEstimate: parseCurrency(getV(mapIdx.prizeEstimate)),
        locations: String(getV(mapIdx.location) || '').split(';').map(s => s.trim()).filter(Boolean).map(normalizeLocation),
        notes: String(getV(mapIdx.notes) || '').trim() || undefined,
        accumulatedJackpot: accumulatedJackpot || undefined,
        megaViradaAccumulated: parseCurrency(getV(mapIdx.megaVirada)) || undefined,
      };
    })
    .filter(d => d.id > 0 && d.date);
}
