import { LoadingBalls } from "@/features/shared/LoadingBalls";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function AnalyticsLoading() {
  return (
    <div className="container py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <LoadingBalls />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-3">
          Dashboard <span className="text-gradient-gold">Analítico</span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed animate-pulse">
          Sincronizando dados dos sorteios históricos...
        </p>
      </motion.div>
    </div>
  );
}

export function AnalyticsEmpty() {
  return (
    <div className="container py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-7 h-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-3">
          Dashboard <span className="text-gradient-gold">Analítico</span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          O banco de dados de sorteios está vazio e as informações não estão sincronizadas.
        </p>
      </motion.div>
    </div>
  );
}
