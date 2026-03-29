import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLotteryStore } from '@/application/useLotteryStore';
import type { SearchResult } from '@/domain/lottery/lottery.types';
import { useNavigate, useParams } from 'react-router-dom';

export function useLookup(isTimeline = false) {
  const { draws, initialized } = useLotteryStore();
  const search = useLotteryStore((state) => state.search);
  const { jogo } = useParams<{ jogo?: string }>();
  const navigate = useNavigate();

  const loading = !initialized;
  const drawCount = useMemo(() => draws.length, [draws.length]);

  const initialNums = useMemo(() => {
    if (!jogo) return [];
    return jogo.split(/[- ,]/).filter(Boolean).slice(0, 6);
  }, [jogo]);

  const [inputs, setInputs] = useState<string[]>(
    initialNums.length === 6 ? initialNums : ['', '', '', '', '', '']
  );
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searched, setSearched] = useState(false);

  const handleChange = useCallback((idx: number, val: string) => {
    setInputs((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isTimeline && initialNums.length === 6) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputs(initialNums);
    }
  }, [initialNums, isTimeline]);

  const numbers = inputs.map(Number).filter((n) => n >= 1 && n <= 60);
  const hasDuplicates = new Set(numbers).size < numbers.length;
  const isValid = numbers.length === 6 && !hasDuplicates;

  const handleSearch = useCallback(async () => {
    if (!isValid) return;
    if (isTimeline) {
      navigate(`/buscar/${inputs.join('-')}`, { replace: true });
      return;
    }
    const res = await search(numbers);
    setResult(res);
    setSearched(true);
    navigate(`/buscar/${inputs.join('-')}`, { replace: true });
  }, [isValid, numbers, search, inputs, navigate, isTimeline]);

  useEffect(() => {
    if (!isTimeline && initialized && isValid && initialNums.length === 6 && !searched) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSearch();
    }
  }, [initialized, isValid, initialNums.length, searched, handleSearch, isTimeline]);

  return {
    inputs,
    handleChange,
    isValid,
    hasDuplicates,
    handleSearch,
    result,
    searched,
    loading,
    drawCount
  };
}
