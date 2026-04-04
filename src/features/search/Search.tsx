import { useLookup } from '@/application/useLookup';
import { LoadingBalls, MatchesTable, ResultBanner, SearchForm, ShareButton } from '@/components/shared';
import { AnimatePresence, motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';

export function Search() {
  const {
    inputs,
    handleChange,
    isValid,
    hasDuplicates,
    handleSearch,
    result,
    searched,
    loading,
    drawCount
  } = useLookup(false);

  return (
    <div className="page-hero">
      <div className="container m-auto flex flex-col mt-16 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-glow-gold/20"
            style={{
              background: 'linear-gradient(135deg, hsl(43 96% 56% / 0.18), hsl(43 96% 56% / 0.06))',
              border: '1px solid hsl(43 96% 56% / 0.3)',
            }}
          >
            <SearchIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight leading-tight">
            Já fui{' '}
            <span className="text-gradient-gold">sorteado?</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explore os {' '}
            <span className="font-semibold text-foreground">
              {drawCount.toLocaleString('pt-BR')}
            </span>{' '}
            sorteios e descubra quantas vezes a combinação já foi sorteada.
          </p>
        </motion.div>

        <section className="py-12 md:py-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
            <SearchForm
              inputs={inputs}
              onChange={handleChange}
              hasDuplicates={hasDuplicates}
              isValid={isValid}
              onSearch={handleSearch}
              drawCount={drawCount}
            />
          </motion.div>

          {loading && (
            <div className="mt-16">
              <LoadingBalls />
            </div>
          )}

          <AnimatePresence>
            {searched && result && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-12 w-full max-w-2xl space-y-5"
              >
                <div className="section-divider" />
                <ResultBanner result={result} />
                <MatchesTable result={result} />
                <div className="flex justify-center pt-2">
                  <ShareButton result={result} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
