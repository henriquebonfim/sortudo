import { Button } from '@/components/ui/button';
import { OddsVisualizerChart } from '@/components/shared/odds-visualizer/OddsVisualizerChart';
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
            <div className="inline-flex items-center justify-center p-4 bg-rose-500/10 rounded-3xl mb-6 ring-1 ring-rose-500/20">
              <Target className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight leading-tight">
              A <span className="text-gradient-rose">Ilusão</span> da Escala
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Seu cérebro não foi feito para entender o que é <span className="text-foreground font-bold underline decoration-rose-500/30">1 em 50.063.860</span>. 
              Nosso cérebro confunde "altamente improvável" com "apenas difícil".
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-3xl rounded-full -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full -ml-48 -mb-48 pointer-events-none" />

            <OddsVisualizerChart />

            <div className="mt-12 flex flex-col items-center border-t border-border/50 pt-10">
              <p className="text-center text-muted-foreground mb-8 max-w-2xl text-base md:text-lg leading-relaxed">
                Cada bilhete jogado é <span className="text-rose-400 font-mono">matematicamente irrelevante</span> perante a imensa <span className="text-foreground font-bold">certeza estatística</span> construída contra o apostador.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
