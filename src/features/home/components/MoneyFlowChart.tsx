import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/formatters";
import { motion } from "framer-motion";
import { fadeUp, tooltipStyle } from "./shared-animations";
import { REVENUE_DISTRIBUTION_DATA } from "./money-flow.constants";

interface MoneyFlowChartProps {
  expected: {
    betAmount: number;
    returnPercentage: number;
    expectedValue: number;
    percentageLoss: number;
    loss: number;
  };
}

export function MoneyFlowChart({ expected }: MoneyFlowChartProps) {
  const fmt = formatCurrency;

  return (
    <motion.div variants={fadeUp} className="glass-card p-6 top-6 sticky">
      <h3 className="font-display font-bold text-base text-foreground mb-1">
        Destino de cada R$ apostado
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        De R$ 6,00 apostados, apenas R$ 2,60 (43,35%) retornam como prêmio bruto
      </p>
      <div className="flex justify-center items-center">
        <ResponsiveContainer width={240} height={240}>
          <PieChart>
            <Pie
              data={REVENUE_DISTRIBUTION_DATA}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={1}
              dataKey="value"
              stroke="none"
            >
              {REVENUE_DISTRIBUTION_DATA.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number, name: string) => [`${v}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Expected value breakdown */}
      <div className="mt-5 pt-4 border-t border-border space-y-2 font-mono text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Você aposta:</span>
          <span className="text-foreground font-bold">{fmt(expected.betAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Retorno esperado ({expected.returnPercentage}%):</span>
          <span className="text-success font-bold">{fmt(expected.expectedValue)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2">
          <span className="text-muted-foreground">Perda esperada:</span>
          <span className="text-hot font-bold">−{fmt(expected.loss)} (-{expected.percentageLoss}%)</span>
        </div>
      </div>
    </motion.div>
  );
}
