import {
  CaseStudy,
  ClosingQuote,
  CombinatorialSection,
  FeaturesGrid,
  HeroSection,
  IndependenceSection,
  MathSection,
  MoneyFlowTeaser,
  ProbabilitySection,
  OddsStorySection
} from "@/features/home/components";

export default function HeroPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesGrid />
      <IndependenceSection />
      <MoneyFlowTeaser />
      <ProbabilitySection />
      <CombinatorialSection />
            <MathSection />
      <OddsStorySection />
      <CaseStudy />
      <ClosingQuote />
    </div>
  );
}
