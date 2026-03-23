import {
  CaseStudy,
  ClosingQuote,
  CombinatorialSection,
  FeaturesGrid,
  HeroSection,
  IndependenceSection,
  MathSection,
  MoneyFlowTeaser,
  ProbabilitySection
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
      <CaseStudy />
      <ClosingQuote />
    </div>
  );
}
