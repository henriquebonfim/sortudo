import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { PROB_QUADRA, PROB_QUINA, PROB_SENA, TOTAL_COMBINATIONS, TICKET_PRICE } from "@/domain/lottery/lottery.constants";
import { stagger, fadeUp, tooltipStyle } from "@/features/home/components/shared-animations";
import { formatCurrency, formatNumber } from "@/lib/formatters";

const probData = [
  {
    name: "Sena (6/6)",
    odds: TOTAL_COMBINATIONS,
    label: `1 em ${formatNumber(TOTAL_COMBINATIONS)}`,
    color: "hsl(0 84% 60%)",
  },
  {
    name: "Quina (5/6)",
    odds: Math.round(1 / PROB_QUINA),
    label: `1 em ${formatNumber(Math.round(1 / PROB_QUINA))}`,
    color: "hsl(38 92% 50%)",
  },
  {
    name: "Quadra (4/6)",
    odds: Math.round(1 / PROB_QUADRA),
    label: `1 em ${formatNumber(Math.round(1 / PROB_QUADRA))}`,
    color: "hsl(142 71% 45%)",
  },
];

export function ProbabilitySection() {
  const thresholdDraws = Math.round(TOTAL_COMBINATIONS / 2);
  const thresholdCost = thresholdDraws * TICKET_PRICE;

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
          <motion.div variants={fadeUp} className="glass-card p-5 order-2 md:order-1">
            <h3 className="font-display font-bold text-base text-foreground mb-1">
              Odds por faixa de prêmio
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              1-em-N para acertar cada faixa (escala logarítmica)
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={probData} layout="vertical">
                <XAxis
                  type="number"
                  scale="log"
                  domain={[1, 100_000_000]}
                  tickFormatter={(v: number) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(0)}M`
                      : v >= 1_000
                        ? `${(v / 1_000).toFixed(0)}k`
                        : String(v)
                  }
                  tick={{ fill: "hsl(215 16% 47%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tick={{ fill: "hsl(215 16% 47%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(_: number, __: string, props: { payload?: { label?: string } }) => [
                    props.payload?.label ?? "",
                    "Chance",
                  ]}
                />
                <Bar dataKey="odds" radius={[0, 4, 4, 0]}>
                  {probData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Text */}
          <motion.div variants={fadeUp} className="space-y-4 order-1 md:order-2">
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

            <div className="space-y-3">
              {[
                {
                  label: "Sena (6 acertos)",
                  prob: PROB_SENA,
                  odds: `1 em ${formatNumber(TOTAL_COMBINATIONS)}`,
                  color: "text-hot",
                },
                {
                  label: "Quina (5 acertos)",
                  prob: PROB_QUINA,
                  odds: `1 em ${formatNumber(Math.round(1 / PROB_QUINA))}`,
                  color: "text-primary",
                },
                {
                  label: "Quadra (4 acertos)",
                  prob: PROB_QUADRA,
                  odds: `1 em ${formatNumber(Math.round(1 / PROB_QUADRA))}`,
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
