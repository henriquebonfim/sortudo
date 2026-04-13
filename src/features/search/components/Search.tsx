import { useSearch } from '@/hooks/use-search';
import { LoadingBalls } from '@/shared/components/LoadingBalls';
import { ResultBanner } from '@/shared/components/ResultBanner';
import { MAX_LOTTERY_NUMBER } from '@/shared/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';

function NumberInput({
  value,
  onChange,
  error,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  id?: string;
}) {
  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      maxLength={2}
      value={value}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, '');
        if (v === '' || (Number(v) >= 1 && Number(v) <= MAX_LOTTERY_NUMBER)) onChange(v);
      }}
      placeholder="?"
      className={[
        'h-14 w-14 rounded-full border-2 bg-card text-center',
        'font-mono text-lg font-semibold text-foreground',
        'outline-none transition-all tabular-nums placeholder:text-muted-foreground/30',
        'sm:h-16 sm:w-16 sm:text-xl',
        error
          ? 'border-hot shadow-[0_0_12px_hsl(var(--hot)/0.3)]'
          : value
            ? 'border-primary shadow-[0_0_12px_hsl(var(--primary)/0.2)]'
            : 'border-border focus:border-primary',
      ].join(' ')}
    />
  );
}

function SearchForm({
  inputs,
  onChange,
  contestId,
  onContestChange,
  searchType,
  hasDuplicates,
  isValid,
  loading,
  onSearch,
  drawCount,
}: {
  inputs: string[];
  onChange: (idx: number, val: string) => void;
  contestId: string;
  onContestChange: (val: string) => void;
  searchType: 'numbers' | 'contest';
  hasDuplicates: boolean;
  isValid: boolean;
  loading: boolean;
  onSearch: () => void;
  drawCount: number;
}) {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-10">
      <div className="glass-card p-8 md:p-12 w-full rounded-[32px] border-primary/10 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60 font-bold text-center mb-8">
          {searchType === 'numbers'
            ? `ESCOLHA 6 NÚMEROS (1–${MAX_LOTTERY_NUMBER})`
            : `DIGITE O NÚMERO DO CONCURSO (1–${drawCount})`}
        </p>

        {searchType === 'numbers' ? (
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {inputs.map((val, idx) => (
              <NumberInput
                key={idx}
                id={`search-number-input-${idx}`}
                value={val}
                onChange={(v) => onChange(idx, v)}
                error={val !== '' && inputs.filter((x) => x === val && x !== '').length > 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <input
              id="search-contest-id"
              type="text"
              inputMode="numeric"
              value={contestId}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '');
                if (v === '' || Number(v) <= drawCount) {
                  onContestChange(v);
                }
              }}
              placeholder="Ex: 2000"
              className="h-16 w-48 rounded-2xl border-2 bg-card text-center font-mono text-2xl font-bold text-foreground outline-none transition-all border-border focus:border-primary shadow-lg"
            />
          </div>
        )}

        {searchType === 'numbers' && hasDuplicates && (
          <p className="mt-8 text-center text-sm font-bold text-hot tracking-wide animate-bounce">
            Números repetidos não são permitidos.
          </p>
        )}
      </div>

      <button
        id="search-submit-button"
        onClick={onSearch}
        disabled={!isValid || loading}
        className="btn-generate cursor-pointer h-12 flex items-center justify-center gap-3 transition-all active:scale-95 group"
      >
        Buscar
      </button>
    </div>
  );
}

export function Search() {
  const {
    inputs,
    handleChange,
    contestId,
    handleContestChange,
    searchType,
    setSearchType,
    isValid,
    hasDuplicates,
    handleSearch,
    lastSearchedContestId,
    result,
    searched,
    loading,
    error,
    drawCount,
  } = useSearch(false);

  return (
    <div className="page-hero">
      <div className="container m-auto flex flex-col mt-16 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-glow-gold/20"
            style={{
              background: 'linear-gradient(135deg, hsl(43 96% 56% / 0.18), hsl(43 96% 56% / 0.06))',
              border: '1px solid hsl(43 96% 56% / 0.3)',
            }}
          >
            <SearchIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight leading-tight">
            Já fui <span className="text-gradient-gold">sorteado?</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explore os{' '}
            <span className="font-semibold text-foreground">
              {drawCount.toLocaleString('pt-BR')}
            </span>{' '}
            sorteios e descubra se sua combinação ou um concurso específico já foi premiado.
          </p>
        </motion.div>

        <section className="py-12 md:py-16 flex flex-col items-center">
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/10">
            <button
              id="search-type-numbers"
              onClick={() => setSearchType('numbers')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                searchType === 'numbers'
                  ? 'bg-primary text-black'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Por Números
            </button>
            <button
              id="search-type-contest"
              onClick={() => setSearchType('contest')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                searchType === 'contest'
                  ? 'bg-primary text-black'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Por Concurso
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
            <SearchForm
              inputs={inputs}
              onChange={handleChange}
              contestId={contestId}
              onContestChange={handleContestChange}
              searchType={searchType}
              hasDuplicates={hasDuplicates}
              isValid={isValid}
              loading={loading}
              onSearch={handleSearch}
              drawCount={drawCount}
            />
          </motion.div>

          {loading && (
            <div className="mt-16">
              <LoadingBalls />
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 rounded-xl bg-hot/10 border border-hot/20 text-hot font-bold text-center">
              {error}
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
                <ResultBanner result={result} contestId={lastSearchedContestId || undefined} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
