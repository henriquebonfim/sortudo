import { useLotteryStore } from '@/store/lottery';

export function useLotteryActions() {
  const initialize = useLotteryStore((s) => s.initialize);
  const loadFromFile = useLotteryStore((s) => s.loadFromFile);

  return {
    initialize,
    loadFromFile,
  };
}
