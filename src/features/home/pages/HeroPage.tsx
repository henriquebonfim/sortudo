import { ChapterProgress } from '../components/ChapterProgress';
import { ClosingQuote } from '../components/ClosingQuote';
import { HeroSection } from '../components/HeroSection';
import { MathSection } from '../components/MathSection';
import { MoneyFlowTeaser } from '../components/MoneyFlowTeaser';
import { OddsStorySection } from '../components/OddsStorySection';
import { RecordsSection } from '../components/RecordsSection';

export default function HeroPage() {
  return (
    <div className="flex flex-col">
      <ChapterProgress />
      <HeroSection id="inicio" />
      <MathSection id="matematica" />
      <OddsStorySection id="probabilidade" />
      <RecordsSection id="recordes" />
      <MoneyFlowTeaser id="arrecadacao" />
      <ClosingQuote id="conclusao" />
    </div>
  );
}
