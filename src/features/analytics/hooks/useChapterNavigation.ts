import { useCallback, useMemo, useState } from 'react';

interface UseChapterNavigationResult {
  activeChapterIndex: number;
  onChapterSelect: (index: number, chapterId?: string) => void;
}

export function useChapterNavigation(chaptersLength: number): UseChapterNavigationResult {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const activeChapterIndex = useMemo(
    () => (chaptersLength > 0 ? Math.min(currentChapterIndex, chaptersLength - 1) : 0),
    [chaptersLength, currentChapterIndex]
  );

  const onChapterSelect = useCallback(
    (index: number, chapterId?: string) => {
      if (index < 0 || index >= chaptersLength) return;

      setCurrentChapterIndex(index);

      if (typeof window === 'undefined') return;

      if (!chapterId) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        return;
      }

      const tryScrollToChapter = (attempt = 0) => {
        const target = document.getElementById(chapterId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        if (attempt >= 24) return;

        window.setTimeout(() => {
          tryScrollToChapter(attempt + 1);
        }, 50);
      };

      tryScrollToChapter();
    },
    [chaptersLength]
  );

  return {
    activeChapterIndex,
    onChapterSelect,
  };
}
