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
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <input
      id={id}
      aria-label={ariaLabel}
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
        'h-12 w-12 rounded-full border-2 bg-card text-center',
        'font-mono text-base font-semibold text-foreground',
        'outline-none transition-all tabular-nums placeholder:text-muted-foreground/30',
        'sm:h-14 sm:w-14 sm:text-lg md:h-16 md:w-16 md:text-xl',
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
      <div className="glass-card w-full rounded-3xl border-primary/10 p-5 shadow-2xl sm:p-8 md:p-10">
        <p className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 sm:mb-8 sm:text-xs sm:tracking-[0.3em]">
          {searchType === 'numbers'
            ? `ESCOLHA 6 NÚMEROS (1–${MAX_LOTTERY_NUMBER})`
            : `DIGITE O NÚMERO DO CONCURSO (1–${drawCount})`}
        </p>

        {searchType === 'numbers' ? (
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
            {inputs.map((val, idx) => (
              <NumberInput
                key={idx}
                id={`search-number-input-${idx}`}
                ariaLabel={`Número ${idx + 1}`}
                value={val}
                onChange={(v) => onChange(idx, v)}
                error={val !== '' && inputs.filter((x) => x === val && x !== '').length > 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <label htmlFor="search-contest-id" className="sr-only">
              Número do concurso
            </label>
            <input
              id="search-contest-id"
              type="text"
              inputMode="numeric"
              aria-label="Número do concurso"
              value={contestId}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '');
                if (v === '' || Number(v) <= drawCount) {
                  onContestChange(v);
                }
              }}
              placeholder="Ex: 2000"
              className="h-14 w-full max-w-[14rem] rounded-2xl border-2 border-border bg-card text-center font-mono text-xl font-bold text-foreground shadow-lg outline-none transition-all focus:border-primary sm:h-16 sm:max-w-[16rem] sm:text-2xl"
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
      <div className="container m-auto mt-14 flex flex-col pb-16 sm:mt-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center sm:mb-14"
        >
          <div
            className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-glow-gold/20 sm:mb-6 sm:h-16 sm:w-16"
            style={{
              background: 'linear-gradient(135deg, hsl(43 96% 56% / 0.18), hsl(43 96% 56% / 0.06))',
              border: '1px solid hsl(43 96% 56% / 0.3)',
            }}
          >
            <SearchIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="mb-5 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Já fui <span className="text-gradient-gold">sorteado?</span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg lg:text-xl">
            Explore os{' '}
            <span className="font-semibold text-foreground">
              {drawCount.toLocaleString('pt-BR')}
            </span>{' '}
            sorteios e descubra se sua combinação ou um concurso específico já foi premiado.
          </p>
        </motion.div>

        <section className="flex flex-col items-center py-8 sm:py-12 md:py-16">
          <div className="mb-6 inline-grid w-full max-w-sm grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-1 sm:mb-8">
            <button
              id="search-type-numbers"
              onClick={() => setSearchType('numbers')}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-all sm:px-6 sm:text-sm ${
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
              className={`rounded-xl px-3 py-2 text-xs font-bold transition-all sm:px-6 sm:text-sm ${
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
            <div className="mt-12 sm:mt-16" aria-live="polite" aria-label="Carregando resultados">
              <LoadingBalls />
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-8 rounded-xl border border-hot/20 bg-hot/10 p-4 text-center font-bold text-hot"
            >
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
