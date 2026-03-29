import { useLotteryMath } from "@/application/selectors/useLotteryMath";
import { fadeUp, stagger } from "@/features/home/components/Common/shared-animations";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { motion } from "framer-motion";
import { ProbabilityChart } from "./ProbabilityChart";
import { probData } from "./probability.constants";
import { SectionHeader } from "@/components/shared";

export function ProbabilitySection() {
  const { thresholdDraws, thresholdCost } = useLotteryMath();

  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          {/* Chart */}
          <ProbabilityChart />

          {/* Text */}
          <motion.div variants={fadeUp} className="space-y-6 order-1 md:order-2">
            <SectionHeader title="Probabilidade de Ganhar" />

            <p className="text-muted-foreground text-sm leading-relaxed">
              A chance de acertar todos os 6 números com uma aposta simples é:
            </p>

            <div className="space-y-3">
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
                  <span className="text-sm text-muted-foreground font-mono">{label}</span>
                  <span className={`text-sm font-bold font-mono ${color}`}>{odds}</span>
                </div>
              ))}
            </div>

            <div className="educational-box">
              <p className="terminal-text text-sm">
                Para ter ~50% de chance de ganhar a Sena, você precisaria jogar
                <strong className="text-primary"> {formatNumber(thresholdDraws)} vezes</strong> — gastando
                {" "}<strong className="text-primary">{formatCurrency(thresholdCost)}</strong>.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
