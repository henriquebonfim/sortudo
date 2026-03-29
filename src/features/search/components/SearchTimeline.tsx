import { LoadingBalls } from '@/components/shared/LoadingBalls';
import { SearchForm } from './SearchForm';
import { useLookup } from '@/features/lookup/useLookup';

export function SearchTimeline() {
  const {
    inputs,
    handleChange,
    isValid,
    hasDuplicates,
    handleSearch,
    loading,
    drawCount
  } = useLookup(true);

  if (loading) return <div className="py-24"><LoadingBalls /></div>;

  return (
    <div className="space-y-12">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-display font-bold text-foreground sm:text-4xl">
          Já fui sorteado?
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Informe 6 números e descubra quantas vezes essa combinação (ou parte dela) já foi sorteada.
        </p>
      </div>

      <SearchForm
        inputs={inputs}
        onChange={handleChange}
        hasDuplicates={hasDuplicates}
        isValid={isValid}
        onSearch={handleSearch}
        drawCount={drawCount}
      />
    </div>
  );
}
