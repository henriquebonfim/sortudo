import { LotteryStats } from '@/domain/lottery/lottery.types';
import { Chapter } from './types';

type ChapterFactory = (stats?: LotteryStats | null) => Chapter;

class DashboardRegistry {
  private chapters: ChapterFactory[] = [];

  register(factory: ChapterFactory) {
    this.chapters.push(factory);
  }

  getChapters(stats?: LotteryStats | null): Chapter[] {
    return this.chapters.map(factory => factory(stats));
  }
}

export const chapterRegistry = new DashboardRegistry();
