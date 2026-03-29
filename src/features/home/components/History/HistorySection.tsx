import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { LotteryHistoryTimeline } from '@/features/analytics-dashboard/charts';

export function HistorySection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-primary/5 mix-blend-overlay pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
              <History className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 tracking-tight">
              Marcos <span className="text-gradient-gold">Históricos</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              De 1996 aos dias atuais, a Mega-Sena evoluiu para se tornar um fenômeno cultural e financeiro, 
              moldando sonhos e estatísticas nacionais.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            <LotteryHistoryTimeline />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
