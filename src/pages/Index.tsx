import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, Calculator, Dices, Brain, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {count.toLocaleString("pt-BR")}
    </span>
  );
}

const features = [
  {
    icon: <Calculator className="h-6 w-6" />,
    title: "Quanto eu já perdi?",
    desc: "Calcule o custo real das suas apostas e veja o que poderia ter feito com esse dinheiro.",
    link: "/calculadora",
    cta: "Calcular agora",
  },
  {
    icon: <Dices className="h-6 w-6" />,
    title: "Jogue a vida toda",
    desc: "Simule 40 anos de apostas e veja seu saldo despencar em tempo real.",
    link: "/simulador",
    cta: "Desperdiçar 40 anos agora",
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Teste seus vieses",
    desc: "Você acha que o 10 está 'quente'? Vamos testar sua intuição contra a matemática.",
    link: "/quiz",
    cta: "Testar agora",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

export default function HeroPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-grid">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="container relative z-10 text-center py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          >
            <p className="text-sm font-mono text-primary tracking-widest uppercase mb-6">
              Simulador educativo da Mega-Sena
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold tracking-tight text-balance mb-6 text-foreground">
              A sorte é um{" "}
              <span className="text-gradient-gold">erro de cálculo</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              A matemática não é cruel — só honesta. Descubra quanto a Mega-Sena
              já custou a você e por que o sistema nunca perde.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            {/* Global loss counter */}
            <div className="glass-card inline-flex flex-col items-center p-6 md:p-8 gold-glow">
              <span className="stat-label mb-3">Brasileiros já gastaram na Mega-Sena (estimativa)</span>
              <span className="text-4xl md:text-6xl font-mono font-bold text-primary tabular-nums">
                R$ <AnimatedCounter target={220} duration={2500} />,
                <AnimatedCounter target={7} duration={2800} /> bi
              </span>
              <span className="text-xs text-muted-foreground mt-2 font-mono">
                ~R$ 22B/ano × {new Date().getFullYear() - 1996} anos de operação
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-bold text-base px-8">
              <Link to="/calculadora">
                <TrendingDown className="mr-2 h-5 w-5" />
                Quanto eu já perdi?
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-secondary font-display text-base px-8">
              <Link to="/simulador">Desperdiçar 40 anos agora</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16"
          >
            <ArrowDown className="h-5 w-5 text-muted-foreground mx-auto animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Link to={f.link} className="group block h-full">
                  <div className="glass-card-hover p-6 md:p-8 h-full flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
                      {f.icon}
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2 text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground flex-1 mb-4">{f.desc}</p>
                    <span className="text-sm font-medium text-primary group-hover:underline">
                      {f.cta} →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 border-t border-border">
        <div className="container text-center">
          <blockquote className="text-2xl md:text-3xl font-display font-bold text-foreground max-w-3xl mx-auto text-balance">
            "A Caixa Econômica Federal nunca perdeu dinheiro com loterias.
            O sistema é matematicamente perfeito — <span className="text-gradient-gold">para eles</span>."
          </blockquote>
          <p className="mt-6 text-sm text-muted-foreground">
            43% dos R$5 voltam como prêmio. 57% vão para o governo. Você nunca está jogando contra o azar — está jogando contra a matemática.
          </p>
        </div>
      </section>
    </div>
  );
}
