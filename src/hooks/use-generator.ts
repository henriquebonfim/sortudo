import { NumberGenerator } from '@/lib/generator';
import { feedback } from '@/shared/utils';
import { useGeneratorStore } from '@/store/generator';
import { useFrequencies } from '@/store/selectors';
import { useCallback, useEffect, useRef, useState } from 'react';

const SHUFFLE_TICKS = 15;
const SHUFFLE_INTERVAL_MS = 80;

export function useSimulator() {
  const freq = useFrequencies();
  const {
    mode,
    setMode,
    numbers,
    result,
    searched,
    generate: storeGenerate,
    loadNumbers: storeLoadNumbers,
    simulationCount,
  } = useGeneratorStore();

  const [displayNums, setDisplayNums] = useState<number[]>(
    numbers.length === 6 ? numbers : [0, 0, 0, 0, 0, 0]
  );
  const [shuffling, setShuffling] = useState(false);
  const shuffleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generate = useCallback(async () => {
    if (!freq || shuffling) return;

    setShuffling(true);
    let count = 0;

    if (shuffleRef.current) clearInterval(shuffleRef.current);

    shuffleRef.current = setInterval(() => {
      setDisplayNums(NumberGenerator.generateRandomSequence(6));
      feedback.trigger('subtle');

      if (++count > SHUFFLE_TICKS) {
        clearInterval(shuffleRef.current!);
        setShuffling(false);
        storeGenerate(); // This updates the store with final numbers after animation
        feedback.trigger('success');
      }
    }, SHUFFLE_INTERVAL_MS);
  }, [freq, shuffling, storeGenerate]);

  // Sync display nums when final numbers are set in store
  useEffect(() => {
    if (!shuffling && numbers.length === 6) {
      setDisplayNums(numbers);
    }
  }, [numbers, shuffling]);

  const loadNumbers = useCallback(
    (nums: number[]) => {
      if (shuffling) return;
      if (shuffleRef.current) clearInterval(shuffleRef.current);
      storeLoadNumbers(nums);
      setDisplayNums(nums);
    },
    [shuffling, storeLoadNumbers]
  );

  useEffect(
    () => () => {
      if (shuffleRef.current) clearInterval(shuffleRef.current);
    },
    []
  );

  return {
    mode,
    setMode,
    numbers,
    displayNums,
    shuffling,
    result,
    searched,
    generate,
    loadNumbers,
    simulationCount,
    freq,
  };
}
