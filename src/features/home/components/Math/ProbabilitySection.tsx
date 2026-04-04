import { useLotteryMath } from "@/application/selectors/useLotteryMath";
import { formatNumber } from "@/lib/formatters";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useState } from "react";
import { fadeUp, stagger } from "../Common/shared-animations";
import { CombinatorialChart } from "./CombinatorialChart";
import { CombinatorialFormula } from "./CombinatorialFormula";
import { probData } from "./probability.constants";

export function ProbabilitySection() {
  const { thresholdDraws, thresholdCost } = useLotteryMath();
  const [tickets, setTickets] = useState(1);
  const TOTAL_COMBINATIONS = 50063860;

  const probPercentage = ((tickets / TOTAL_COMBINATIONS) * 100).toFixed(6);
  const cost = tickets * 6.00;

  const { combosTable } = useLotteryMath();
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid  grid-cols-2 gap-8 items-baseline"
        >

          <motion.div variants={fadeUp} className="space-y-6  ">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm font-mono">*</span>
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground">
                Probabilidade de Ganhar
              </h2>
            </div>


            <p className="text-muted-foreground text-sm leading-relaxed">
              A chance de acertar todos os 6 números com uma aposta simples é:
            </p>

            <dl className="space-y-3">
              {[
                {
                  label: "Sena (6 acertos)",
                  odds: probData[0].label,
                  color: "text-hot",
                },
                {
                  label: "Quina (5 acertos)",
                  odds: probData[1].label,
                  color: "text-primary",
                },
                {
                  label: "Quadra (4 acertos)",
                  odds: probData[2].label,
                  color: "text-success",
                },
              ].map(({ label, odds, color }) => (
                <div key={label} className="glass-card p-4 flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground font-mono">{label}</dt>
                  <dd className={`text-sm font-bold font-mono ${color}`}>{odds}</dd>
                </div>
              ))}
            </dl>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-border">
              <Zap className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-1">Independência Total</h3>
                <p className="text-sm text-muted-foreground">O sorteador mecânico é reiniciado do zero absoluto a cada extração. As bolas físicas não possuem histórico ou memória.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/50 border border-border">
              <Zap className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider mb-1">P(A ∩ B) = P(A) × P(B)</h3>
                <p className="text-sm text-muted-foreground">A chance da bola 10 sair hoje é exatamente <strong className="text-primary underline">1/60</strong>,
                  independente de ela ter saído ontem, hoje, ou nunca.
                </p>
                <p className="text-sm text-muted-foreground">
                  São mais de <strong className="text-primary">{formatNumber(Math.floor(TOTAL_COMBINATIONS / 1_000_000))} milhões</strong> de
                  combinações únicas — e você tem apenas uma por bilhete de R$ 6,00.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-1 gap-8 items-center"
          >
            <CombinatorialFormula />
            <CombinatorialChart combosTable={combosTable} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
