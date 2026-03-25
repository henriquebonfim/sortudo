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
      <OddsStorySection />
      <IndependenceSection />
      <MoneyFlowTeaser />
      <ProbabilitySection />
      <CombinatorialSection />
      <MathSection />
      <CaseStudy />
      <ClosingQuote />
    </div>
  );
}
