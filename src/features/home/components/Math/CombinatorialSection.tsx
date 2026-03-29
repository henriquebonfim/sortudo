import { formatCurrency } from "@/lib/formatters";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/features/home/components/Common/shared-animations";
import { CombinatorialFormula } from "./CombinatorialFormula";
import { CombinatorialChart } from "./CombinatorialChart";
import { useLotteryMath } from "@/application/selectors/useLotteryMath";
import { SectionHeader } from "@/components/shared";

export function CombinatorialFormulaSection() {
  const { combosTable } = useLotteryMath();

  return (
    <div className="container py-20 px-4 md:px-0">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8 items-center"
      >
        <CombinatorialFormula />
        <CombinatorialChart combosTable={combosTable} />
      </motion.div>
    </div>
  );
}

export function ComboTableSection() {
  const fmt = formatCurrency;
  const { expectedReturn: expected, combosTable, ticketPrice } = useLotteryMath();

  return (
    <div className="container py-20 px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <SectionHeader 
          title="Mais Números → Mais Combinações"
          subtitle="Você pode escolher até 20 números por jogo. Ao fazer isso, cria múltiplas combinações de 6 simultaneamente — usando a fórmula C(n, 6):"
          className="mb-8"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
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
              {fmt(84 * ticketPrice)}
            </strong>{" "}
            . A casa sempre leva {expected.percentageLoss}% do valor apostado — independente de quantos números você escolhe.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
