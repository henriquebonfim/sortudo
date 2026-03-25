import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevenueService } from "@/domain/lottery/revenue.service";
import { TICKET_PRICE } from "@/domain/lottery/lottery.constants";
import { stagger, fadeUp } from "@/features/home/components/shared-animations";
import { REVENUE_DISTRIBUTION_DATA } from "./money-flow.constants";
import { MoneyFlowChart } from "./MoneyFlowChart";

export function MoneyFlowTeaser() {
  const expected = RevenueService.calculateExpectedReturn(TICKET_PRICE);

  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 items-start"
        >
          {/* Chart */}
          <MoneyFlowChart expected={expected} />

          {/* Text */}
          <motion.div variants={fadeUp} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-sm font-mono">*</span>
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground">
                O Sistema É Matematicamente Perfeito
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Para eles. A Mega-Sena retorna apenas{" "}
              <strong className="text-foreground">{expected.returnPercentage}% do arrecadado</strong> em prêmios.
              As piores máquinas caça-níqueis de Las Vegas devolvem 75%.
            </p>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar border border-border/50 rounded-xl p-4 bg-background/50">
              {REVENUE_DISTRIBUTION_DATA.map((d) => (
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

            <Button asChild variant="outline" size="sm" className="mt-4 w-full sm:w-auto">
              <a 
                href="https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx#:~:text=Repasses%20Sociais-,Repasses%20Sociais,-Ao%20jogar%20na" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver transparência completa
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
