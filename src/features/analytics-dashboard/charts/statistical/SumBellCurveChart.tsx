import { useMemo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { ChartTooltip } from "@/components/shared/ChartTooltip";

export default function SumBellCurveChart() {
  const stats = useLotteryStore((state) => state.stats);
  const rawData = stats?.sumDistribution;

  const { data, total, peak } = useMemo(() => {
    if (!rawData) return { data: [], total: 0, peak: 1 };
    
    const tot = rawData.reduce((s, item) => s + item.count, 0) || 1;
    const transformed = rawData.map((item) => ({
      ...item,
      pct: Math.round((item.count / tot) * 1000) / 10,
    }));
    const p = Math.max(...transformed.map((d) => d.count), 1);
    
    return { data: transformed, total: tot, peak: p };
  }, [rawData]);

  if (!stats || !rawData) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div
          className="w-3 h-3 rounded"
          style={{ backgroundColor: `${CHART_COLORS.AMBER}99` }}
        />
        <span>Zona de maior concentração (150–200)</span>
      </div>
      
      <div className="glass-card p-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ left: 0, right: 12, top: 8, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.GRID_STROKE}
              vertical={false}
            />
            <XAxis
              dataKey="bucket"
              tick={{ fontSize: 9, fill: CHART_COLORS.TICK_LABEL }}
              angle={-45}
              textAnchor="end"
              height={56}
            />
            <YAxis tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }} />
            <Tooltip
              content={
                <ChartTooltip 
                  items={[
                    { label: "Concursos", value: "count" },
                    { label: "Percentual", value: "pct", suffix: "%", color: "text-primary" }
                  ]}
                />
              }
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <ReferenceLine
              x="150–159"
              stroke={CHART_COLORS.AMBER}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            <ReferenceLine
              x="200–209"
              stroke={CHART_COLORS.AMBER}
              strokeDasharray="4 4"
              strokeOpacity={0.5}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {data.map((d) => {
                const isSweet = d.min >= 150 && d.max <= 209;
                const t = d.count / peak;
                const hue = isSweet ? 38 : 217;
                return (
                  <Cell
                    key={d.bucket}
                    fill={`hsla(${hue}, ${isSweet ? 92 : 80}%, ${45 + t * 20}%, ${isSweet ? 0.9 : 0.6})`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-xs text-muted-foreground/60">
        Total de {total.toLocaleString("pt-BR")} sorteios analisados. Soma mínima teórica: 21 (1+2+3+4+5+6) · Máxima: 345 (55+56+57+58+59+60).
      </p>
    </div>
  );
}
