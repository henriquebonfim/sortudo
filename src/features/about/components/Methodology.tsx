import { DataParsingProcessChart } from '@/features/analytics/charts';
import { motion } from 'framer-motion';
import { Database, ShieldCheck, Terminal } from 'lucide-react';

export function Methodology() {
  return (
    <section className="py-24 border-t border-border bg-card/10 overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">


          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-background/50 border border-border">
              <Database className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-foreground font-bold mb-2">Sanitização</h3>
              <p className="text-sm text-muted-foreground">Normalização de dados brutos e tratamento de inconsistências históricas.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background/50 border border-border">
              <Terminal className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-foreground font-bold mb-2">Processamento</h3>
              <p className="text-sm text-muted-foreground">Cálculos complexos realizados instantaneamente no browser do usuário.</p>
            </div>
            <div className="p-6 rounded-2xl bg-background/50 border border-border">
              <ShieldCheck className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-foreground font-bold mb-2">Auditoria</h3>
              <p className="text-sm text-muted-foreground">Validação cruzada entre diferentes fontes para garantir precisão 1:1.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl"
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
