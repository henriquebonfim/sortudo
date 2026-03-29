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
  TooltipProps,
} from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  return (
    <div className="glass-card border border-primary/20 p-3 text-xs font-mono space-y-1">
      <p className="text-foreground font-bold text-sm mb-1.5">
        Sequência de {data.streak} acúmulo{data.streak !== 1 ? "s" : ""}
      </p>
      <p className="text-muted-foreground">
        Ocorrências: <span className="text-blue-400 font-semibold">{data.count} sorteios</span>
      </p>
    </div>
  );
});

export default function StreakFrequencyChart() {
  const stats = useLotteryStore((state) => state.stats);
  const economics = stats?.streakEconomics;

  const chartData = useMemo(() => {
    if (!economics) return [];
    
    // We want to map streak length and drawsCount
    const formatted = economics
      .filter((d) => d.streakLength <= 14) // Focus on main distribution
      .map((d) => ({
        streak: d.streakLength,
        count: d.drawsCount,
      }));
      
    // Fill in missing streaks up to 14
    for(let i=0; i<=14; i++) {
        if(!formatted.find(f => f.streak === i)) {
            formatted.push({ streak: i, count: 0 });
        }
    }
    
    return formatted.sort((a,b) => a.streak - b.streak);
  }, [economics]);

  if (!stats || chartData.length === 0) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="glass-card p-4">
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: -10, top: 10, bottom: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} vertical={false} />
            <XAxis 
              dataKey="streak" 
              tick={{ fontSize: 10, fill: CHART_COLORS.TICK_LABEL }} 
              label={{ value: "Nº de Acúmulos", position: "insideBottom", offset: -5, fill: "#64748B", fontSize: 10 }}
            />
            <YAxis tick={{ fontSize: 10, fill: CHART_COLORS.TICK_LABEL }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="count" fill={CHART_COLORS.BLUE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
