import { useLotteryMath } from "@/application/selectors";
import { BALLS_PER_DRAW, MAX_LOTTERY_NUMBER, TOTAL_COMBINATIONS } from "@/domain/lottery/lottery.constants";
import { AnimatedCounter } from "@/features/shared";
import { formatNumber } from "@/lib";
import { motion } from "framer-motion";
import { Award, Binary, Calculator, Info, Star, Trophy, Zap } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { fadeUp, stagger } from "../Common/shared-animations";
import { CoinAnalogy } from "./CoinAnalogy";
//

/**
 * Formula display with math notation.
 */
function CombinatorialFormula() {
  return (
    <motion.div variants={fadeUp} className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Binary className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display font-bold text-2xl text-foreground">Análise Combinatória</h3>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed">
        A Mega-Sena consiste em escolher <strong className="text-foreground">{BALLS_PER_DRAW} números de {MAX_LOTTERY_NUMBER}</strong>. O total de combinações é calculado pela fórmula de combinações simples:
      </p>

      <div className="glass-card p-8 border-l-4 border-l-primary font-mono shadow-2xl bg-black/40">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-lg">
            <span className="text-muted-foreground">C(n, k) =</span>
            <div className="flex flex-col items-center">
              <span className="border-b border-muted-foreground px-2">n!</span>
              <span>k! (n-k)!</span>
            </div>
          </div>
          <div className="text-primary font-bold text-xl pt-4">
            C(60, 6) = 50.063.860
          </div>
          <div className="text-4xl md:text-5xl font-display font-bold text-white mt-4 tracking-tighter">
            <AnimatedCounter target={TOTAL_COMBINATIONS} duration={2500} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">combinações únicas possíveis</p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Bar chart showing ticket counts for different game sizes.
 */
function CombinatorialChart({ combosTable }: { combosTable: { n: number, combos: number, label: string }[] }) {
  const { ticketPrice } = useLotteryMath();

  const data = useMemo(() => combosTable.map(c => {
    const cost = c.combos * ticketPrice;
    const chance = Math.floor(TOTAL_COMBINATIONS / c.combos);

    return {
      name: c.label,
      value: c.combos,
      cost,
      display: formatNumber(c.combos),
      displayCost: cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
      displayChance: `1 em ${formatNumber(chance)}`,
      multiplier: formatNumber(c.combos)
    };
  }), [combosTable, ticketPrice]);

  return (
    <motion.div variants={fadeUp} className="glass-card p-6 min-h-[440px] border-white/5 bg-white/2 shadow-xl flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">Múltiplas Apostas</p>
          <h4 className="text-lg font-display font-bold text-foreground">Escala Combinatória vs Custo</h4>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Preço/Jogo</p>
          <p className="text-sm font-mono font-bold text-foreground">{ticketPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
      </div>

      <div className="mt-2 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl space-y-3 min-w-[200px] z-50">
                      <div className="pb-2 border-b border-white/5 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.name} Números</p>
                        <div className={`w-2 h-2 rounded-full ${Number(item.name) === 6 ? 'bg-primary shadow-[0_0_8px_rgba(251,197,49,0.5)]' : 'bg-white/20'}`} />
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Equivale a</p>
                          <p className="text-lg font-mono font-bold text-primary">{item.display} <span className="text-xs font-normal opacity-50">jogos</span></p>
                        </div>

                        <div className="flex flex-col gap-0.5 pt-1 border-t border-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Probabilidade de Acerto (Sena)</p>
                          <p className="text-lg font-mono font-bold text-primary">{item.displayChance}</p>
                        </div>
                        <div className="flex flex-col gap-0.5 pt-1 border-t border-white/5">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Investimento Total</p>
                          <p className="text-lg font-mono font-bold text-emerald-400">{item.displayCost}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24} animationDuration={1500}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#fbc531' : '#2f3640'}
                  className="transition-all duration-300 hover:brightness-125 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-[10px] text-muted-foreground font-mono leading-tight">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Aposta Simples (6 nº)</span>
        </div>
        <p>Ao marcar 20 números (máximo), você paga {data[14]?.displayCost} por uma única cartela.</p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function MathSection() {
  const { combosTable } = useLotteryMath();

  return (
    <section className="container max-w-6xl mx-auto py-32 px-4 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
          <Calculator className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">A Matemática <span className="text-gradient-gold">do Improvável</span></h2>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">Para vencer, você precisa desafiar as leis da probabilidade. Entenda o que acontece nos bastidores de cada sorteio.</p>

      </motion.div>

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-16">
          <motion.div variants={fadeUp} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl text-foreground">Probabilidades de Ganhar</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">As chances de acerto variam drasticamente conforme o prêmio. A sena é um dos eventos mais raros da matemática moderna.</p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Sena (6 acertos)", chance: "1 em 50.063.860", color: "border-primary text-primary bg-primary/5", icon: <Trophy className="w-4 h-4" /> },
                { label: "Quina (5 acertos)", chance: "1 em 154.518", color: "border-blue-500/30 text-blue-400 bg-blue-500/5", icon: <Award className="w-4 h-4" /> },
                { label: "Quadra (4 acertos)", chance: "1 em 2.332", color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5", icon: <Star className="w-4 h-4" /> },
              ].map(item => (
                <div key={item.label} className={`flex items-center justify-between p-5 rounded-2xl border ${item.color} shadow-lg font-mono`}>
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                  <span className="text-base font-bold">{item.chance}</span>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-start gap-4">
                <Zap className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Independência Estatística</h4>
                  <p className="text-sm text-muted-foreground">O sorteador mecânico é reiniciado do zero absoluto a cada extração. As bolas físicas não possuem histórico, memória ou inclinação.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <CoinAnalogy />
        </div>

        <div className="space-y-16 lg:sticky lg:top-8">
          <CombinatorialFormula />
          <CombinatorialChart combosTable={combosTable} />
        </div>
      </motion.div>
    </section>
  );
}
