import { useLotteryStore } from '@/store/lottery';
import { useSearchStore } from '../store';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export function useLookup(isTimeline = false) {
  const gamesCount = useLotteryStore((s) => s.games.length);
  const initialized = useLotteryStore((s) => s.initialized);
  const {
    inputs,
    setInput,
    contestId,
    setContestId,
    searchType,
    setSearchType,
    lastSearchedContestId,
    result,
    searched,
    loading,
    error,
    search,
    resetInputs,
  } = useSearchStore();

  const { jogo } = useParams<{ jogo?: string }>();
  const { hash } = useLocation();
  const navigate = useNavigate();

  const isInitializing = useRef(false);

  const numbers = inputs.map(Number).filter((n) => n >= 1 && n <= 60);
  const isNumbersValid = numbers.length === 6 && new Set(numbers).size === 6;
  const isContestValid = contestId !== '' && !isNaN(Number(contestId));
  const isValid = searchType === 'numbers' ? isNumbersValid : isContestValid;

  // Initialize from URL
  useEffect(() => {
    const state = useSearchStore.getState();
    let needsReset = false;

    if (jogo) {
      const parts = jogo.split(/[- ,]/).filter(Boolean);
      if (parts.length === 6) {
        const currentPath = state.inputs.map((n) => Math.floor(Number(n))).join('-');
        const newPath = parts.join('-');
        if (currentPath !== newPath || state.searchType !== 'numbers') {
          needsReset = true;
          resetInputs(parts);
        }
      } else if (parts.length === 1 && !isNaN(Number(parts[0]))) {
        if (state.contestId !== parts[0] || state.searchType !== 'contest') {
          needsReset = true;
          resetInputs(parts[0]);
        }
      }
    } else if (hash && hash.startsWith('#')) {
      const id = hash.substring(1);
      if (!isNaN(Number(id))) {
        if (state.contestId !== id || state.searchType !== 'contest') {
          needsReset = true;
          resetInputs(id);
        }
      }
    }

    if (needsReset) {
      isInitializing.current = true;
    }
  }, [jogo, hash, resetInputs]);

  // Perform search automatically ONLY if initialized from URL/Hash
  useEffect(() => {
    if (initialized && !searched && !loading && isInitializing.current) {
      if (searchType === 'numbers' && isNumbersValid) {
        search();
        isInitializing.current = false;
      } else if (searchType === 'contest' && isContestValid) {
        search();
        isInitializing.current = false;
      }
    }
  }, [initialized, searched, loading, searchType, isNumbersValid, isContestValid, search]);

  const handleSearch = useCallback(async () => {
    if (!isValid) return;

    if (searchType === 'numbers') {
      const path = inputs.map((n) => Math.floor(Number(n))).join('-');
      if (isTimeline) {
        navigate(`/buscar/${path}`, { replace: true });
        return;
      }
      await search();
      navigate(`/buscar/${path}`, { replace: true });
    } else {
      await search();
      navigate(`/buscar/#${contestId}`, { replace: true });
    }
  }, [isValid, searchType, inputs, contestId, navigate, isTimeline, search]);

  const handleChange = (idx: number, val: string) => {
    isInitializing.current = false;
    setInput(idx, val);
  };

  const handleContestChange = (val: string) => {
    isInitializing.current = false;
    setContestId(val);
  };

  const handleTypeChange = (type: 'numbers' | 'contest') => {
    isInitializing.current = false;
    setSearchType(type);
  };

  return {
    inputs,
    handleChange,
    contestId,
    handleContestChange,
    searchType,
    setSearchType: handleTypeChange,
    lastSearchedContestId,
    isValid,
    hasDuplicates: searchType === 'numbers' && new Set(numbers).size !== numbers.length,
    handleSearch,
    result,
    searched,
    loading: loading || !initialized,
    error,
    drawCount: gamesCount,
  };
}
