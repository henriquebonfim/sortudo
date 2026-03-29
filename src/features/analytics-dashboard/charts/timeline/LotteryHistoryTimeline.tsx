import { motion } from "framer-motion";
import { Calendar, Star, Trophy, TrendingUp } from "lucide-react";

const HISTORY_EVENTS = [
  {
    year: "1996",
    title: "O Início",
    description: "Primeiro sorteio da Mega-Sena (Concurso 1) realizado em 11 de março, em Brasília.",
    icon: <Calendar className="w-4 h-4" />,
    color: "#3B82F6",
  },
  {
    year: "2008",
    title: "Mega da Virada",
    description: "Criação do Concurso 1140 (Especial de Final de Ano), consolidando a maior premiação recorrente do país.",
    icon: <Star className="w-4 h-4" />,
    color: "#F59E0B",
  },
  {
    year: "2019",
    title: "Digitalização Total",
    description: "Consolidação das apostas via App e Portal Loterias Online (Concurso 2150).",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "#10B981",
  },
  {
    year: "2025",
    title: "Recorde Absoluto",
    description: "Maior prêmio da história: R$ 1,09 bilhão pagos no Concurso 2955 da Mega da Virada.",
    icon: <Trophy className="w-4 h-4" />,
    color: "#D4AF37",
  },
];

export default function LotteryHistoryTimeline() {
  return (
    <div className="glass-card p-6 overflow-hidden">
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-border hidden sm:block" />
        
        <div className="space-y-8">
          {HISTORY_EVENTS.map((event, i) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative flex items-start gap-4 sm:pl-10"
            >
              {/* Dot for mobile, icon for desktop */}
              <div className="hidden sm:flex absolute left-0 w-8 h-8 rounded-full border bg-background items-center justify-center z-10" style={{ borderColor: event.color }}>
                <span style={{ color: event.color }}>{event.icon}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {event.year}
                  </span>
                  <h4 className="font-semibold text-sm text-foreground">{event.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-muted-foreground italic">
        * Marcos históricos que moldaram a maior loteria do Brasil
      </div>
    </div>
  );
}
