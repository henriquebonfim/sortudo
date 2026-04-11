import { z } from 'zod';

// --- Schemas & Types ---
export const GameSchema = z.object({
  id: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
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
  accumulatedJackpot: z.number().nonnegative().optional(),
  megaViradaAccumulated: z.number().nonnegative().optional(),
});

export const MetadataSchema = z.object({
  lastUpdate: z.string(),
  totalGames: z.number().int().nonnegative(),
  firstGameDate: z.string(),
  lastGameDate: z.string(),
});

export const FrequenciesSchema = z.object({
  frequencies: z.record(z.string(), z.number()),
  ranking: z.array(
    z.object({
      number: z.number(),
      frequency: z.number(),
      percentage: z.number(),
      position: z.number(),
    })
  ),
  min: z.object({ number: z.number(), frequency: z.number() }),
  max: z.object({ number: z.number(), frequency: z.number() }),
  mean: z.number(),
  standardDeviation: z.number(),
});

export const LotteryStatsSchema = z.object({
  meta: z
    .object({
      pctWithoutWinner: z.number(),
      totalJackpotWinners: z.number(),
      highestPrize: z.number(),
    })
    .optional(),
  frequencies: FrequenciesSchema,
  topJackpotWinners: z
    .array(
      z.object({
        drawId: z.number(),
        date: z.string(),
        winners: z.number(),
        prize: z.number(),
        pctOfTotalWinners: z.number(),
      })
    )
    .default([]),
  geoWinners: z
    .array(
      z.object({
        state: z.string(),
        total: z.number(),
        percentage: z.number(),
      })
    )
    .default([]),
  parityDistribution: z
    .array(
      z.object({
        odds: z.number(),
        evens: z.number(),
        count: z.number(),
        percentage: z.number(),
      })
    )
    .default([]),
  prizeEvolution: z
    .array(
      z.object({
        year: z.number(),
        maxPrize: z.number(),
        totalDistributed: z.number(),
        totalRevenue: z.number(),
        totalGames: z.number(),
        totalWinners: z.number(),
        megaDaVirada: z.boolean(),
      })
    )
    .default([]),
  sumDistribution: z
    .array(
      z.object({
        bucket: z.string(),
        min: z.number(),
        max: z.number(),
        count: z.number(),
      })
    )
    .default([]),
  topPairs: z
    .array(
      z.object({
        numbers: z.array(z.number()),
        count: z.number(),
      })
    )
    .default([]),
  accumulationTrend: z
    .array(
      z.object({
        year: z.number(),
        accumulated: z.number(),
        nonAccumulated: z.number(),
        pctAccumulated: z.number(),
      })
    )
    .default([]),
  prizeTierComparison: z
    .array(
      z.object({
        tier: z.string(),
        label: z.string(),
        avgPrize: z.number(),
        maxPrize: z.number(),
        totalWinners: z.number(),
      })
    )
    .default([]),
  temporalFrequency: z
    .array(
      z.object({
        decade: z.string(),
        data: z.array(
          z.object({
            number: z.number(),
            frequency: z.number(),
          })
        ),
      })
    )
    .default([]),
  gapAnalysis: z
    .array(
      z.object({
        number: z.number(),
        currentGap: z.number(),
        maxGap: z.number(),
      })
    )
    .default([]),
  hotNumbers: z
    .array(
      z.object({
        number: z.number(),
        frequency: z.number(),
      })
    )
    .default([]),
  numberProfile: z
    .object({
      lowHighSplit: z.object({ low: z.number(), high: z.number() }),
      primesPercentage: z.number(),
      multiplesOf5Percentage: z.number(),
      multiplesOf10Percentage: z.number(),
      decadeAnalysis: z.object({ fullySpreadPct: z.number(), clusteredPct: z.number() }),
      gameOverlaps: z.object({
        zero: z.number(),
        one: z.number(),
        two: z.number(),
        threePlus: z.number(),
      }),
      overlapExamples: z
        .array(
          z.object({
            drawId: z.number(),
            prevDrawId: z.number(),
            date: z.string(),
            numbers: z.array(z.number()),
            count: z.number(),
          })
        )
        .default([]),
    })
    .optional(),
  streakEconomics: z
    .array(
      z.object({
        streak: z.number(),
        count: z.number(),
        avgCollection: z.number(),
        avgPrize: z.number(),
      })
    )
    .default([]),
  typeComparison: z
    .object({
      regular: z.object({
        avgPrize: z.number(),
        maxPrize: z.number(),
        count: z.number(),
      }),
      special: z.object({
        avgPrize: z.number(),
        maxPrize: z.number(),
        count: z.number(),
      }),
    })
    .optional(),
});

export type Game = z.infer<typeof GameSchema>;
export type LotteryMetadata = z.infer<typeof MetadataSchema>;
export type LotteryFrequencies = z.infer<typeof FrequenciesSchema>;
export type LotteryStats = z.infer<typeof LotteryStatsSchema>;

export interface SearchResult {
  combination: number[];
  jackpot: Game[];
  fiveHits: Game[];
  fourHits: Game[];
  threeHits: Game[];
  totalAnalyzed: number;
}

export interface HeatPoint {
  x: number;
  y: number;
  number: number;
  bias: number;
}

export interface LLNDataPoint {
  draws: number;
  displayDraws: string;
  percentage: number;
  theoretical: number;
}

export interface TopJackpotWinnersDraw {
  drawId: number;
  date: string;
  winners: number;
  prize: number;
  pctOfTotalWinners: number;
}

export interface TopJackpotWinnersResponse {
  draws: TopJackpotWinnersDraw[];
}
