import { useLotteryMeta } from "@/application/selectors";
import { motion } from "framer-motion";
import { CheckCircle2, Database, FileSpreadsheet, Lightbulb, PieChart } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  {
    icon: <FileSpreadsheet className="w-5 h-5" />,
    title: "Fonte de Dados",
    description: "Leitura do Excel oficial contendo todos os sorteios desde o sorteio #1.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "Normalização",
    description: "Tratamento de duplicatas, formatos de data e limpeza de nomes de cidades.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: <PieChart className="w-5 h-5" />,
    title: "Estatísticas",
    description: "Cálculo de frequências, desvios, médias e tendências temporais.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: "Insights",
    description: "Geração de padrões e correlações visuais para suporte à decisão.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

export function DataParsingProcessChart() {
  const [activeStep, setActiveStep] = useState(0);
  const meta = useLotteryMeta();
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (STEPS.length + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 overflow-hidden">
      <div className="relative space-y-8">
        {/* Progress Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:h-0.5 sm:top-6 sm:bottom-auto hidden sm:block" />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
          {STEPS.map((step, i) => {
            const isCompleted = activeStep > i;
            const isActive = activeStep === i;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-row sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-4 group"
              >
                <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-500 ${isCompleted ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" :
                  isActive ? `${step.bg} border-primary glow-sm text-primary` :
                    "bg-muted/50 border-border text-muted-foreground"
                  }`}>
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : step.icon}

                  {isActive && (
                    <motion.div
                      layoutId="active-ring"
                      className="absolute -inset-1 rounded-[14px] border border-primary/40"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className={`text-sm font-bold transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 min-h-[32px]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
              Processamento Local Ativo
            </span>
          </div>

          <p className="text-[10px] text-muted-foreground italic max-w-[200px] text-center sm:text-right">
            Seu navegador está processando {meta.totalDraws.toLocaleString('pt-BR')} registros em tempo real.
          </p>
        </div>
      </div>
    </div>
  );
}
