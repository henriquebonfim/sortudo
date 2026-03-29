import { LotteryStats } from '@/domain/lottery/lottery.types';
import { Chapter } from './config/types';
import { chapterRegistry } from './config/registry';
import { getNumbersChapter } from './config/chapters/NumbersChapter';
import { getTemporalChapter } from './config/chapters/TemporalChapter';
import { getProbabilityChapter } from './config/chapters/ProbabilityChapter';
import { getEconomicsChapter } from './config/chapters/EconomicsChapter';
import { getGeographyChapter } from './config/chapters/GeographyChapter';

// Register all chapters
chapterRegistry.register(getNumbersChapter);
chapterRegistry.register(getTemporalChapter);
chapterRegistry.register(getProbabilityChapter);
chapterRegistry.register(getEconomicsChapter);
chapterRegistry.register(getGeographyChapter);

export type * from './config/types';

/**
 * Builds the dashboard chapters configuration.
 * Now uses a registry pattern for better scalability.
 */
export function buildChapters(stats?: LotteryStats | null): Chapter[] {
  return chapterRegistry.getChapters(stats);
}
