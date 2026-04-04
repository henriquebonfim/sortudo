import {
  ChapterProgress,
  ClosingQuote,
  HeroSection,
  MathSection,
  MoneyFlowTeaser,
  OddsStorySection,
  RecordsSection
} from "@/features/home/components";
import { ScrollSection } from "@/features/shared";

export function Hero() {
  return (
    <div className="min-h-screen bg-grid">
      <ChapterProgress />
      <HeroSection id="inicio" />

      <ScrollSection id="matematica">
        <MathSection />
      </ScrollSection>

      <ScrollSection id="probabilidade">
        <OddsStorySection />
      </ScrollSection>

      <ScrollSection id="arrecadacao">
        <MoneyFlowTeaser />
      </ScrollSection>

      <ScrollSection id="records">
        <RecordsSection />
      </ScrollSection>

      <ScrollSection id="conclusao">
        <ClosingQuote />
      </ScrollSection>
    </div>
  );
}
