import { memo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CHART_COLORS } from "@/domain/lottery/lottery.constants";

type GapEntry = { number: number; currentGap: number; maxGap: number };

const COLORS = {
  OVERDUE: CHART_COLORS.RED,
  WARM: CHART_COLORS.AMBER,
  COOL: CHART_COLORS.BLUE,
  MAX_GAP: `${CHART_COLORS.SLATE}4d`, // 30% opacity
};

const LEGEND_ITEMS = [
  { color: COLORS.OVERDUE, label: "Muito atrasado (>60%)" },
  { color: COLORS.WARM, label: "Atenção (35-60%)" },
  { color: COLORS.COOL, label: "Normal (<35%)" },
  { color: `${CHART_COLORS.SLATE}80`, label: "Recorde histórico" },
];

function getGapColor(current: number, max: number): string {
  const ratio = max > 0 ? current / max : 0;
  if (ratio > 0.6) return COLORS.OVERDUE;
  if (ratio > 0.35) return COLORS.WARM;
  return COLORS.COOL;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: GapEntry }>;
}

const CustomTooltip = memo(function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  const ratio = data.maxGap > 0 ? Math.round((data.currentGap / data.maxGap) * 100) : 0;
  
  return (
    <div className="glass-card border border-primary/20 p-3 text-xs font-mono">
      <p className="text-foreground font-bold text-sm mb-1">Nº {data.number}</p>
      <p className="text-muted-foreground">
        Atraso atual: <span className="text-foreground font-semibold">{data.currentGap} sorteios</span>
      </p>
      <p className="text-muted-foreground">
        Recorde de atraso: <span className="text-foreground">{data.maxGap} sorteios</span>
      </p>
      <p className="text-muted-foreground mt-1">
        Pressão:{" "}
        <span className={ratio > 60 ? "text-red-400 font-bold" : "text-amber-400"}>
          {ratio}%
        </span>
      </p>
    </div>
  );
});

const tickFormatter = (v: number) => `${v}`;

export default function GapAnalysisChart() {
  const stats = useLotteryStore((state) => state.stats);
  const data = stats?.gapAnalysis;

  if (!data || data.length === 0) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const top15 = data.slice(0, 15);

  return (
    <div className="space-y-3">
      <div className="glass-card p-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={top15}
            layout="vertical"
            margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
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
              dataKey="number"
              type="category"
              tick={{ fontSize: 12, fill: "#CBD5E1", fontFamily: "monospace" }}
              width={32}
              tickFormatter={tickFormatter}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar
              dataKey="maxGap"
              fill={COLORS.MAX_GAP}
              radius={[0, 4, 4, 0]}
              maxBarSize={16}
              name="Recorde"
            />
            <Bar
              dataKey="currentGap"
              radius={[0, 6, 6, 0]}
              maxBarSize={20}
              name="Atraso atual"
            >
              {top15.map((entry) => (
                <Cell
                  key={entry.number}
                  fill={getGapColor(entry.currentGap, entry.maxGap)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 text-xs text-muted-foreground">
        {LEGEND_ITEMS.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: c.color }}
            />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}
