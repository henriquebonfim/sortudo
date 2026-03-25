import { memo, useMemo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  TooltipProps,
} from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";

interface ExtendedPairData {
  pair: string;
  number1: number;
  number2: number;
  count: number;
  pct: number;
}

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as ExtendedPairData;
  
  return (
    <div className="glass-card border border-primary/20 p-3 text-xs font-mono">
      <p className="text-foreground font-bold">Par {data.pair}</p>
      <p className="text-muted-foreground">
        Co-ocorrências: <span className="text-foreground">{data.count}</span>
      </p>
      <p className="text-primary mt-1">{data.pct}% do total de concursos</p>
    </div>
  );
});

const PairCard = memo(function PairCard({
  data,
  index,
}: {
  data: ExtendedPairData;
  index: number;
}) {
  return (
    <div className="glass-card p-2 text-center flex flex-col items-center gap-1 rounded-lg border border-primary/10">
      <span className="text-[10px] text-muted-foreground">#{index + 1}</span>
      <div className="flex gap-1">
        {[data.number1, data.number2].map((num) => (
          <span
            key={num}
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold"
            style={{
              background: "rgba(139,92,246,0.2)",
              border: `1px solid ${CHART_COLORS.VIOLET}66`,
              color: "#C4B5FD",
            }}
          >
            {num}
          </span>
        ))}
      </div>
      <span
        className="text-[11px] font-mono text-amber-400 font-bold"
        style={{ color: CHART_COLORS.AMBER }}
      >
        {data.count}×
      </span>
    </div>
  );
});

export default function PairCooccurrenceChart() {
  const { stats, metadata } = useLotteryStore();
  const rawData = stats?.topPairs;

  const data = useMemo(() => {
    if (!rawData || !metadata) return [];
    const total = Math.max(metadata.totalDraws, 1);
    return rawData.map((item) => ({
      ...item,
      pct: Math.round((item.count / total) * 1000) / 10,
    }));
  }, [rawData, metadata]);

  if (!stats || !metadata || data.length === 0) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const maxCount = data[0]?.count ?? 1;

  return (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 12, right: 48, top: 4, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.GRID_STROKE}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
              domain={[0, maxCount + 5]}
            />
            <YAxis
              dataKey="pair"
              type="category"
              tick={{ fontSize: 11, fill: "#CBD5E1", fontFamily: "monospace" }}
              width={40}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={22}>
              {data.map((d, i) => (
                <Cell
                  key={d.pair}
                  fill={`hsla(${271 - i * 10}, 80%, ${60 - i * 1.5}%, 0.85)`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {data.slice(0, 10).map((d, i) => (
          <PairCard key={d.pair} data={d} index={i} />
        ))}
      </div>
    </div>
  );
}
