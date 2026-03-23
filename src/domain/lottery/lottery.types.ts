import { Draw } from '@/domain/lottery/draw.model';

// Domain types for the Mega-Sena simulator

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

export interface GeoWinnersResponse {
  state: string;
  total: number;
  percentage: number;
}

export interface ParityResponse {
  label: string;
  count: number;
  odd: number;
  even: number;
  percentage: number;
}

export interface DrawsResponse {
  draws: Draw[];
}

export interface SearchResult {
  combination: number[];
  jackpot: Draw[];
  fiveHits: Draw[];
  fourHits: Draw[];
  threeHits: Draw[];
  totalAnalyzed: number;
}

export interface BubbleNode {
  number: number;
  frequency: number;
  r: number;
  color: string;
  x?: number;
  y?: number;
  fy?: number | null;
}

export interface LotteryStats {
  meta: MetaResponse;
  frequencies: FrequenciesResponse;
  topJackpotWinners: TopJackpotWinnersResponse['draws'];
  geoWinners: { state: string; total: number; percentage: number }[];
  parityDistribution: { label: string; count: number; odd: number; even: number; percentage: number }[];
  prizeEvolution: { year: number; maxPrize: number; avgPrize: number; totalDraws: number; megaDaVirada: boolean }[];
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
}
