import { motion } from "framer-motion";
import { FileSpreadsheet, Database, PieChart, Lightbulb, ArrowRight } from "lucide-react";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  isLast?: boolean;
}

function Step({ icon, title, description, delay, isLast }: StepProps) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-[140px] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5, type: "spring" }}
        className="relative group"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
        {!isLast && (
          <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 text-muted-foreground/30">
            <ArrowRight className="w-5 h-5" />
          </div>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2 }}
        className="mt-4"
      >
        <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground leading-snug max-w-[160px]">
          {description}
        </p>
      </motion.div>
    </div>
  );
}

export default function DataParsingProcessChart() {
  const steps = [
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      title: "Fonte de Dados",
      description: "Excel oficial da Caixa contendo todos os sorteios desde 1996.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Processamento",
      description: "Limpeza de dados, normalização de UFs e tratamento de datas.",
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: "Estatísticas",
      description: "Cálculo de frequências, somas, atrasos e distribuições.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Insights",
      description: "Transformação de números brutos em visualizações acionáveis.",
    },
  ];

  return (
    <div className="glass-card p-8 overflow-hidden">
      <div className="flex flex-wrap lg:flex-nowrap gap-8 lg:gap-4 justify-between items-start">
        {steps.map((step, i) => (
          <Step
            key={step.title}
            {...step}
            delay={i * 0.15}
            isLast={i === steps.length - 1}
          />
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground italic"
      >
        <p>• Dados processados localmente em seu navegador</p>
        <p>• Zero telemetria — sua privacidade é matemática</p>
      </motion.div>
    </div>
  );
}
