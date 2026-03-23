import { memo, useMemo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  CartesianGrid,
} from "recharts";
import { CHART_COLORS } from "@/domain/lottery/lottery.constants";
import { motion } from "framer-motion";
import { ChartTooltip } from "@/components/shared/ChartTooltip";

const STATE_COLORS: Record<string, string> = {
  SP: CHART_COLORS.AMBER,
  MG: CHART_COLORS.RED,
  RJ: CHART_COLORS.VIOLET,
  PR: CHART_COLORS.BLUE,
  RS: CHART_COLORS.EMERALD,
  SC: "#06B6D4",
  BA: "#F97316",
  GO: "#84CC16",
  PB: "#EC4899",
  PE: "#14B8A6",
  CE: "#6366F1",
  ELECT: "#94A3B8", // Canal Eletrônico
};

const STATE_NAMES: Record<string, string> = {
  ELECT: "Canal Eletrônico",
};

const REGIONS = [
  { name: "Sudeste", states: ["SP", "MG", "RJ", "ES"], color: CHART_COLORS.AMBER },
  { name: "Sul", states: ["PR", "RS", "SC"], color: CHART_COLORS.BLUE },
  { name: "Nordeste", states: ["BA", "PE", "CE", "PB", "MA", "RN", "AL", "SE", "PI"], color: CHART_COLORS.VIOLET },
  { name: "Centro-Oeste", states: ["GO", "MT", "MS", "DF"], color: CHART_COLORS.EMERALD },
  { name: "Norte", states: ["PA", "AM", "TO", "AC", "RR", "RO", "AP"], color: "#F97316" },
];

const RAW_REFERENCE_DATA = [
  { state: "SP", total: 233 },
  { state: "MG", total: 96 },
  { state: "RJ", total: 90 },
  { state: "PR", total: 76 },
  { state: "RS", total: 43 },
  { state: "SC", total: 35 },
  { state: "BA", total: 28 },
  { state: "GO", total: 22 },
  { state: "PB", total: 15 },
  { state: "PE", total: 14 },
];

const REFERENCE_TOTAL = RAW_REFERENCE_DATA.reduce((s, x) => s + x.total, 0);

const PROCESSED_REFERENCE_DATA = RAW_REFERENCE_DATA.map((d) => ({
  ...d,
  percentage: Math.round((d.total / REFERENCE_TOTAL) * 1000) / 10,
}));

interface GeoDataPoint {
  state: string;
  total: number;
  percentage: number;
}

const RegionSummary = memo(function RegionSummary({ data }: { data: GeoDataPoint[] }) {
  const regionTotals = useMemo(() => {
    const grandTotal = data.reduce((s, d) => s + d.total, 0) || 1;
    return REGIONS.map((r) => {
      const regionTotal = data
        .filter((d) => r.states.includes(d.state))
        .reduce((sum, d) => sum + d.total, 0);
      return {
        ...r,
        total: regionTotal,
        percentage: Math.round((regionTotal / grandTotal) * 1000) / 10,
      };
    }).sort((a, b) => b.total - a.total);
  }, [data]);

  return (
    <div className="grid grid-cols-5 gap-2 mb-4">
      {regionTotals.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="text-center p-2 rounded-lg border"
          style={{ borderColor: `${r.color}40`, backgroundColor: `${r.color}12` }}
        >
          <div className="font-mono font-bold text-sm" style={{ color: r.color }}>
            {r.percentage}%
          </div>
          <div className="text-[9px] text-muted-foreground leading-tight mt-0.5">
            {r.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
});

const tickFormatter = (v: string) => (STATE_NAMES[v] ? "🌐" : v);
const percentageFormatter = (v: number) => `${v}%`;

const GeoBarChart = memo(function GeoBarChart({ data }: { data: GeoDataPoint[] }) {
  return (
    <div className="glass-card p-4">
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 8, right: 48, top: 4, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.GRID_STROKE}
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
          />
          <YAxis
            dataKey="state"
            type="category"
            tick={{ fontSize: 12, fill: "#CBD5E1", fontFamily: "monospace" }}
            width={32}
            tickFormatter={tickFormatter}
          />
          <Tooltip
            content={
              <ChartTooltip 
                items={[
                  { label: "Ganhadores", value: "total" },
                  { label: "Percentual", value: "percentage", suffix: "%", color: "text-primary" }
                ]}
              />
            }
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={24}>
            {data.map((d) => (
              <Cell key={d.state} fill={STATE_COLORS[d.state] ?? "#6366F1"} />
            ))}
            <LabelList
              dataKey="percentage"
              position="right"
              formatter={percentageFormatter}
              style={{
                fontSize: 10,
                fill: CHART_COLORS.TICK_LABEL,
                fontFamily: "monospace",
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default function GeoWinnersChart() {
  const stats = useLotteryStore((state) => state.stats);
  const data = stats?.geoWinners;

  const chartData = useMemo(() => {
    return (data || []).slice(0, 15);
  }, [data]);

  if (!stats) return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;

  if (chartData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="glass-card p-4 text-center space-y-2">
          <p className="text-muted-foreground text-sm">
            Dados geográficos não disponíveis. Certifique-se que a coluna{" "}
            <code className="text-primary">Cidade / UF</code> está presente.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Referência histórica (concursos 1–2982):
          </p>
        </div>
        <RegionSummary data={PROCESSED_REFERENCE_DATA} />
        <GeoBarChart data={PROCESSED_REFERENCE_DATA} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RegionSummary data={chartData} />
      <GeoBarChart data={chartData} />
    </div>
  );
}
