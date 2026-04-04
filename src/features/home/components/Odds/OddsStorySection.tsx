import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { OddsVisualizerChart } from './OddsVisualizerChart';

export function OddsStorySection() {
  return (
    <section className="container max-w-6xl mx-auto ">
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
          A <span className="text-gradient-gold">Ilusão</span> da Escala
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          O cérebro não foi feito para entender o que é <span className="text-foreground font-bold underline decoration-rose-500/30">1 em 50.063.860</span>.
          Nosso cérebro confunde <span className="text-foreground text-rose-500 font-bold underline decoration-rose-500/30">altamente improvável</span> com <span className="text-foreground text-yellow-500 font-bold underline decoration-rose-500/30">apenas difícil</span>.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="bg-card/50 backdrop-blur-sm border border-border rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 blur-3xl rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full -ml-48 -mb-48 pointer-events-none" />

        <OddsVisualizerChart />

        <div className="mt-12 flex flex-col items-center border-t border-border pt-10">
          <p className="text-center text-muted-foreground mb-8 max-w-2xl text-base md:text-lg leading-relaxed">
            Cada bilhete jogado é <span className="text-rose-400 font-mono">matematicamente irrelevante</span> perante a imensa <span className="text-foreground font-bold">certeza estatística</span> construída contra o apostador.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
