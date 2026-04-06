import { motion } from 'framer-motion';
import { FileText, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CaseStudy } from './CaseStudy';
import { LotteryHistoryTimeline } from './LotteryHistoryTimeline';

export function RecordsSection({ id }: { id: string }) {
  return (
    <section id={id} className="container max-w-6xl mx-auto py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
          <History className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">
          Marcos <span className="text-gradient-gold">Históricos</span>
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          De 1996 aos dias atuais, a Mega-Sena evoluiu para se tornar um fenômeno cultural e
          estatístico nacional.
        </p>
      </motion.div>

      <div className="space-y-12">
        <LotteryHistoryTimeline />
        <CaseStudy title="Mega Sena da Virada: 2025" />
        <div className="flex justify-center pt-8">
          <Link
            to="/dados"
            className="btn-generate px-8 py-4 rounded-2xl font-bold flex items-center gap-2 group transition-all hover:scale-[1.02]"
          >
            <FileText className="w-5 h-5 transition-transform group-hover:rotate-6" />
            Ver Relatório Completo
          </Link>
        </div>
      </div>
    </section>
  );
}
