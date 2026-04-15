import { useCallback, useMemo, useState } from 'react';

interface UseChapterNavigationResult {
  activeChapterIndex: number;
  onChapterSelect: (index: number) => void;
}

export function useChapterNavigation(chaptersLength: number): UseChapterNavigationResult {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const activeChapterIndex = useMemo(
    () => (chaptersLength > 0 ? Math.min(currentChapterIndex, chaptersLength - 1) : 0),
    [chaptersLength, currentChapterIndex]
  );

  const onChapterSelect = useCallback(
    (index: number) => {
      if (index < 0 || index >= chaptersLength) return;

      setCurrentChapterIndex(index);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    },
    [chaptersLength]
  );

  return {
    activeChapterIndex,
    onChapterSelect,
  };
}
