import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { RevenueService } from "@/domain/lottery/revenue.service";
import { TICKET_PRICE } from "@/domain/lottery/lottery.constants";
import { stagger, fadeUp, tooltipStyle } from "@/features/home/components/shared-animations";
import { formatCurrency } from "@/lib/formatters";

const fullListData = [
  { name: "Prêmio Bruto", value: 43.35, color: "hsl(142, 71%, 45%)" },
  { name: "Seguridade Social", value: 17.32, color: "hsl(217, 91%, 60%)" },
  { name: "Custeio de despesas operacionais", value: 9.57, color: "hsl(215, 16%, 47%)" },
  { name: "Comissão dos lotéricos", value: 8.61, color: "hsl(215, 20%, 55%)" },
  { name: "Fundo Nacional de Segurança Pública - FNSP", value: 6.80, color: "hsl(0, 84%, 60%)" },
  { name: "Fundo Penitenciário Nacional - FUNPEN", value: 3.00, color: "hsl(280, 65%, 60%)" },
  { name: "Fundo Nacional da Cultura - FNC", value: 2.91, color: "hsl(190, 90%, 50%)" },
  { name: "Ministério do Esporte", value: 2.49, color: "hsl(150, 60%, 50%)" },
  { name: "Comitê Olímpico do Brasil - COB", value: 1.73, color: "hsl(38, 92%, 50%)" },
  { name: "Sec. de esporte dos Estados e DF", value: 1.00, color: "hsl(38, 80%, 60%)" },
  { name: "Comitê Paralímpico Brasileiro - CPB", value: 0.96, color: "hsl(38, 70%, 55%)" },
  { name: "Fundo de Desenvolvimento de Loterias - FDL", value: 0.95, color: "hsl(215, 25%, 65%)" },
  { name: "Comitê Brasileiro de Clubes - CBC", value: 0.46, color: "hsl(38, 60%, 45%)" },
  { name: "Confederação Brasileira do Desporto Escolar - CBDE", value: 0.22, color: "hsl(38, 50%, 40%)" },
  { name: "Confederação Brasileira do Desporto Universitário - CBDU", value: 0.11, color: "hsl(38, 40%, 35%)" },
  { name: "Comitê Brasileiro de Clubes Paralímpicos - CBCP", value: 0.07, color: "hsl(38, 30%, 30%)" },
  { name: "Fenaclubes", value: 0.01, color: "hsl(215, 10%, 40%)" },
];

export function MoneyFlowTeaser() {
  const expected = RevenueService.calculateExpectedReturn(TICKET_PRICE);
  const fmt = formatCurrency;

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
                    data={fullListData}
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="80%"
                    paddingAngle={1}
                    dataKey="value"
                    stroke="none"
                  >
                    {fullListData.map((entry, i) => (
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
              {fullListData.map((d) => (
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
