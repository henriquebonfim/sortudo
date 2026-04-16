import { ChapterProgress } from '@/features/home/components/ChapterProgress';
import { ClosingQuoteSection } from '@/features/home/components/ClosingQuoteSection';
import { HeroSection } from '@/features/home/components/HeroSection';
import { MathSection } from '@/features/home/components/MathSection';
import { MoneyFlowSection } from '@/features/home/components/MoneyFlowSection';
import { OddsStorySection } from '@/features/home/components/OddsStorySection';
import { RecordsSection } from '@/features/home/components/RecordsSection';
import { SEO } from '@/shared/components/SEO';

export default function HeroPage() {
  return (
    <>
      <SEO />
      <div className="flex flex-col page-hero">
        <ChapterProgress />
        <HeroSection id="inicio" />
        <MathSection id="matematica" />
        <OddsStorySection id="probabilidade" />
        <RecordsSection id="recordes" />
        <MoneyFlowSection id="arrecadacao" />
        <ClosingQuoteSection id="conclusao" />
      </div>
    </>
  );
}
