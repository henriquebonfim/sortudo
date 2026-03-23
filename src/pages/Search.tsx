import { useLotteryStore } from '@/application/useLotteryStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingBalls } from '@/components/shared/LoadingBalls';
import type { SearchResult } from '@/domain/lottery/lottery.types';
import {
  EducationalNote,
  JackpotDetails,
  MatchesTable,
  ResultBanner,
  SearchForm,
  ShareButton
} from '@/features/search/components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchPage() {
  const { draws, initialized } = useLotteryStore();
  const search = useLotteryStore((state) => state.search);
  const loading = !initialized;
  const drawCount = useMemo(() => draws.length, [draws.length]);
  const [searchParams] = useSearchParams();

  const initialNums = searchParams.get('jogo')?.split(',').slice(0, 6) || [];

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

  const numbers = inputs.map(Number).filter((n) => n >= 1 && n <= 60);
  const hasDuplicates = new Set(numbers).size < numbers.length;
  const isValid = numbers.length === 6 && !hasDuplicates;

  const handleSearch = useCallback(async () => {
    if (!isValid) return;
    const res = await search(numbers);
    setResult(res);
    setSearched(true);
  }, [isValid, numbers, search]);

  useEffect(() => {
    if (initialized && isValid && initialNums.length === 6) {
      handleSearch();
    }
  }, [initialized, isValid, handleSearch, initialNums.length]);


  if (loading) return <div className="container py-24"><LoadingBalls /></div>;

  return (
    <div className="container py-24">
      <PageHeader
        title="Já fui sorteado?"
        subtitle="Informe 6 números e descubra quantas vezes essa combinação (ou parte dela) já foi sorteada."
      />

      <SearchForm
        inputs={inputs}
        onChange={handleChange}
        hasDuplicates={hasDuplicates}
        isValid={isValid}
        onSearch={handleSearch}
        drawCount={drawCount}
      />

      <AnimatePresence>
        {searched && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 space-y-6"
          >
            <ResultBanner result={result} />
            <MatchesTable result={result} />
            <JackpotDetails result={result} />
            <EducationalNote result={result} />
            <ShareButton result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
