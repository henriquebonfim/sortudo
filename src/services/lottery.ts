import { GameSchema, LotteryStatsSchema, MetadataSchema } from '@/lib/core/schemas';
import { Game, LotteryMetadata, LotteryStats } from '@/lib/core/types';

interface RawDrawData {
  id?: number;
  data?: string;
  date?: string;
  bolas?: number[];
  numbers?: number[];
  ganhadoresSena?: number;
  jackpotWinners?: number;
  valorSena?: number;
  jackpotPrize?: number;
  ganhadoresQuina?: number;
  quinaWinners?: number;
  valorQuina?: number;
  quinaPrize?: number;
  ganhadoresQuadra?: number;
  quadraWinners?: number;
  valorQuadra?: number;
  quadraPrize?: number;
  acumulado?: boolean;
  accumulated?: boolean;
  valorArrecadado?: number;
  totalRevenue?: number;
  arrecadacao_total?: number;
  arrecadacaoTotal?: number;
  arrecadacao?: number;
  valor_arrecadado?: number;
  arrecadacao_total_rateio?: number;
  estimativaPremio?: number;
  prizeEstimate?: number;
  estimativa_premio?: number;
  cidadeUF?: string[];
  locations?: string[];
  valorAcumuladoSena?: number;
  accumulatedJackpot?: number;
  megaViradaAccumulated?: number;
  acumulado_sorteio_especial_mega_da_virada?: number;
}

function mapToDomain(raw: RawDrawData): Game | null {
  const mapped = {
    id: raw.id || 0,
    date: raw.data || raw.date || '',
    numbers: raw.bolas || raw.numbers || [],
    jackpotWinners: raw.ganhadoresSena ?? raw.jackpotWinners ?? 0,
    jackpotPrize: raw.valorSena ?? raw.jackpotPrize ?? 0,
    quinaWinners: raw.ganhadoresQuina ?? raw.quinaWinners ?? 0,
    quinaPrize: raw.valorQuina ?? raw.quinaPrize ?? 0,
    quadraWinners: raw.ganhadoresQuadra ?? raw.quadraWinners ?? 0,
    quadraPrize: raw.valorQuadra ?? raw.quadraPrize ?? 0,
    accumulated: raw.acumulado ?? raw.accumulated ?? false,
    totalRevenue:
      raw.totalRevenue ??
      raw.valorArrecadado ??
      raw.arrecadacao_total ??
      raw.arrecadacaoTotal ??
      raw.arrecadacao ??
      raw.valor_arrecadado ??
      raw.arrecadacao_total_rateio ??
      0,
    prizeEstimate: raw.prizeEstimate ?? raw.estimativaPremio ?? raw.estimativa_premio ?? 0,
    locations: raw.locations || raw.cidadeUF || [],
    accumulatedJackpot: raw.accumulatedJackpot ?? raw.valorAcumuladoSena,
    megaViradaAccumulated:
      raw.megaViradaAccumulated ?? raw.acumulado_sorteio_especial_mega_da_virada,
  };

  const result = GameSchema.safeParse(mapped);
  return result.success ? result.data : null;
}

export async function fetchLotteryData(): Promise<{
  games: Game[];
  metadata: LotteryMetadata | null;
  stats: LotteryStats | null;
}> {
  const res = await fetch('/data.json');
  if (!res.ok) throw new Error('Failed to load static data');
  const data = await res.json();

  const rawGames = data.games || data.draws || data.concursos || [];
  const games = rawGames.map(mapToDomain).filter((g): g is Game => g !== null);

  const metadata =
    data.metadata ||
    (games.length > 0
      ? {
          totalGames: games.length,
          firstGameDate: games[0].date,
          lastGameDate: games[games.length - 1].date,
          lastUpdate: data.sync_at || new Date().toISOString(),
        }
      : null);

  const statsResult = LotteryStatsSchema.safeParse(data.stats);
  const stats = statsResult.success ? statsResult.data : null;

  return {
    games,
    metadata: metadata ? MetadataSchema.parse(metadata) : null,
    stats,
  };
}
