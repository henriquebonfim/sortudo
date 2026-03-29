import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingBalls } from '@/components/shared/LoadingBalls';
import {
  EducationalNote,
  JackpotDetails,
  MatchesTable,
  ResultBanner,
  SearchForm,
  ShareButton
} from '@/features/search/components';
import { AnimatePresence, motion } from 'framer-motion';
import { useLookup } from '@/features/lookup/useLookup';

export default function SearchPage() {
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

  if (loading) return <div className="container py-24"><LoadingBalls /></div>;

  return (
    <div className="container py-24">
      <PageHeader
        title="Já fui sorteado?"
        subtitle="Informe 6 números e descubra quantas vezes essa combinação (ou parte dela) já foi sorteada."
      />

      <SearchForm
        inputs={inputs}
        onChange={handleChange}
        hasDuplicates={hasDuplicates}
        isValid={isValid}
        onSearch={handleSearch}
        drawCount={drawCount}
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
