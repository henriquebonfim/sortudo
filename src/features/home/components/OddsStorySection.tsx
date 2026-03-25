import { Button } from '@/components/ui/button';
import { OddsVisualizerChart } from '@/features/home/components/OddsVisualizerChart';
import { motion } from 'framer-motion';
import { ArrowRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OddsStorySection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-rose-500/5 mix-blend-overlay pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 tracking-tight">
              A Ilusão da <span className="text-gradient-rose">Proporção</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              O cérebro humano evoluiu para entender grupos de 10, 100, talvez 1.000.
              Nós não conseguimos processar intuitivamente o que significa "1 em 50 milhões".
              Isso nos leva ao <strong>Viés do Otimismo</strong>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />

            <OddsVisualizerChart />

            <div className="mt-10 flex flex-col items-center">
              <p className="text-center text-muted-foreground mb-6 max-w-2xl text-sm md:text-base">
                Quando você compra um bilhete, sua chance matemática sai de zero absoluto, mas na prática, a probabilidade continua sendo <strong>irrisória</strong> perante as leis do universo.
              </p>
              <Link to="/dados">
                <Button variant="default" size="lg" className="gap-2 border border-primary hover:border-primary/50 hover:text-secondary  bg-base font-bold hover:bg-primary/90 text-primary rounded-full px-8 h-12">
                  Explorar os Dados Completos <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
