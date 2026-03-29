import { PageHeader } from '@/components/layout/PageHeader';
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
import { useSimulator } from '@/features/simulator/useSimulator';

export default function GeneratorPage() {
  const { mode, setMode, numbers, displayNums, shuffling, result, searched, generate, simulationCount, freq } = useSimulator();

  return (
    <div className="container py-24">
      <PageHeader
        title="Gerador de Apostas"
        subtitle="🎲 A máquina não tem superstição. Matematicamente, qualquer combinação gerada aqui tem a mesma chance que a sua."
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
          disabled={shuffling || !freq}
          title={!freq ? "Carregando dados..." : undefined}
          className="rounded-lg bg-primary px-8 py-3 font-display text-base font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
        >
          {!freq ? 'Carregando...' : shuffling ? '🎲 Gerando...' : '🎲 Gerar'}
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
