import { useNotableGame } from '@/hooks/use-home';
import { REVENUE_ALLOCATION } from '@/shared/constants';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useLotteryMeta, usePrizeEvolution } from '@/store/selectors';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, FileText, History, Landmark, Star, TrendingUp, Trophy } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { TooltipProps } from 'recharts';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { duration, formatCompactCurrency, formatCurrency, spring, tooltipStyle } from '@/shared/utils';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis
} from 'recharts';

const VISIBLE_COUNT = 5;
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

interface PrizeDataPoint {
  year: number;
  maxPrize: number;
  totalDistributed: number;
  totalRevenue: number;
  totalGames: number;
  totalWinners: number;
  megaDaVirada: boolean;
}

interface ChartClickState {
  activePayload?: Array<{ payload?: PrizeDataPoint }>;
}

interface Milestone {
  year: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const MILESTONES: Milestone[] = [
  {
    year: 1996,
    title: 'Início',
    description:
      'Primeiro sorteio da Mega-Sena (Concurso 1) realizado em 11 de março, em Brasília.',
    icon: <Calendar className="w-3.5 h-3.5" />,
    color: CHART_COLORS.BLUE,
  },
  {
    year: 2009,
    title: 'Mega da Virada',
    description:
      'Criação do Concurso especial de Final de Ano, consolidando a maior premiação recorrente do país.',
    icon: <Star className="w-3.5 h-3.5" />,
    color: CHART_COLORS.AMBER,
  },
  {
    year: 2019,
    title: 'Digitalização Total',
    description:
      'Consolidação das apostas via App e Portal Loterias Online — nova realidade de arrecadação.',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: CHART_COLORS.EMERALD,
  },
  {
    year: 2025,
    title: 'Recordes',
    description:
      'Maior prêmio da história: R$ 1,09 bilhão pagos no Concurso 2955 da Mega da Virada.',
    icon: <Trophy className="w-3.5 h-3.5" />,
    color: CHART_COLORS.AMBER,
  },
];

const MILESTONE_YEARS = new Set(MILESTONES.map((m) => m.year));

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  const isMilestone = MILESTONE_YEARS.has(Number(label));
  const data = payload[0]?.payload as PrizeDataPoint;

