import { motion } from 'framer-motion';
import { PieChart, Database, Terminal, ShieldCheck } from 'lucide-react';
import { DataParsingProcessChart } from '@/features/analytics-dashboard/charts';

export function MethodologySection() {
  return (
    <section className="py-24 border-t border-border bg-card/10 overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-6">
              <PieChart className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 tracking-tight">
              Metodologia de <span className="text-emerald-400">Dados</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              O processamento 100% client-side garante privacidade total. Cada cálculo é auditado 
              e validado contra os totais oficiais da Caixa para assegurar integridade estatística.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-background/50 border border-border/50">
               <Database className="w-6 h-6 text-primary mb-4" />
               <h3 className="text-foreground font-bold mb-2">Sanitização</h3>
               <p className="text-sm text-muted-foreground">Normalização de dados brutos e tratamento de inconsistências históricas.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background/50 border border-border/50">
               <Terminal className="w-6 h-6 text-primary mb-4" />
               <h3 className="text-foreground font-bold mb-2">Processamento</h3>
               <p className="text-sm text-muted-foreground">Cálculos complexos realizados instantaneamente no browser do usuário.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background/50 border border-border/50">
               <ShieldCheck className="w-6 h-6 text-primary mb-4" />
               <h3 className="text-foreground font-bold mb-2">Auditoria</h3>
               <p className="text-sm text-muted-foreground">Validação cruzada entre diferentes fontes para garantir precisão 1:1.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            <h4 className="text-sm font-mono text-muted-foreground mb-8 text-center uppercase tracking-widest">
              Fluxo de Processamento de Dados
            </h4>
            <DataParsingProcessChart />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
