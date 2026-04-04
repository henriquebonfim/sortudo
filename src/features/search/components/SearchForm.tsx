import { NumberInput } from '@/components/shared/NumberInput';
import { formatNumber } from '@/lib/formatters';

interface SearchFormProps {
  inputs: string[];
  onChange: (idx: number, val: string) => void;
  hasDuplicates: boolean;
  isValid: boolean;
  onSearch: () => void;
  drawCount: number;
}

export function SearchForm({ inputs, onChange, hasDuplicates, isValid, onSearch, drawCount }: SearchFormProps) {
  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-8">

      {/* Input cluster — wrapped in a glass container */}
      <div className="glass-card p-6 md:p-8 w-full">
        <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium text-center mb-6">
          Escolha 6 números (1–60)
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
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
          <p className="mt-5 text-center text-sm font-semibold text-hot tracking-wide">
            Números repetidos não são permitidos.
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={onSearch}
        disabled={!isValid}
        className="btn-generate cursor-pointer w-72 flex items-center justify-center gap-2"
        aria-label="Buscar sorteios"
      >
        Buscar nos {formatNumber(drawCount)} sorteios
      </button>
    </div>
  );
}
