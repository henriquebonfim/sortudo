import { LotteryStats } from '@/lib/lottery/types';
import { getEconomicsChapter } from './chapters/economics-chapter';
import { getGeographyChapter } from './chapters/geography-chapter';
import { getNumbersChapter } from './chapters/numbers-chapter';
import { getProbabilityChapter } from './chapters/probability-chapter';
import { getTemporalChapter } from './chapters/temporal-chapter';
import { Chapter, InfographicType } from './types';

export type * from './types';
export type { InfographicType };

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
  return CHAPTER_FACTORIES.map((factory) => factory(stats));
}
