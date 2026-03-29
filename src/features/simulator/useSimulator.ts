import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLotteryStore } from '@/application/useLotteryStore';
import { NumberGenerator, GenerationMode } from '@/domain/lottery/generators/number-generator';
import { MAX_LOTTERY_NUMBER } from '@/domain/lottery/lottery.constants';
import type { SearchResult } from '@/domain/lottery/lottery.types';

const SHUFFLE_TICKS = 15;
const SHUFFLE_INTERVAL_MS = 80;

export function useSimulator() {
  const freq = useLotteryStore(s => s.stats?.frequencies);
  const draws = useLotteryStore(s => s.draws);
  const search = useLotteryStore(s => s.search);
  const incrementSimulation = useLotteryStore(s => s.incrementSimulation);
  const simulationCount = useLotteryStore(s => s.simulationCount);

  const hotNumbers = useMemo(() => freq?.ranking.slice(0, 20).map(r => r.number) ?? [], [freq]);
  const coldNumbers = useMemo(() => freq?.ranking.slice(-20).map(r => r.number) ?? [], [freq]);

  const [mode, setMode] = useState<GenerationMode>('random');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [displayNums, setDisplayNums] = useState<number[]>([0,0,0,0,0,0]);
  const [shuffling, setShuffling] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searched, setSearched] = useState(false);
  const shuffleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generate = useCallback(() => {
    if (!freq || shuffling) return;
    setShuffling(true);
    const finalNums = NumberGenerator.generate(mode, { hotNumbers, coldNumbers, draws });
    let count = 0;
    if (shuffleRef.current) clearInterval(shuffleRef.current);
    shuffleRef.current = setInterval(() => {
      setDisplayNums(Array.from({ length: 6 }, () => Math.floor(Math.random() * MAX_LOTTERY_NUMBER) + 1));
      if (++count > SHUFFLE_TICKS) {
        clearInterval(shuffleRef.current!);
        setDisplayNums(finalNums);
        setNumbers(finalNums);
        setShuffling(false);
        incrementSimulation();
      }
    }, SHUFFLE_INTERVAL_MS);
  }, [mode, freq, hotNumbers, coldNumbers, draws, incrementSimulation, shuffling]);

  const doSearch = useCallback(async () => {
    if (numbers.length !== 6) return;
    const res = await search(numbers);
    setResult(res);
    setSearched(true);
  }, [numbers, search]);

  useEffect(() => {
    if (numbers.length === 6) doSearch();
    else { setResult(null); setSearched(false); }
  }, [numbers, doSearch]);

  useEffect(() => () => { if (shuffleRef.current) clearInterval(shuffleRef.current); }, []);

  return { mode, setMode, numbers, displayNums, shuffling, result, searched, generate, simulationCount, freq };
}
