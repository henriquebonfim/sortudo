import { formatCurrency } from "@/lib/formatters";
import { motion } from "framer-motion";
import { TICKET_PRICE } from "@/domain/lottery/lottery.constants";
import { RevenueService } from "@/domain/lottery/revenue.service";
import { fadeUp, stagger } from "@/features/home/components/shared-animations";
import { getCombosTable } from "@/domain/math/combinations.utils";
import { CombinatorialFormula } from "./CombinatorialFormula";
import { CombinatorialChart } from "./CombinatorialChart";

const combosTable = getCombosTable();

export function CombinatorialSection() {
  const fmt = formatCurrency;
  const expected = RevenueService.calculateExpectedReturn(TICKET_PRICE);

  return (
    <>
      {/* ── Combinatorial Analysis ─────────────────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Formula card */}
            <CombinatorialFormula />

            {/* Visual: growing combinations chart */}
            <CombinatorialChart combosTable={combosTable} />
          </motion.div>
        </div>
      </section>

      {/* ── More Numbers = More Combinations ──────────────────────────── */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm font-mono">*</span>
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground">
                Mais Números → Mais Combinações
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-2xl">
              Você pode escolher até 20 números por jogo. Ao fazer isso, cria múltiplas
              combinações de 6 simultaneamente — usando a fórmula C(n, 6):
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {combosTable.map(({ n, combos }) => (
                <motion.div
                  key={n}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="glass-card p-4 text-center"
                >
                  <div className="text-2xl font-bold font-mono text-foreground mb-1">
                    {n}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2 font-mono">dezenas</div>
                  <div className="text-lg font-bold font-mono text-primary">
                    {combos.toLocaleString("pt-BR")}
                  </div>
                  <div className="text-xs text-muted-foreground">combinações</div>
                </motion.div>
              ))}
            </div>

            <div className="educational-box mt-6">
              <p className="terminal-text text-sm">
                9 números → 84 combinações. Mas o custo também multiplica: cada aposta de 9
                números custa{" "}
                <strong className="text-primary">
                  {fmt(84 * TICKET_PRICE)}
                </strong>{" "}
                . A casa sempre leva {expected.percentageLoss}% do valor apostado — independente de quantos números você escolhe.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
