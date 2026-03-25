import { Draw, LotteryMetadata } from './draw.model';

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
  estimativaPremio?: number;
  prizeEstimate?: number;
  cidadeUF?: string[];
  locations?: string[];
  valorAcumuladoSena?: number;
  accumulatedJackpot?: number;
}

interface RawLotteryResponse {
  draws?: RawDrawData[];
  concursos?: RawDrawData[];
  metadata?: LotteryMetadata;
  sync_at?: string;
}

export class DrawMapper {
  static toDomain(raw: RawDrawData): Draw {
    return {
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
      totalRevenue: raw.valorArrecadado ?? raw.totalRevenue ?? 0,
      prizeEstimate: raw.estimativaPremio ?? raw.prizeEstimate ?? 0,
      locations: raw.cidadeUF || raw.locations || [],
      accumulatedJackpot: raw.valorAcumuladoSena ?? raw.accumulatedJackpot,
    };
  }

  static toDomainList(rawList: RawDrawData[]): Draw[] {
    return rawList.map(item => this.toDomain(item));
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
