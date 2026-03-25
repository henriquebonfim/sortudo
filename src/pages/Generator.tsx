import { useLotteryStore } from '@/application/useLotteryStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { MAX_LOTTERY_NUMBER } from '@/domain/lottery/lottery.constants';
import type { SearchResult } from '@/domain/lottery/lottery.types';
import {
  BallDisplay,
  ContextMessage,
  GenerationStats,
  ModeSelector,
} from '@/features/generator/components';
import {
  EducationalNote,
  JackpotDetails,
  MatchesTable,
  ResultBanner,
  ShareButton
} from '@/features/search/components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GenerationMode, NumberGenerator } from '@/domain/lottery/generators/number-generator';


const SHUFFLE_TICKS = 15;
const SHUFFLE_INTERVAL_MS = 80;

export default function GeneratorPage() {
  const stats = useLotteryStore((state) => state.stats);
  const draws = useLotteryStore((state) => state.draws);
  const initialized = useLotteryStore((state) => state.initialized);
  const simulationCount = useLotteryStore((state) => state.simulationCount);
  const search = useLotteryStore((state) => state.search);
  const incrementSimulation = useLotteryStore((state) => state.incrementSimulation);
  const freq = stats?.frequencies;
  const navigate = useNavigate();
  const [mode, setMode] = useState<GenerationMode>('random');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [shuffling, setShuffling] = useState(false);
  const [displayNums, setDisplayNums] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const shuffleInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searched, setSearched] = useState(false);

  const hotNumbers = useMemo(() => freq ? freq.ranking.slice(0, 20).map((r) => r.number) : [], [freq]);
  const coldNumbers = useMemo(() => freq ? freq.ranking.slice(-20).map((r) => r.number) : [], [freq]);


  const generate = useCallback(() => {
    if (!freq) return;
    setShuffling(true);
    const finalNums = NumberGenerator.generate(mode, { hotNumbers, coldNumbers, draws });

    let count = 0;
    if (shuffleInterval.current) clearInterval(shuffleInterval.current);
    shuffleInterval.current = setInterval(() => {
      setDisplayNums(Array.from({ length: 6 }, () => Math.floor(Math.random() * MAX_LOTTERY_NUMBER) + 1));
      count++;
      if (count > SHUFFLE_TICKS) {
        if (shuffleInterval.current) clearInterval(shuffleInterval.current);
        setDisplayNums(finalNums);
        setNumbers(finalNums);
        setShuffling(false);
        incrementSimulation();
      }
    }, SHUFFLE_INTERVAL_MS);
  }, [mode, freq, hotNumbers, coldNumbers, draws, incrementSimulation]);

  const handleSearch = useCallback(async () => {
    if (numbers.length !== 6) return;
    const res = await search(numbers);
    setResult(res);
    setSearched(true);
  }, [numbers, search]);

  useEffect(() => {
    if (numbers.length === 6) {
      handleSearch();
    } else {
      setResult(null);
      setSearched(false);
    }
  }, [numbers, handleSearch]);


  useEffect(() => {
    return () => {
      if (shuffleInterval.current) clearInterval(shuffleInterval.current);
    };
  }, []);


  return (
    <div className="container py-24">
      <PageHeader
        title="Gerador de Apostas"
        subtitle="🎲 Seja na fé ou na sorte, todas as combinações têm a mesma chance."
      />

      <ModeSelector
        currentMode={mode}
        onModeChange={setMode}
        disabled={shuffling}
      />

      <GenerationStats totalGenerated={simulationCount} />
      <BallDisplay
        displayNums={displayNums}
        shuffling={shuffling}
        freq={freq}
      />

      <div className="mt-8 text-center">
        <button
          onClick={generate}
          disabled={shuffling}
          className="rounded-lg bg-primary px-8 py-3 font-display text-base font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
        >
          {shuffling ? '🎲 Gerando...' : '🎲 Gerar'}
        </button>
      </div>

      <ContextMessage
        mode={mode}
        hasNumbers={numbers.length > 0}
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
