import { LotteryStats } from '@/domain/lottery/data/draw';
import { getEconomicsChapter } from './config/chapters/EconomicsChapter';
import { getGeographyChapter } from './config/chapters/GeographyChapter';
import { getNumbersChapter } from './config/chapters/NumbersChapter';
import { getProbabilityChapter } from './config/chapters/ProbabilityChapter';
import { getTemporalChapter } from './config/chapters/TemporalChapter';
import { Chapter } from './config/types';

export type * from './config/types';

/**
 * List of chapter factory functions for the analytics dashboard.
 * Pure and side-effect free.
 */
const CHAPTER_FACTORIES = [
  getNumbersChapter,
  getTemporalChapter,
  getProbabilityChapter,
  getEconomicsChapter,
  getGeographyChapter,
];

/**
 * Builds the dashboard chapters configuration.
 * Uses a pure list of factories to construct chapters for the given stats.
 */
export function buildChapters(stats?: LotteryStats | null): Chapter[] {
  return CHAPTER_FACTORIES.map(factory => factory(stats));
}
