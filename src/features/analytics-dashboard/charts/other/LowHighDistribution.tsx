import { memo } from "react";
import { motion } from "framer-motion";

export const LowHighDistribution = memo(function LowHighDistribution({
  low,
  high,
}: {
  low: number;
  high: number;
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-muted-foreground mb-2 font-medium">
        Distribuição Baixo (1-30) vs Alto (31-60)
      </p>
      <div className="flex h-8 rounded-lg overflow-hidden">
        <motion.div
          className="flex items-center justify-center text-xs font-mono font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${low}%` }}
          transition={{ duration: 0.8 }}
        >
          {low}%
        </motion.div>
        <motion.div
          className="flex items-center justify-center text-xs font-mono font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${high}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {high}%
        </motion.div>
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
        <span>← Baixos (1-30)</span>
        <span>Altos (31-60) →</span>
      </div>
    </div>
  );
});
