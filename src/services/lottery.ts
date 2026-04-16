import { GameSchema, LotteryStatsSchema, MetadataSchema } from '@/lib/core/schemas';
import type { Game, LotteryMetadata, LotteryStats } from '@/lib/core/types';

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

interface RawPayload {
  games?: RawDrawData[];
  draws?: RawDrawData[];
  concursos?: RawDrawData[];
  metadata?: LotteryMetadata | null;
  stats?: unknown;
  sync_at?: string;
}

const FIELD_ALIASES = {
  id: ['id'],
  date: ['data', 'date'],
  numbers: ['bolas', 'numbers'],
  jackpotWinners: ['ganhadoresSena', 'jackpotWinners'],
  jackpotPrize: ['valorSena', 'jackpotPrize'],
  quinaWinners: ['ganhadoresQuina', 'quinaWinners'],
  quinaPrize: ['valorQuina', 'quinaPrize'],
  quadraWinners: ['ganhadoresQuadra', 'quadraWinners'],
  quadraPrize: ['valorQuadra', 'quadraPrize'],
  accumulated: ['acumulado', 'accumulated'],
  totalRevenue: [
    'totalRevenue',
    'valorArrecadado',
    'arrecadacao_total',
    'arrecadacaoTotal',
    'arrecadacao',
    'valor_arrecadado',
    'arrecadacao_total_rateio',
  ],
  prizeEstimate: ['prizeEstimate', 'estimativaPremio', 'estimativa_premio'],
  locations: ['locations', 'cidadeUF'],
  accumulatedJackpot: ['accumulatedJackpot', 'valorAcumuladoSena'],
  megaViradaAccumulated: ['megaViradaAccumulated', 'acumulado_sorteio_especial_mega_da_virada'],
} as const satisfies Record<string, readonly (keyof RawDrawData)[]>;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isString = (value: unknown): value is string => typeof value === 'string';

const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

function pickFirst<T>(
  raw: RawDrawData,
  aliases: readonly (keyof RawDrawData)[],
  guard: (value: unknown) => value is T
): T | undefined {
  for (const alias of aliases) {
    const value = raw[alias];
    if (guard(value)) {
      return value;
    }
  }
  return undefined;
}

function pickNumber(
  raw: RawDrawData,
  aliases: readonly (keyof RawDrawData)[],
  fallback = 0
): number {
  return pickFirst(raw, aliases, isFiniteNumber) ?? fallback;
}

function pickOptionalNumber(
  raw: RawDrawData,
  aliases: readonly (keyof RawDrawData)[]
): number | undefined {
  return pickFirst(raw, aliases, isFiniteNumber);
}

function pickString(
  raw: RawDrawData,
  aliases: readonly (keyof RawDrawData)[],
  fallback = ''
): string {
  return pickFirst(raw, aliases, isString) ?? fallback;
}

function pickBoolean(
  raw: RawDrawData,
  aliases: readonly (keyof RawDrawData)[],
  fallback = false
): boolean {
  return pickFirst(raw, aliases, isBoolean) ?? fallback;
}

function pickNumberList(raw: RawDrawData, aliases: readonly (keyof RawDrawData)[]): number[] {
  const values = pickFirst(raw, aliases, Array.isArray);
  if (!values) return [];
  return values.filter(isFiniteNumber);
}

function pickStringList(raw: RawDrawData, aliases: readonly (keyof RawDrawData)[]): string[] {
  const values = pickFirst(raw, aliases, Array.isArray);
  if (!values) return [];
  return values.filter(isString);
}

function buildFallbackMetadata(games: Game[], syncAt?: string): LotteryMetadata | null {
  if (games.length === 0) {
    return null;
  }

  return {
    totalGames: games.length,
    firstGameDate: games[0].date,
    lastGameDate: games[games.length - 1].date,
    lastUpdate: syncAt || new Date().toISOString(),
  };
}

function extractRawGames(payload: RawPayload): RawDrawData[] {
  const candidate = payload.games ?? payload.draws ?? payload.concursos ?? [];
  if (!Array.isArray(candidate)) {
    return [];
  }

  return candidate.filter(
    (entry): entry is RawDrawData => typeof entry === 'object' && entry !== null
  );
}

function mapToDomain(raw: RawDrawData): Game | null {
  const mapped = {
    id: pickNumber(raw, FIELD_ALIASES.id),
    date: pickString(raw, FIELD_ALIASES.date),
    numbers: pickNumberList(raw, FIELD_ALIASES.numbers),
    jackpotWinners: pickNumber(raw, FIELD_ALIASES.jackpotWinners),
    jackpotPrize: pickNumber(raw, FIELD_ALIASES.jackpotPrize),
    quinaWinners: pickNumber(raw, FIELD_ALIASES.quinaWinners),
    quinaPrize: pickNumber(raw, FIELD_ALIASES.quinaPrize),
    quadraWinners: pickNumber(raw, FIELD_ALIASES.quadraWinners),
    quadraPrize: pickNumber(raw, FIELD_ALIASES.quadraPrize),
    accumulated: pickBoolean(raw, FIELD_ALIASES.accumulated),
    totalRevenue: pickNumber(raw, FIELD_ALIASES.totalRevenue),
    prizeEstimate: pickNumber(raw, FIELD_ALIASES.prizeEstimate),
    locations: pickStringList(raw, FIELD_ALIASES.locations),
    accumulatedJackpot: pickOptionalNumber(raw, FIELD_ALIASES.accumulatedJackpot),
    megaViradaAccumulated: pickOptionalNumber(raw, FIELD_ALIASES.megaViradaAccumulated),
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
  const data = (await res.json()) as RawPayload;

  const games = extractRawGames(data)
    .map(mapToDomain)
    .filter((game): game is Game => game !== null);

  const metadata = data.metadata ?? buildFallbackMetadata(games, data.sync_at);
  const statsResult = LotteryStatsSchema.safeParse(data.stats);
  const stats = statsResult.success ? statsResult.data : null;

  return {
    games,
    metadata: metadata ? MetadataSchema.parse(metadata) : null,
    stats,
  };
}
