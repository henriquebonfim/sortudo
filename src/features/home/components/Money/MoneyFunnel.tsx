import { motion } from "framer-motion";
import { REVENUE_ALLOCATION } from "@/domain/lottery/lottery.constants";
import { formatCompactCurrency } from "@/lib/formatters";
import { ArrowDown, DollarSign, Users, Shield, Lock, Landmark, Trophy, Music, Dumbbell } from "lucide-react";
import { AnimatedCounter } from "@/features/home/components/Hero/AnimatedCounter";

interface FunnelStep {
  label: string;
  percentage: number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const FUNNEL_STEPS: FunnelStep[] = [
  { 
    label: "Arrecadação Bruta", 
    percentage: 100, 
    description: "Todo o dinheiro pago pelos apostadores.",
    icon: <DollarSign className="w-5 h-5" />,
    color: "bg-primary"
  },
  { 
    label: "Prêmio Bruto", 
    percentage: 43.79, 
    description: "Valor destinado ao pagamento de prêmios (antes do IR).",
    icon: <Trophy className="w-5 h-5" />,
    color: "bg-emerald-500"
  },
  { 
    label: "Repasses Sociais", 
    percentage: 37.08, 
    description: "Seguridade, Segurança, Cultura e Esporte.",
    icon: <Users className="w-5 h-5" />,
    color: "bg-blue-500"
  },
  { 
    label: "Custo Operacional", 
    percentage: 19.13, 
    description: "Despesas de custeio e manutenção da loteria.",
    icon: <Landmark className="w-5 h-5" />,
    color: "bg-amber-500"
  }
];

/**
 * Funnel visualization showing the slicing of lottery revenue.
 */
export function MoneyFunnel() {
  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col items-center">
        {FUNNEL_STEPS.map((step, index) => (
          <div key={step.label} className="w-full flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              style={{ width: `${step.percentage}%` }}
              className={`relative h-20 min-w-[280px] ${step.color} rounded-2xl flex items-center justify-between px-6 shadow-lg mb-2 group cursor-help`}
            >
              <div className="flex items-center gap-3 text-white overflow-hidden">
                <div className="shrink-0 p-2 bg-white/20 rounded-lg">
                  {step.icon}
                </div>
                <div className="truncate">
                  <span className="block text-xs font-bold uppercase tracking-wider opacity-80">{step.label}</span>
                  <span className="text-xl font-mono font-black">
                    <AnimatedCounter target={step.percentage} duration={1000 + index * 500} decimals={step.percentage % 1 !== 0 ? 2 : 0} />%
                  </span>
                </div>
              </div>
              
              <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity absolute left-full ml-4 w-48 bg-card border border-border p-3 rounded-xl shadow-2xl z-20 pointer-events-none">
                <p className="text-xs text-muted-foreground leading-tight">{step.description}</p>
              </div>
            </motion.div>
            
            {index < FUNNEL_STEPS.length - 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 24 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.3 }}
                className="w-px bg-border relative my-1"
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <ArrowDown className="w-4 h-4 text-muted-foreground/50" />
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-mono opacity-50">
        Valores aproximados conforme Lei nº 13.756/2018
      </p>
    </div>
  );
}
