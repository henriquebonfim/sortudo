import { motion } from "framer-motion";
import { BarChart3, Calculator, TrendingDown, Zap } from "lucide-react";
import { FeatureCard } from "@/features/home/components";
import { stagger } from "@/features/home/components/shared-animations";

const features = [
  {
    icon: <Calculator className="h-6 w-6" />,
    title: "O Custo da Emoção",
    desc: "Simule décadas de apostas ou analise sua perda histórica real em uma experiência unificada.",
    link: "/simulador",
    cta: "Calcular & Simular",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Frequências & Bolhas",
    desc: "Visualize a frequência de cada número nos sorteios históricos.",
    link: "/dados",
    cta: "Ver gráfico",
  },
  {
    icon: <TrendingDown className="h-6 w-6" />,
    title: "Para onde vai o dinheiro?",
    desc: "Transparência total: 43% em prêmios, 57% para o governo.",
    link: "/dados/transparencia",
    cta: "Ver fluxo",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Gerador de números",
    desc: "Gere jogos aleatórios e veja suas odds em tempo real.",
    link: "/gerador",
    cta: "Gerar jogo",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="container">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
