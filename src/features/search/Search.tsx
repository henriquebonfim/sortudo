import { useLookup } from '@/application/useLookup';
import { LoadingBalls, ResultBanner } from '@/features/shared';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchCode, Search as SearchIcon } from 'lucide-react';

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
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

/**
 * Search input form.
 */
function NumberInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: boolean }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={2}
      value={value}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/g, "");
        if (v === "" || (Number(v) >= 1 && Number(v) <= 60)) onChange(v);
      }}
      placeholder="?"
      className={[
        "h-14 w-14 rounded-full border-2 bg-card text-center",
        "font-mono text-lg font-semibold text-foreground",
        "outline-none transition-all tabular-nums placeholder:text-muted-foreground/30",
        "sm:h-16 sm:w-16 sm:text-xl",
        error
          ? "border-hot shadow-[0_0_12px_hsl(var(--hot)/0.3)]"
          : value
            ? "border-primary shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
            : "border-border focus:border-primary",
      ].join(" ")}
    />
  );
}


function SearchForm({ inputs, onChange, hasDuplicates, isValid, onSearch, drawCount }: {
  inputs: string[];
  onChange: (idx: number, val: string) => void;
  hasDuplicates: boolean;
  isValid: boolean;
  onSearch: () => void;
  drawCount: number;
}) {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-10">
      <div className="glass-card p-8 md:p-12 w-full rounded-[32px] border-primary/10 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60 font-bold text-center mb-8">
          ESCOLHA 6 NÚMEROS (1–60)
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {inputs.map((val, idx) => (
            <NumberInput
              key={idx}
              value={val}
              onChange={(v) => onChange(idx, v)}
              error={val !== '' && inputs.filter((x) => x === val && x !== '').length > 1}
            />
          ))}
        </div>

        {hasDuplicates && (
          <p className="mt-8 text-center text-sm font-bold text-hot tracking-wide animate-bounce">
            Números repetidos não são permitidos.
          </p>
        )}
      </div>

      <button
        onClick={onSearch}
        disabled={!isValid}
        className="btn-generate cursor-pointer w-72 h-16 flex items-center justify-center gap-3 transition-all active:scale-95 group"
      >
        <SearchCode className="w-4 h-4  group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        Buscar
      </button>
    </div>
  );
}
