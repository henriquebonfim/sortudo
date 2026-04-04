import { useLotteryMath } from "@/application/selectors";
import { motion } from "framer-motion";
import { PiggyBank, Smartphone, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { MoneyFlowChart } from "./MoneyFlowChart";
import { MoneyFlowList } from "./MoneyFlowList";
import { getRevenueDistributionData } from "./money-flow.constants";

export function MoneyFlowTeaser() {
  const { expectedReturn: expected } = useLotteryMath();
  const [isOnline, setIsOnline] = useState(false);

  const distributionData = useMemo(() => getRevenueDistributionData(isOnline), [isOnline]);


  return (
    <section className="container max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center p-4 bg-green-500/10 rounded-3xl mb-6 ring-1 ring-green-500/20">
          <PiggyBank className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight leading-tight">
          O <span className="text-gradient-gold">Paraíso</span> da Banca
        </h2>

        <p className="text-xl text-muted-foreground leading-relaxed">
          A Mega-Sena é uma das formas mais eficientes de arrecadação do Estado.
          Apenas <span className="text-foreground font-bold">{expected.returnPercentage}%</span> de tudo o que é pago pelos apostadores retorna como prêmio. O restante tem destino certo.
        </p>
      </motion.div>

      <div className="flex bg-secondary/50 p-1 rounded-xl mb-12 w-fit mx-auto border border-border">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <MoneyFlowChart distributionData={distributionData} expectedStats={expected} />
        <MoneyFlowList data={distributionData} />
      </div>


    </section>
  );
}
