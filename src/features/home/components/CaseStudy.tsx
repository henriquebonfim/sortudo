import { useNotableGame } from '../hooks/use-home';
import { formatCurrency } from '@/lib/lottery/utils';
import { REVENUE_ALLOCATION } from '@/lib/lottery/constants';
import { tooltipStyle } from '@/shared/utils/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, Landmark, TrendingUp, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const VISIBLE_COUNT = 5;

export function CaseStudy({ title }: { title?: string }) {
  const notableGame = useNotableGame();
  const [isOpen, setIsOpen] = useState(false);

  if (!notableGame || !notableGame.totalRevenue) return null;

  const fmt = formatCurrency;
  const revenue = notableGame.totalRevenue || 0;
  const socialRepasses = revenue * (1 - REVENUE_ALLOCATION.PRIZE_POOL);
  const prizeBruto = revenue * REVENUE_ALLOCATION.PRIZE_POOL;
  const socialPct = ((1 - REVENUE_ALLOCATION.PRIZE_POOL) * 100).toFixed(2);
  const prizePct = (REVENUE_ALLOCATION.PRIZE_POOL * 100).toFixed(2);

  const breakdownData = [
    {
      name: 'Prêmio Bruto',
      value: REVENUE_ALLOCATION.PRIZE_POOL * 100,
      color: 'hsl(142, 71%, 45%)',
    },
    {
      name: 'Seguridade Social',
      value: REVENUE_ALLOCATION.SOCIAL_SECURITY * 100,
      color: 'hsl(217, 91%, 60%)',
    },
    {
      name: 'Custeio Operacional',
      value: REVENUE_ALLOCATION.OPERATIONAL_CUSTEIO * 100,
      color: 'hsl(215, 16%, 47%)',
    },
    {
      name: 'Comissão dos Lotéricos',
      value: REVENUE_ALLOCATION.OPERATIONAL_COMMISSION * 100,
      color: 'hsl(215, 20%, 55%)',
    },
    {
      name: 'Seguridade Pública (FNSP)',
      value: REVENUE_ALLOCATION.PUBLIC_SECURITY * 100,
      color: 'hsl(0, 84%, 60%)',
    },
    {
      name: 'Fundo Penitenciário (FUNPEN)',
      value: REVENUE_ALLOCATION.PENITENTIARY * 100,
      color: 'hsl(280, 65%, 60%)',
    },
    {
      name: 'Fundo de Cultura (FNC)',
      value: REVENUE_ALLOCATION.CULTURE * 100,
      color: 'hsl(190, 90%, 50%)',
    },
    {
      name: 'Ministério do Esporte',
      value: REVENUE_ALLOCATION.SPORT * 100,
      color: 'hsl(150, 60%, 50%)',
    },
    {
      name: 'Comitê Olímpico (COB)',
      value: REVENUE_ALLOCATION.COB * 100,
      color: 'hsl(38, 92%, 50%)',
    },
    {
      name: 'Secretarias de Esporte',
      value: REVENUE_ALLOCATION.STATE_SPORTS * 100,
      color: 'hsl(38, 80%, 60%)',
    },
    {
      name: 'Comitê Paralímpico (CPB)',
      value: REVENUE_ALLOCATION.CPB * 100,
      color: 'hsl(38, 70%, 55%)',
    },
    { name: 'FDL', value: REVENUE_ALLOCATION.OPERATIONAL_FDL * 100, color: 'hsl(215, 25%, 65%)' },
    {
      name: 'Comitê Brasileiro de Clubes',
      value: REVENUE_ALLOCATION.CBC * 100,
      color: 'hsl(38, 60%, 45%)',
    },
    {
      name: 'Desporto Escolar (CBDE)',
      value: REVENUE_ALLOCATION.CBDE * 100,
      color: 'hsl(38, 50%, 40%)',
    },
    {
      name: 'Desporto Universitário (CBDU)',
      value: REVENUE_ALLOCATION.CBDU * 100,
      color: 'hsl(38, 40%, 35%)',
    },
    {
      name: 'Clubes Paralímpicos',
      value: REVENUE_ALLOCATION.CBCP * 100,
      color: 'hsl(38, 30%, 30%)',
    },
    { name: 'Fenaclubes', value: REVENUE_ALLOCATION.FENACLUBES * 100, color: 'hsl(215, 10%, 40%)' },
  ];

  const visibleItems = isOpen ? breakdownData : breakdownData.slice(0, VISIBLE_COUNT);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-16 rounded-3xl  bg-card/60 backdrop-blur-xl overflow-hidden"
      style={{
        boxShadow: '0 0 0 1px hsl(var(--primary)/0.08), 0 32px 64px -12px hsl(var(--primary)/0.12)',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="px-6 md:px-10 pt-8 pb-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-primary uppercase tracking-[0.2em] bg-primary/10 border border-primary/20 rounded-full px-3 py-1 w-fit">
            Estudo de Caso · Concurso #{notableGame.id}
          </span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mt-2">
            {title ?? fmt(revenue)}
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2.5 rounded-2xl self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-primary/70" />
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-mono leading-none mb-0.5">
              Data do Sorteio
            </span>
            <span className="text-base font-bold font-mono text-primary leading-none">
              {new Date(notableGame.date).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI Row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* Total */}
        <div className="px-5 md:px-8 py-5 flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-medium mb-1 whitespace-nowrap">
              Arrecadação Total
            </p>
            <p className="text-sm font-bold font-mono text-foreground leading-tight break-all">
              {fmt(revenue)}
            </p>
          </div>
        </div>

        {/* Repasses Sociais */}
        <div className="px-5 md:px-8 py-5 flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 shrink-0 mt-0.5">
            <Landmark className="w-4 h-4 text-red-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Repasses Sociais <span className="text-red-500 font-semibold">({socialPct}%)</span>
            </p>
            <p className="text-sm font-bold font-mono text-red-500 leading-tight break-all">
              {fmt(socialRepasses)}
            </p>
          </div>
        </div>

        {/* Prêmio Bruto */}
        <div className="px-5 md:px-8 py-5 flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 shrink-0 mt-0.5">
            <Trophy className="w-4 h-4 text-green-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Prêmio Bruto <span className="text-green-500 font-semibold">({prizePct}%)</span>
            </p>
            <p className="text-sm font-bold font-mono text-green-500 leading-tight break-all">
              {fmt(prizeBruto)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Chart + Breakdown ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        {/* Donut Chart */}
        <div className=" lg:col-span-2 px-6 md:px-10 py-8 flex flex-col items-center justify-center">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6 text-center">
            Distribuição da Arrecadação
          </p>
          <div className="relative w-[220px] h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={1}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {breakdownData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number, name: string) => [
                    <div key="tt" className="flex flex-col items-end gap-0.5 ">
                      <span className="font-bold">
                        {v.toFixed(2)}% - {name}:{' '}
                      </span>
                      <span className="font-bold">{fmt(revenue * (v / 100))}</span>
                    </div>,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute -z-10 inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none mb-1">
                Prêmio
              </span>
              <span className="text-2xl font-bold font-mono text-green-500 leading-tight">
                {prizePct}%
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Bars */}
        <div className="lg:col-span-3 px-6 md:px-10 py-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
            Destino detalhado
          </p>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {visibleItems.map((d, idx) => (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  className="group"
                >
                  <div className="flex justify-between items-end mb-1.5 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: d.color }}
                      />
                      <span
                        className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-150 truncate"
                        title={d.name}
                      >
                        {d.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {d.value.toFixed(2)}%
                      </span>
                      <span className="text-xs font-mono font-bold text-foreground">
                        {fmt(revenue * (d.value / 100))}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: d.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(d.value / breakdownData[0].value) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.1 + idx * 0.03, ease: 'circOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Toggle button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            layout
            className="mt-6 flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors duration-150 cursor-pointer bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full border border-primary/20 hover:border-primary/30 mx-auto"
          >
            {isOpen ? (
              <>
                Mostrar menos <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Mostrar todos os {breakdownData.length} destinos{' '}
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
