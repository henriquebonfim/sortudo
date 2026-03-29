import { motion } from "framer-motion";
import { useNotableDraw } from "@/application/selectors/useNotableDraw";
import { formatCurrency, formatCompactCurrency, formatNumber } from "@/lib/formatters";
import { REVENUE_ALLOCATION, TOTAL_COMBINATIONS, TICKET_PRICE } from "@/domain/lottery/lottery.constants";

export function CaseStudy() {
  const notableDraw = useNotableDraw();

  if (!notableDraw || !notableDraw.totalRevenue) return null;

  const fmt = formatCurrency;
  const compact = formatCompactCurrency;
  
  const revenue = notableDraw.totalRevenue || 0;
  const coverage = (revenue / TICKET_PRICE) / TOTAL_COMBINATIONS;

  const breakdown = [
    { label: "Prêmio Bruto (43,79%)", value: revenue * REVENUE_ALLOCATION.PRIZE_POOL },
    { label: "Seguridade Social (17,32%)", value: revenue * REVENUE_ALLOCATION.SOCIAL_SECURITY },
    { label: "Custo Operacional (19,13%)", value: revenue * REVENUE_ALLOCATION.OPERATIONAL },
    { label: "Segurança Pública (6,80%)", value: revenue * REVENUE_ALLOCATION.PUBLIC_SECURITY },
    { label: "Fundo Penitenciário (3,00%)", value: revenue * REVENUE_ALLOCATION.PENITENTIARY },
    { label: "Fundo de Cultura (2,91%)", value: revenue * REVENUE_ALLOCATION.CULTURE },
    { label: "Ministério do Esporte (2,49%)", value: revenue * REVENUE_ALLOCATION.SPORT },
    { label: "Comitês & Outros (4,56%)", value: revenue * REVENUE_ALLOCATION.OTHER },
  ];

  return (
    <section className="py-20 border-t border-border overflow-hidden">
      <div className="container relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 border-primary/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <span className="text-xs font-mono text-primary uppercase tracking-widest mb-2 block">Estudo de Caso Real</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">Concurso {notableDraw.id} ({new Date(notableDraw.date).toLocaleDateString('pt-BR')})</h2>
            </div>
            <div className="bg-primary/10 border border-primary/30 px-6 py-3 rounded-2xl">
              <span className="block text-xs text-muted-foreground font-mono">Arrecadação Total</span>
              <span className="text-xl md:text-2xl font-bold font-mono text-primary">{compact(revenue)}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">Onde foi o dinheiro?</h4>
              <div className="space-y-2 text-xs font-mono">
                {breakdown.map((item) => (
                  <div key={item.label} className="flex justify-between py-1 border-b border-border">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground">{compact(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground">A Saturação do Sistema</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Com base no volume de apostas e nas {formatNumber(TOTAL_COMBINATIONS)} combinações possíveis:
              </p>
              <div className="glass-card p-4 bg-primary/5 text-center">
                <span className="block text-xs uppercase text-muted-foreground mb-1">Taxa de Cobertura</span>
                <span className="text-3xl font-bold text-primary font-mono">{coverage.toFixed(1)}×</span>
                <p className="text-[10px] text-muted-foreground mt-2">Cada combinação foi jogada em média {coverage.toFixed(1)} vezes.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground">O Veredito Matemático</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">●</span>
                  O prêmio da Sena foi de <strong>{fmt(notableDraw.jackpotPrize)}</strong>.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">●</span>
                  {notableDraw.jackpotWinners > 0 
                    ? `Dividido entre ${notableDraw.jackpotWinners} ganhador(es).` 
                    : "O prêmio acumulou para o próximo concurso."}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">●</span>
                  A arrecadação foi {notableDraw.jackpotPrize > 0 ? Math.round(revenue / notableDraw.jackpotPrize) : 'infinitamente'}× maior que o prêmio principal pago.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
