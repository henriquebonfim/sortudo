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

export function GeneratorTimeline() {
  const { mode, setMode, numbers, displayNums, shuffling, result, searched, generate, simulationCount, freq } = useSimulator();

  return (
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-display font-bold text-foreground sm:text-4xl">
          Gerador de Apostas
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          🎲 A máquina não tem superstição. Matematicamente, qualquer combinação gerada aqui tem a mesma chance que a sua.
        </p>
      </div>

      <ModeSelector
        currentMode={mode}
        onModeChange={setMode}
        disabled={shuffling}
      />

      <GenerationStats totalGenerated={simulationCount} />
      
      <div className="flex flex-col items-center justify-center space-y-8">
        <BallDisplay
          displayNums={displayNums}
          shuffling={shuffling}
          freq={freq}
        />

        <div className="mt-8 text-center">
          <button
            id="gerar"
            onClick={generate}
            disabled={shuffling || !freq}
            title={!freq ? "Carregando dados..." : undefined}
            className="rounded-lg bg-primary px-8 py-3 font-display text-base font-semibold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50"
          >
            {!freq ? 'Carregando...' : shuffling ? '🎲 Gerando...' : '🎲 Gerar'}
          </button>
        </div>
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
