import { motion } from "framer-motion";
import { Zap, Bell, Calculator, Globe, LayoutDashboard, Target } from "lucide-react";

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  color: string;
}

const FEATURES: FeatureCard[] = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Previsão por Frequência Adaptativa",
    description: "Calcule a \"tendência\" de saída de cada número usando médias móveis ponderadas por período — com visualização de aquecimento e resfriamento temporal.",
    tag: "Análise avançada",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Comparação entre Loterias",
    description: "Compare probabilidades, EV e ROI histórico da Mega-Sena com Quina, Timemania, Lotofácil e loterias internacionais como Powerball.",
    tag: "Comparativo",
    color: "from-green-500/20 to-emerald-500/10 border-green-500/30",
  },
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    title: "Dashboard Personalizado",
    description: "Usuário salva seus números favoritos e acompanha ao longo do tempo: quantas vezes quase ganhou (5, 4 acertos), quanto teria ganhado vs. gasto.",
    tag: "Personalização",
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/30",
  }
];

export function SuggestedFeaturesPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {FEATURES.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4 }}
          className={`rounded-2xl border bg-gradient-to-br p-5 flex flex-col gap-3 ${f.color}`}
        >
          <div className="flex items-start justify-between">
            <div className="p-2 rounded-lg bg-white/5 text-foreground">
              {f.icon}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              {f.tag}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
