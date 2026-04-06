import { useLotteryStore } from '@/store/lottery';
import { useSearchStore } from '../store';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function useLookup(isTimeline = false) {
  const gamesCount = useLotteryStore((s) => s.games.length);
  const initialized = useLotteryStore((s) => s.initialized);
  const { inputs, setInput, result, searched, loading, search, resetInputs } = useSearchStore();

  const { jogo } = useParams<{ jogo?: string }>();
  const navigate = useNavigate();

  const numbers = inputs.map(Number).filter((n) => n >= 1 && n <= 60);
  const isValid = numbers.length === 6 && new Set(numbers).size === 6;

  // Initialize from URL
  useEffect(() => {
    if (jogo) {
      const parts = jogo.split(/[- ,]/).filter(Boolean).slice(0, 6);
      if (parts.length === 6) {
        resetInputs(parts);
      }
    }
  }, [jogo, resetInputs]);

  const handleSearch = useCallback(async () => {
    if (!isValid) return;

    if (isTimeline) {
      navigate(`/buscar/${inputs.map((n) => Math.floor(Number(n))).join('-')}`, { replace: true });
      return;
    }

    await search();
    navigate(`/buscar/${inputs.map((n) => Math.floor(Number(n))).join('-')}`, { replace: true });
  }, [isValid, inputs, navigate, isTimeline, search]);

  return {
    inputs,
    handleChange: setInput,
    isValid,
    hasDuplicates: new Set(numbers).size !== numbers.length,
    handleSearch,
    result,
    searched,
    loading: loading || !initialized,
    drawCount: gamesCount,
  };
}
