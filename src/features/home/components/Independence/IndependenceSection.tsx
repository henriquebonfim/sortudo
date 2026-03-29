import { motion } from "framer-motion";
import { CoinFlipDemo } from "@/features/home/components";
import { stagger, fadeUp } from "@/features/home/components/Common/shared-animations";
import { RefreshCcw, Info, Zap, AlertTriangle } from "lucide-react";
import { SectionHeader } from "@/components/shared";

export function IndependenceSection() {
  return (
    <div className="container px-4 md:px-0">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
      >
        <motion.div variants={fadeUp} className="space-y-6">
          <SectionHeader 
            title={<>O Mito do <span className="text-gradient-gold">Número Quente</span></>}
            icon={<RefreshCcw className="text-primary w-6 h-6" />}
          />
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Muitos jogadores acreditam que se um número saiu no último sorteio, ele tem "mais chance" (ou "menos chance") de sair de novo. 
            <strong> Isso é uma ilusão cognitiva.</strong>
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
              <Zap className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider mb-1">Independência Total</h4>
                <p className="text-sm text-muted-foreground">O sorteador mecânico é reiniciado do zero absoluto a cada extração. As bolas físicas não possuem histórico ou memória.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider mb-1">Falácia do Apostador</h4>
                <p className="text-sm text-muted-foreground">A falsa crença de que um número "atrasado" tem mais chance de sair hoje é o viés cognitivo que enriquece a banca.</p>
              </div>
            </div>
          </div>

          <div className="educational-box p-6 bg-primary/5 border border-primary/20 rounded-2xl">
            <p className="terminal-text text-sm font-mono text-primary flex items-center gap-2 mb-2">
              <Info className="w-4 h-4" /> Matemática Pura:
            </p>
            <p className="font-mono text-sm leading-relaxed text-foreground">
              P(A ∩ B) = P(A) × P(B)
              <br />
              <span className="text-muted-foreground mt-2 block">
                A chance da bola 10 sair hoje é exatamente <strong className="text-primary underline">1/60</strong>, 
                independente de ela ter saído ontem, hoje, ou nunca.
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="relative">
          <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full -z-10" />
          <CoinFlipDemo />
        </motion.div>
      </motion.div>
    </div>
  );
}
