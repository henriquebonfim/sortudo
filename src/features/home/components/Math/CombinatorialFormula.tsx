import { TOTAL_COMBINATIONS, MAX_LOTTERY_NUMBER, BALLS_PER_DRAW } from "@/domain/lottery/lottery.constants";
import { AnimatedCounter } from "../Hero/AnimatedCounter";
import { fadeUp } from "../Common/shared-animations";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/formatters";

export function CombinatorialFormula() {
  const nMinusK = MAX_LOTTERY_NUMBER - BALLS_PER_DRAW;

  return (
    <motion.div variants={fadeUp} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-bold text-sm font-mono">*</span>
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground">
          Análise Combinatória
        </h2>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed">
        A Mega-Sena consiste em escolher <strong className="text-foreground">{BALLS_PER_DRAW}
          {" "}números de {MAX_LOTTERY_NUMBER}</strong>. O total de combinações possíveis é calculado por:
      </p>

      {/* Formula display */}
      <div className="glass-card p-5 border-l-4 border-l-primary font-mono">
        <div className="text-center space-y-2">
          <div className="text-muted-foreground text-sm">
            C(n, k) ={" "}
            <span className="inline-flex flex-col items-center leading-none mx-1">
              <span className="text-foreground border-b border-muted-foreground px-1 text-xs">n!</span>
              <span className="text-foreground px-1 text-xs">k! · (n−k)!</span>
            </span>
          </div>
          <div className="text-primary text-sm mt-3">
            C({MAX_LOTTERY_NUMBER}, {BALLS_PER_DRAW}) ={" "}
            <span className="inline-flex flex-col items-center leading-none mx-1">
              <span className="text-foreground border-b border-muted-foreground px-1 text-xs">{MAX_LOTTERY_NUMBER}!</span>
              <span className="text-foreground px-1 text-xs">{BALLS_PER_DRAW}! · {nMinusK}!</span>
            </span>{" "}
            =
          </div>
          <div className="text-3xl md:text-4xl font-bold text-primary pt-1">
            <AnimatedCounter target={TOTAL_COMBINATIONS} duration={2000} />
          </div>
          <p className="text-xs text-muted-foreground">combinações possíveis</p>
        </div>
      </div>

      <div className="educational-box">
        <p className="terminal-text text-sm">
          São mais de <strong className="text-primary">{formatNumber(Math.floor(TOTAL_COMBINATIONS / 1_000_000))} milhões</strong> de
          combinações únicas — e você tem apenas uma por bilhete de R$ 6,00.
        </p>
      </div>
    </motion.div>
  );
}