  return (
    <div className="glass-card border border-border p-4 text-sm space-y-3 min-w-[220px] shadow-xl">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
        <span className="text-foreground font-display font-bold text-lg">{label}</span>
        <div className="flex gap-2">
          {data.megaDaVirada && (
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Mega da Virada
            </span>
          )}
          {isMilestone && !data.megaDaVirada && (
            <span className="bg-primary/20 text-primary border border-primary/30 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Marco Histórico
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {payload.map((p) => (
          <div key={String(p.dataKey)} className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground text-xs flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </span>
            <span className="font-mono font-medium text-xs text-foreground">
              {p.name === 'Sorteios' ? p.value : formatCompactCurrency(p.value as number)}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border flex flex-col gap-1 text-[10px] text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Total de Sorteios no Ano</span>
          <span className="font-mono font-medium text-foreground">{data.totalGames}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Ganhadores do Prêmio Principal</span>
          <span className="font-mono font-medium text-foreground">{data.totalWinners}</span>
        </div>
      </div>
    </div>
  );
});

function TimelineSkeleton() {
  return (
    <div className="glass-card p-6 flex flex-col lg:flex-row gap-8 animate-pulse">
      <div className="lg:w-1/3 space-y-6">
        <div className="h-6 w-3/4 bg-muted rounded" />
        <div className="space-y-8 pl-4 border-l border-muted">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 relative">
              <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-muted" />
              <div className="h-4 w-1/4 bg-muted rounded" />
              <div className="h-3 w-full bg-muted/60 rounded" />
              <div className="h-3 w-5/6 bg-muted/60 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="lg:w-2/3 h-[400px] bg-muted/30 rounded-xl" />
    </div>
  );
}

export function LotteryHistoryTimeline() {
  const meta = useLotteryMeta();
  const prizeEvolution = usePrizeEvolution();

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [visibleSeries, setVisibleSeries] = useState({
    maxPrize: true,
    totalDistributed: true,
    totalRevenue: true,
  });

  const toggleSeries = useCallback((key: keyof typeof visibleSeries) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const data = useMemo(() => prizeEvolution?.filter((d) => d.maxPrize > 0) ?? [], [prizeEvolution]);

  const handleClick = useCallback((state: unknown) => {
    const entries = (state as ChartClickState | undefined)?.activePayload;
    const year = entries?.[0]?.payload?.year;
    if (typeof year !== 'number') return;
    setSelectedYear((prev) => (prev === year ? null : year));
  }, []);

  if (!meta || !prizeEvolution || data.length === 0) {
    return <TimelineSkeleton />;
  }

  return (
    <motion.div
      className="glass-card p-6 flex flex-col lg:flex-row gap-8 overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...spring.gentle, duration: duration.lg }}
    >
      {/* Left: Milestones Timeline */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div>
          <h3 className="font-display font-bold text-xl text-foreground">Evolução Histórica</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Explore os marcos da Mega-Sena e o crescimento das premiações ao longo dos anos.
          </p>
        </div>

        <div className="relative border-l border-border ml-3 space-y-8 py-2">
          {MILESTONES.map((m) => {
            const isActive = selectedYear === m.year;
            return (
              <button
                key={m.year}
                onClick={() => setSelectedYear(isActive ? null : m.year)}
                className={`relative pl-6 text-left transition-opacity duration-300 w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg ${isActive || !selectedYear ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                  }`}
              >
                <div
                  className={`absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-background transition-colors duration-300 shadow-sm ${isActive ? '' : 'border-border text-muted-foreground'
                    }`}
                  style={
                    isActive
                      ? { borderColor: m.color, color: m.color, boxShadow: `0 0 10px ${m.color}40` }
                      : {}
                  }
                >
                  {m.icon}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold bg-muted/50 px-1.5 py-0.5 rounded text-foreground">
                    {m.year}
                  </span>
                  <h4 className="font-semibold text-sm text-foreground">{m.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Dual Axis Composed Chart */}
      <div className="lg:w-2/3 flex flex-col min-h-[400px]">
        <div className="flex-1 w-full min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 0, bottom: 0, left: -20 }}
              onClick={handleClick}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontWeight: '600' }}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                interval="preserveStartEnd"
              />
              {/* Revenue Axis replacing Prizes Axis */}
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={formatCompactCurrency}
                tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontStretch: 'condensed' }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                width={80}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART_COLORS.CURSOR }} />

              {/* Revenue mapped to default axis */}
              {visibleSeries.totalRevenue && (
                <Bar
                  dataKey="totalRevenue"
                  name="Arrecadação"
                  fill={CHART_COLORS.EMERALD}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS.EMERALD}
                      opacity={selectedYear === entry.year ? 0.35 : 0.12}
                      className="transition-opacity duration-300"
                    />
                  ))}
                </Bar>
              )}

              {visibleSeries.totalDistributed && (
                <Line
                  type="monotone"
                  dataKey="totalDistributed"
                  name="Total distribuídos"
                  stroke={CHART_COLORS.BLUE}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: CHART_COLORS.BLUE }}
                />
              )}
              {visibleSeries.maxPrize && (
                <Line
                  type="monotone"
                  dataKey="maxPrize"
                  name="Maior Prêmio"
                  stroke={CHART_COLORS.AMBER}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: CHART_COLORS.AMBER }}
                />
              )}

              {/* Selection Highlight */}
              {selectedYear != null && (
                <ReferenceLine
                  x={selectedYear}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  strokeOpacity={0.5}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-muted-foreground select-none">
          <button
            onClick={() => toggleSeries('maxPrize')}
            className={`flex items-center gap-2 transition-opacity duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${visibleSeries.maxPrize
              ? 'opacity-100 hover:opacity-80'
              : 'opacity-40 hover:opacity-60'
              }`}
          >
            <div className="w-4 h-1 rounded-full" style={{ backgroundColor: CHART_COLORS.AMBER }} />
            <span>Maior Prêmio</span>
          </button>
          <button
            onClick={() => toggleSeries('totalDistributed')}
            className={`flex items-center gap-2 transition-opacity duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${visibleSeries.totalDistributed
              ? 'opacity-100 hover:opacity-80'
              : 'opacity-40 hover:opacity-60'
              }`}
          >
            <div
              className="w-4 h-0.5 border-t-2 border-dashed"
              style={{ borderColor: CHART_COLORS.BLUE }}
            />
            <span>Total distribuídos</span>
          </button>
          <button
            onClick={() => toggleSeries('totalRevenue')}
            className={`flex items-center gap-2 transition-opacity duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${visibleSeries.totalRevenue
              ? 'opacity-100 hover:opacity-80'
              : 'opacity-40 hover:opacity-60'
              }`}
          >
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: CHART_COLORS.EMERALD, opacity: 0.4 }}
            />
            <span>Arrecadação Total</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}


function CaseStudy({ title }: { title?: string }) {
  const notableGame = useNotableGame();
  const [isOpen, setIsOpen] = useState(false);

  if (!notableGame || !notableGame.totalRevenue) return null;

  const fmt = formatCurrency;
  const revenue = notableGame.totalRevenue || 0;
  const socialRepasses = revenue * (1 - REVENUE_ALLOCATION.PRIZE_POOL);
  const prizeBruto = revenue * REVENUE_ALLOCATION.PRIZE_POOL;
  const socialPct = ((1 - REVENUE_ALLOCATION.PRIZE_POOL) * 100).toFixed(2);
  const prizePct = (REVENUE_ALLOCATION.PRIZE_POOL * 100).toFixed(2);

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

export function RecordsSection({ id }: { id: string }) {
  return (
    <section id={id} className="container max-w-6xl mx-auto py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
          <History className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6 tracking-tight">
          Marcos <span className="text-gradient-gold">Históricos</span>
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          De 1996 aos dias atuais, a Mega-Sena evoluiu para se tornar um fenômeno cultural e
          estatístico nacional.
        </p>
      </motion.div>

      <div className="space-y-12">
        <LotteryHistoryTimeline />
        <CaseStudy title="Mega Sena da Virada: 2025" />
        <div className="flex justify-center pt-8">
          <Link
            to="/dados"
            className="btn-generate px-8 py-4 rounded-2xl font-bold flex items-center gap-2 group transition-all hover:scale-[1.02]"
          >
            <FileText className="w-5 h-5 transition-transform group-hover:rotate-6" />
            Ver Relatório Completo
          </Link>
        </div>
      </div>
    </section>
  );
}
