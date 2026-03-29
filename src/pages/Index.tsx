import {
  CaseStudy,
  ClosingQuote,
  CombinatorialFormulaSection,
  ComboTableSection,
  FeaturesGrid,
  HeroSection,
  IndependenceSection,
  MathSection,
  MoneyFlowTeaser,
  ProbabilitySection,
  OddsStorySection,
  HistorySection,
  MethodologySection
} from "@/features/home/components";
import { SearchTimeline } from "@/features/search/components";
import { GeneratorTimeline } from "@/features/generator/components";
import { ScrollSection } from "@/components/shared/ScrollSection";

export default function HeroPage() {
  return (
    <div className="min-h-screen">
      {/* Chapter 0: Hero */}
      <HeroSection />
      
      {/* Chapter 1: The Shock */}
      <ScrollSection id="probabilidade" className="bg-muted/30">
        <OddsStorySection />
      </ScrollSection>

      {/* Chapter 2: Busting the Myth */}
      <ScrollSection id="independencia">
        <IndependenceSection />
      </ScrollSection>

      {/* Chapter 3: The Economic Reveal */}
      <ScrollSection id="arrecadacao" className="bg-muted/30">
        <MoneyFlowTeaser />
      </ScrollSection>

      {/* Chapter 4: Math & Data Deep Dive */}
      <ScrollSection>
        <MathSection />
      </ScrollSection>

      <ScrollSection className="bg-muted/30">
        <ProbabilitySection />
      </ScrollSection>
 
      <ScrollSection>
        <CombinatorialFormulaSection />
      </ScrollSection>

      <ScrollSection className="bg-muted/30">
        <ComboTableSection />
      </ScrollSection>

      {/* Chapter 5: Interactive Simulation */}
      <ScrollSection id="simular" className="border-t border-border">
        <GeneratorTimeline />
      </ScrollSection>
 
      {/* Chapter 6: Search & Exploration */}
      <ScrollSection id="buscar" className="bg-muted/30 border-t border-border">
        <SearchTimeline />
      </ScrollSection>

      {/* Chapter 7: History & Case Study */}
      <ScrollSection>
        <HistorySection />
      </ScrollSection>

      <ScrollSection className="bg-muted/30 border-y border-border">
        <CaseStudy />
      </ScrollSection>

      {/* Chapter 8: Methodology, Navigation & Closing */}
      <ScrollSection>
        <MethodologySection />
      </ScrollSection>

      <ScrollSection className="bg-muted/30 py-12">
        <div className="container px-4 text-center mb-10">
          <h2 className="text-2xl font-bold">O que mais você quer descobrir?</h2>
        </div>
        <FeaturesGrid />
      </ScrollSection>

      <ScrollSection className="bg-primary/5">
        <ClosingQuote />
      </ScrollSection>
    </div>
  );
}
