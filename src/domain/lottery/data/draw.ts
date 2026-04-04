import { z } from "zod";

// ─── Schemas ─────────────────────────────────────────────────────────────────

/**
 * Schema for a single lottery draw.
 * Enforces data types and provides defaults for missing fields from legacy or malformed sources.
 */
export const DrawSchema = z.object({
  id: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (must be YYYY-MM-DD)"),
  numbers: z.array(z.number().min(1).max(60)).length(6),
  jackpotWinners: z.number().nonnegative().default(0),
  jackpotPrize: z.number().nonnegative().default(0),
  quinaWinners: z.number().nonnegative().default(0),
  quinaPrize: z.number().nonnegative().default(0),
  quadraWinners: z.number().nonnegative().default(0),
  quadraPrize: z.number().nonnegative().default(0),
  accumulated: z.boolean().default(false),
  totalRevenue: z.number().nonnegative().default(0),
  prizeEstimate: z.number().nonnegative().default(0),
  locations: z.array(z.string()).default([]),
  notes: z.string().optional(),
  accumulatedJackpot: z.number().nonnegative().optional(),
  megaViradaAccumulated: z.number().nonnegative().optional(),
  drawLocation: z.string().optional(),
});

/**
 * Schema for lottery metadata.
 */
export const LotteryMetadataSchema = z.object({
  lastUpdate: z.string(),
  totalDraws: z.number().int().nonnegative(),
  firstDrawDate: z.string(),
  lastDrawDate: z.string(),
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type Draw = z.infer<typeof DrawSchema>;
export type LotteryMetadata = z.infer<typeof LotteryMetadataSchema>;

export interface MetaResponse {
  totalDraws: number;
  firstDrawDate: string;
  lastDrawDate: string;
  totalJackpotWinners: number;
  pctWithoutWinner: number;
  avgJackpotPrize: number;
  highestPrize: number;
}

export interface FrequenciesResponse {
  frequencies: Record<string, number>;
  min: { number: number; frequency: number };
  max: { number: number; frequency: number };
  mean: number;
  standardDeviation: number;
  ranking: Array<{ number: number; frequency: number; position: number; percentage: number }>;
}

export interface TopJackpotWinnersResponse {
  draws: Array<{ drawId: number; date: string; winners: number; prize: number; pctOfTotalWinners: number }>;
}

export interface SearchResult {
  combination: number[];
  jackpot: Draw[];
  fiveHits: Draw[];
  fourHits: Draw[];
  threeHits: Draw[];
  totalAnalyzed: number;
}

export interface LotteryStats {
  meta: MetaResponse;
  frequencies: FrequenciesResponse;
  topJackpotWinners: TopJackpotWinnersResponse['draws'];
  geoWinners: { state: string; total: number; percentage: number }[];
  parityDistribution: { label: string; count: number; odd: number; even: number; percentage: number }[];
  prizeEvolution: { year: number; maxPrize: number; totalDistributed: number; totalRevenue: number; totalDraws: number; totalWinners: number; megaDaVirada: boolean }[];
  sumDistribution: { bucket: string; min: number; max: number; count: number }[];
  topPairs: { pair: string; number1: number; number2: number; count: number }[];
  accumulationTrend: { year: number; accumulated: number; nonAccumulated: number; pctAccumulated: number }[];
  prizeTierComparison: { tier: string; label: string; avgPrize: number; maxPrize: number; totalWinners: number }[];
  temporalFrequency: { decade: string; data: { number: number; frequency: number }[] }[];
  gapAnalysis: { number: number; currentGap: number; maxGap: number }[];
  hotNumbers: { number: number; count: number }[];
  numberProfile: {
    lowHighSplit: { low: number; high: number };
    primesPercentage: number;
    multiplesOf5Percentage: number;
    multiplesOf10Percentage: number;
    decadeAnalysis: { fullySpreadPct: number; clusteredPct: number };
    drawOverlaps: { zero: number; one: number; two: number; threePlus: number };
  };
  streakEconomics: { streakLength: number; drawsCount: number; avgCollection: number; avgPrize: number }[];
  typeComparison: {
    regular: { avgPrize: number; maxPrize: number; count: number };
    special: { avgPrize: number; maxPrize: number; count: number };
  };
}

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

interface RawLotteryResponse {
  draws?: RawDrawData[];
  concursos?: RawDrawData[];
  metadata?: LotteryMetadata;
  sync_at?: string;
}

// ─── Mapper ──────────────────────────────────────────────────────────────────

export class DrawMapper {
  static toDomain(raw: RawDrawData): Draw | null {
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
      totalRevenue: raw.totalRevenue ?? 
                    raw.valorArrecadado ?? 
                    raw.arrecadacao_total ?? 
                    raw.arrecadacaoTotal ?? 
                    raw.arrecadacao ?? 
                    raw.valor_arrecadado ?? 
                    raw.arrecadacao_total_rateio ?? 0,
      prizeEstimate: raw.prizeEstimate ?? raw.estimativaPremio ?? raw.estimativa_premio ?? 0,
      locations: raw.locations || raw.cidadeUF || [],
      accumulatedJackpot: raw.accumulatedJackpot ?? raw.valorAcumuladoSena,
      megaViradaAccumulated: raw.megaViradaAccumulated ?? raw.acumulado_sorteio_especial_mega_da_virada,
    };

    const result = DrawSchema.safeParse(mapped);
    if (!result.success) {
      console.warn(`Draw validation failed for ID ${mapped.id}:`, result.error.format());
      return null;
    }
    return result.data;
  }

  static toDomainList(rawList: RawDrawData[]): Draw[] {
    return rawList
      .map(item => this.toDomain(item))
      .filter((d): d is Draw => d !== null);
  }

  static extractMetadata(data: RawLotteryResponse, draws: Draw[]): LotteryMetadata | null {
    if (data.metadata) return data.metadata;
    
    if (draws.length === 0) return null;

    return {
      totalDraws: draws.length,
      firstDrawDate: draws[0].date,
      lastDrawDate: draws[draws.length - 1].date,
      lastUpdate: data.sync_at || new Date().toISOString()
    };
  }
}
