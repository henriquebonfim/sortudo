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
    <div className="mt-8 card-surface p-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
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
        <p className="mt-3 text-center text-sm text-hot">Números repetidos não são permitidos.</p>
      )}

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onSearch}
          disabled={!isValid}
          className="rounded-lg bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buscar nos {formatNumber(drawCount)} sorteios →
        </button>
      </div>
    </div>
  );
}
