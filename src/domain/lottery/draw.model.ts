export interface Draw {
  id: number;
  date: string; // ISO format YYYY-MM-DD
  numbers: number[];
  jackpotWinners: number;
  jackpotPrize: number;
  quinaWinners: number;
  quinaPrize: number;
  quadraWinners: number;
  quadraPrize: number;
  accumulated: boolean;
  totalRevenue: number;
  prizeEstimate: number;
  locations?: string[];
  notes?: string;
  accumulatedJackpot?: number;
  megaViradaAccumulated?: number;
  drawLocation?: string;
}

export interface LotteryMetadata {
  lastUpdate: string;
  totalDraws: number;
  firstDrawDate: string;
  lastDrawDate: string;
}
