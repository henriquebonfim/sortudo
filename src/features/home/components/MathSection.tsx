import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { MAX_LOTTERY_NUMBER, BALLS_PER_DRAW } from "@/domain/lottery/lottery.constants";

export function MathSection() {
  const chancePerNumber = (BALLS_PER_DRAW / MAX_LOTTERY_NUMBER) * 100;

  return (
    <section className="py-20 border-t border-border">
      <div className="container max-w-4xl mx-auto text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ type: "spring", stiffness: 200, damping: 30 }}
           className="mb-16"
        >
          <h2 className="text-sm font-mono text-primary tracking-widest uppercase mb-4">
            A Matemática por Trás da Mega-Sena
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Não existe fórmula para prever os números. O que existe são cálculos de
            probabilidade e combinatória que explicam por que o sistema é matematicamente
            perfeito — para eles.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 text-left">
           <div className="glass-card p-5 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-500">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="font-bold text-sm font-mono">Crença comum</span>
              </div>
              <div className="space-y-2 font-mono text-sm text-muted-foreground">
                <p>"Este número não sai há muito tempo — logo vai sair"</p>
                <p>"Esse número saiu 3 vezes seguidas — vai parar de sair"</p>
              </div>
           </div>

           <div className="glass-card p-5 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-500">
                <span className="text-lg">✓</span>
                <span className="font-bold text-sm font-mono">A realidade matemática</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Na prática, <strong className="text-foreground">todos os números têm sempre
                a mesma chance</strong>: exatamente {chancePerNumber.toFixed(2)}% de aparecer em um sorteio.
              </p>
           </div>
        </div>
      </div>
    </section>
  );
}
