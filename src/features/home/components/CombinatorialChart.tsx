import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fadeUp, tooltipStyle } from "./shared-animations";
import { ComboEntry } from "@/domain/math/combinations.utils";

export function CombinatorialChart({ combosTable }: { combosTable: ComboEntry[] }) {
  return (
    <motion.div variants={fadeUp} className="glass-card p-5">
      <h3 className="font-display font-bold text-base text-foreground mb-1">
        C(n, 6): combinações por nº de dezenas escolhidas
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Mais números = mais combinações mas também mais custo
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={combosTable}>
          <defs>
            <linearGradient id="gradCombos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fill: "hsl(215 16% 47%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
            tick={{ fill: "hsl(215 16% 47%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => [v.toLocaleString("pt-BR"), "Combinações"]}
            labelFormatter={(l: string) => `Escolhendo ${l} de 20`}
          />
          <Area
            type="monotone"
            dataKey="combos"
            stroke="hsl(38 92% 50%)"
            fill="url(#gradCombos)"
            strokeWidth={2}
            dot={{ fill: "hsl(38 92% 50%)", r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
