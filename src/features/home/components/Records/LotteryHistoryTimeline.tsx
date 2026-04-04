
import { useLotteryMeta, usePrizeEvolution } from "@/application/selectors";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { duration, spring } from "@/components/ui";
import { formatCompactCurrency } from "@/lib";
import { motion } from "framer-motion";
import { Calendar, Star, TrendingUp, Trophy } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import type { TooltipContentProps } from "recharts";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PrizeDataPoint {
  year: number;
  maxPrize: number;
  totalDistributed: number;
  totalRevenue: number;
  totalDraws: number;
  totalWinners: number;
  megaDaVirada: boolean;
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
    title: "Início",
    description:
      "Primeiro sorteio da Mega-Sena (Concurso 1) realizado em 11 de março, em Brasília.",
    icon: <Calendar className="w-3.5 h-3.5" />,
    color: CHART_COLORS.BLUE,
  },
  {
    year: 2009,
    title: "Mega da Virada",
    description:
      "Criação do Concurso especial de Final de Ano, consolidando a maior premiação recorrente do país.",
    icon: <Star className="w-3.5 h-3.5" />,
    color: CHART_COLORS.AMBER,
  },
  {
    year: 2019,
    title: "Digitalização Total",
    description:
      "Consolidação das apostas via App e Portal Loterias Online — nova realidade de arrecadação.",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: CHART_COLORS.EMERALD,
  },
  {
    year: 2025,
    title: "Recordes",
    description:
      "Maior prêmio da história: R$ 1,09 bilhão pagos no Concurso 2955 da Mega da Virada.",
    icon: <Trophy className="w-3.5 h-3.5" />,
    color: CHART_COLORS.AMBER,
  },
];

const MILESTONE_YEARS = new Set(MILESTONES.map((m) => m.year));

// ─── Sub-components ─────────────────────────────────────────────────────────

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;

  const isMilestone = MILESTONE_YEARS.has(Number(label));
  const data = payload[0]?.payload as PrizeDataPoint;

  return (
    <div className="glass-card border border-border p-4 text-sm space-y-3 min-w-[220px] shadow-xl">
      <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-2">
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
              {p.name === "Sorteios" ? p.value : formatCompactCurrency(p.value as number)}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border/50 flex flex-col gap-1 text-[10px] text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>Total de Sorteios no Ano</span>
          <span className="font-mono font-medium text-foreground">{data.totalDraws}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Ganhadores do Prêmio Principal</span>
          <span className="font-mono font-medium text-foreground">{data.totalWinners}</span>
        </div>
      </div>
    </div>
  );
});

// ─── Skeleton Fallback ───────────────────────────────────────────────────────

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

// ─── Main Component ──────────────────────────────────────────────────────────

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

  const data = useMemo(
    () => prizeEvolution?.filter((d) => d.maxPrize > 0) ?? [],
    [prizeEvolution]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleClick = useCallback((state: any) => {
    const entries: { payload: PrizeDataPoint }[] | undefined = state?.activePayload;
    if (!entries?.length) return;
    const year = entries[0].payload.year;
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
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...spring.gentle, duration: duration.lg }}
    >
      {/* Left: Milestones Timeline */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div>
          <h3 className="font-display font-bold text-xl text-foreground">
            Evolução Histórica
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Explore os marcos da Mega-Sena e o crescimento das premiações ao longo dos anos.
          </p>
        </div>

        <div className="relative border-l border-border/60 ml-3 space-y-8 py-2">
          {MILESTONES.map((m) => {
            const isActive = selectedYear === m.year;
            return (
              <button
                key={m.year}
                onClick={() => setSelectedYear(isActive ? null : m.year)}
                className={`relative pl-6 text-left transition-opacity duration-300 w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg ${isActive || !selectedYear
                  ? "opacity-100"
                  : "opacity-40 hover:opacity-100"
                  }`}
              >
                <div
                  className={`absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-background transition-colors duration-300 shadow-sm ${isActive
                    ? ""
                    : "border-border text-muted-foreground"
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
                  <h4 className="font-semibold text-sm text-foreground">
                    {m.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {m.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Dual Axis Composed Chart */}
      <div className="lg:w-2/3 flex flex-col min-h-[400px]">
        <div className="flex-1 w-full min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%" style={{ outline: "none" }}>
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 0, bottom: 0, left: -20 }}
              onClick={handleClick}
              style={{ cursor: "pointer", outline: "none" }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.GRID_STROKE}
                vertical={false}
              />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontWeight: "600" }}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                interval="preserveStartEnd"
              />
              {/* Revenue Axis replacing Prizes Axis */}
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={formatCompactCurrency}
                tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontStretch: "condensed" }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                width={80}
              />

              <Tooltip
                content={(props) => <CustomTooltip {...props} />}
                cursor={{ fill: CHART_COLORS.CURSOR }}
              />

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
            onClick={() => toggleSeries("maxPrize")}
            className={`flex items-center gap-2 transition-opacity duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${
              visibleSeries.maxPrize ? "opacity-100 hover:opacity-80" : "opacity-40 hover:opacity-60"
            }`}
          >
            <div className="w-4 h-1 rounded-full" style={{ backgroundColor: CHART_COLORS.AMBER }} />
            <span>Maior Prêmio</span>
          </button>
          <button
            onClick={() => toggleSeries("totalDistributed")}
            className={`flex items-center gap-2 transition-opacity duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${
              visibleSeries.totalDistributed ? "opacity-100 hover:opacity-80" : "opacity-40 hover:opacity-60"
            }`}
          >
            <div className="w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: CHART_COLORS.BLUE }} />
            <span>Total distribuídos</span>
          </button>
          <button
            onClick={() => toggleSeries("totalRevenue")}
            className={`flex items-center gap-2 transition-opacity duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${
              visibleSeries.totalRevenue ? "opacity-100 hover:opacity-80" : "opacity-40 hover:opacity-60"
            }`}
          >
            <div className="w-3 h-3 rounded" style={{ backgroundColor: CHART_COLORS.EMERALD, opacity: 0.4 }} />
            <span>Arrecadação Total</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
