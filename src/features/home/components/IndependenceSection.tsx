import { motion } from "framer-motion";
import { CoinFlipDemo } from "@/features/home/components";
import { stagger, fadeUp } from "@/features/home/components/shared-animations";

export function IndependenceSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 items-start"
        >
          <motion.div variants={fadeUp} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm font-mono">*</span>
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground">
                Independência dos Sorteios
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Cada sorteio é um <strong className="text-foreground">evento independente</strong>.
              Isso decorre diretamente da teoria da probabilidade:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 font-bold">→</span>
                Não importa se um número saiu muitas vezes antes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 font-bold">→</span>
                A chance permanece a mesma em cada sorteio
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5 font-bold">→</span>
                P(A) não se altera com base em resultados de B, C, D...
              </li>
            </ul>
            <div className="educational-box">
              <p className="terminal-text text-sm">
                P(A ∩ B) = P(A) × P(B)
                <br />
                <span className="text-muted-foreground">
                  Cada bola tem exatamente <strong className="text-primary">1/60</strong> de
                  chance. Sempre. Em todo sorteio.
                </span>
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <CoinFlipDemo />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
