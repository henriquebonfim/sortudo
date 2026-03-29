import { formatCurrency } from "@/lib/formatters";
import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fadeUp, tooltipStyle } from "../Common/shared-animations";

import { Smartphone, Store } from "lucide-react";
import { useState } from "react";
import { getRevenueDistributionData } from "./money-flow.constants";


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

  const [isOnline, setIsOnline] = useState(false);
  const data = getRevenueDistributionData(isOnline);


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
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={1}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, i) => (
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

      <div className="flex bg-secondary/50 p-1 rounded-xl mb-4 w-fit mx-auto border border-border/50">
        <button
          onClick={() => setIsOnline(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isOnline ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Store className="w-4 h-4" />
          Lotérica Física
        </button>
        <button
          onClick={() => setIsOnline(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isOnline ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Smartphone className="w-4 h-4" />
          Canais Eletrônicos
        </button>
      </div>

      <div className="space-y-2.5 overflow-y-auto pr-2 custom-scrollbar border border-border/50 rounded-xl p-4 bg-background/50">
        {data.map((d) => (
          <div key={d.name}>
            <div className="flex justify-between text-xs mb-1.5 gap-4">
              <div className="flex items-center gap-2 overflow-hidden">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-muted-foreground truncate" title={d.name}>{d.name}</span>
              </div>
              <span className="font-mono font-bold text-foreground whitespace-nowrap">{d.value}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: d.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${d.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
