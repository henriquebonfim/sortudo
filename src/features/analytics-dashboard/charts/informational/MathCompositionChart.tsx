import { memo, useMemo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
    <div className="glass-card border border-primary/20 p-2 text-xs font-mono">
      <p className="text-foreground">
        {data.name}: <strong style={{ color: data.color }}>{data.value}%</strong>
      </p>
    </div>
  );
});

export default function MathCompositionChart() {
  const stats = useLotteryStore((state) => state.stats);
  const profile = stats?.numberProfile;

  const chartData = useMemo(() => {
    if (!profile) return [];
    
    // We calculate "Outros" assuming total is 100%
    const outros = Math.max(0, 100 - (profile.primesPercentage + profile.multiplesOf5Percentage + profile.multiplesOf10Percentage));

    return [
      { name: "Primos", value: profile.primesPercentage, color: CHART_COLORS.VIOLET },
      { name: "Múltiplos de 5", value: profile.multiplesOf5Percentage, color: CHART_COLORS.AMBER },
      { name: "Múltiplos de 10", value: profile.multiplesOf10Percentage, color: CHART_COLORS.EMERALD },
      { name: "Outros", value: Number(outros.toFixed(2)), color: CHART_COLORS.SLATE },
    ];
  }, [profile]);

  if (!stats || chartData.length === 0) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="glass-card p-4 flex flex-col items-center">
      <h4 className="text-sm font-semibold mb-1 text-slate-200 w-full text-center">Composição Matemática</h4>
      <p className="text-[10px] text-muted-foreground mb-4 text-center">Tipos de números mais sorteados.</p>
      
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: "10px", bottom: "-10px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
