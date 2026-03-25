import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fadeUp, tooltipStyle } from "./shared-animations";
import { formatNumber } from "@/lib/formatters";
import { motion } from "framer-motion";
import { PROB_QUADRA, PROB_QUINA, TOTAL_COMBINATIONS } from "@/domain/lottery/lottery.constants";

import { probData } from "./probability.constants";

export function ProbabilityChart() {
  return (
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
  );
}
