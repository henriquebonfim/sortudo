export interface Game {
  id: number;
  date: string;
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
  locations: string[];
  notes?: string;
  accumulatedJackpot?: number;
  megaViradaAccumulated?: number;
}

export interface LotteryMetadata {
  lastUpdate: string;
  totalGames: number;
  firstGameDate: string;
  lastGameDate: string;
}

export interface TopJackpotWinnersDraw {
  drawId: number;
  date: string;
  winners: number;
  prize: number;
  pctOfTotalWinners: number;
}

export interface LotteryFrequencies {
  frequencies: Record<string, number>;
  ranking: Array<{
    number: number;
    frequency: number;
    percentage: number;
    position: number;
  }>;
  min: {
    number: number;
    frequency: number;
  };
  max: {
    number: number;
    frequency: number;
  };
  mean: number;
  standardDeviation: number;
}

export interface LotteryStats {
  meta?: {
    pctWithoutWinner: number;
    totalJackpotWinners: number;
    highestPrize: number;
    avgJackpotPrize?: number;
    totalGames?: number;
    firstGameDate?: string;
    lastGameDate?: string;
    lastUpdate?: string;
  };
  frequencies: LotteryFrequencies;
  topJackpotWinners: TopJackpotWinnersDraw[];
  geoWinners: Array<{
    state: string;
    total: number;
    percentage: number;
  }>;
  parityDistribution: Array<{
    label: string;
    odds: number;
    evens: number;
    count: number;
    percentage: number;
  }>;
  prizeEvolution: Array<{
    year: number;
    maxPrize: number;
    totalDistributed: number;
    totalRevenue: number;
    totalGames: number;
    totalWinners: number;
    megaDaVirada: boolean;
  }>;
  sumDistribution: Array<{
    bucket: string;
    min: number;
    max: number;
    count: number;
  }>;
  topPairs: Array<{
    numbers: number[];
    count: number;
  }>;
  accumulationTrend: Array<{
    year: number;
    accumulated: number;
    nonAccumulated: number;
    pctAccumulated: number;
  }>;
  prizeTierComparison: Array<{
    tier: string;
    label: string;
    avgPrize: number;
    maxPrize: number;
    totalWinners: number;
  }>;
  temporalFrequency: Array<{
    decade: string;
    data: Array<{
      number: number;
      frequency: number;
    }>;
  }>;
  gapAnalysis: Array<{
    number: number;
    currentGap: number;
    maxGap: number;
  }>;
  hotNumbers: Array<{
    number: number;
    frequency: number;
  }>;
  numberProfile?: {
    lowHighSplit: {
      low: number;
      high: number;
    };
    primesPercentage: number;
    multiplesOf5Percentage: number;
    multiplesOf10Percentage: number;
    decadeAnalysis: {
      fullySpreadPct: number;
      clusteredPct: number;
    };
    gameOverlaps: {
      zero: number;
      one: number;
      two: number;
      threePlus: number;
      totalWithOverlap?: number;
    };
    overlapHistory: Array<{
      drawId: number;
      prevDrawId: number;
      date: string;
      numbers: number[];
      count: number;
    }>;
  };
  streakEconomics: Array<{
    streak: number;
    count: number;
    avgCollection: number;
    avgPrize: number;
  }>;
  typeComparison?: {
    regular: {
      avgPrize: number;
      maxPrize: number;
      count: number;
    };
    special: {
      avgPrize: number;
      maxPrize: number;
      count: number;
    };
  };
}

export interface SearchResult {
  combination: number[];
  jackpot: Game[];
  fiveHits: Game[];
  fourHits: Game[];
  threeHits: Game[];
  totalAnalyzed: number;
}
