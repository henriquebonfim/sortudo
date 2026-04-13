import { z } from 'zod';
import { FrequenciesSchema, GameSchema, LotteryStatsSchema, MetadataSchema } from './schemas';

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
