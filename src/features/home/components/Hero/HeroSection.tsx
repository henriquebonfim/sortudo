import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/features/home/components";
import { useAggregatedRevenue } from "@/application/selectors/useAggregatedRevenue";
import { motion } from "framer-motion";
import { ArrowDown, Dices } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  const { totalBillions, fractionBillions, drawCount, yearsOfOperation } = useAggregatedRevenue();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-grid">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container relative z-10 text-center py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-6">
            Dados educativos sobre a Mega-Sena
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tight text-balance mb-6 text-foreground">
            A sorte é um <span className="text-gradient-gold">erro de cálculo</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Descubra como a matemática explica a Mega-Sena, quanto os brasileiros já apostaram, e por que o sistema é desenhado para a casa nunca perder.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <div className="glass-card inline-flex flex-col items-center p-6 md:p-8 gold-glow">
            <span className="stat-label mb-3 text-sm md:text-base">
              Arrecadação histórica da Mega-Sena
            </span>
            <span className="text-4xl md:text-6xl font-mono font-bold text-primary tabular-nums">
              R$ <AnimatedCounter target={totalBillions} duration={2500} />,
              <AnimatedCounter target={fractionBillions} duration={2800} /> bi
            </span>
            <span className="text-xs text-muted-foreground mt-2 font-mono">
              {drawCount.toLocaleString('pt-BR')} sorteios analisados ({yearsOfOperation} anos)
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-base px-8 py-7 rounded-2xl shadow-xl hover:shadow-primary/20 transition-all border-none"
          >
            <Link to="/#simular">
              <Dices className="mr-2 h-6 w-6" />
              Gerador da Sorte
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
