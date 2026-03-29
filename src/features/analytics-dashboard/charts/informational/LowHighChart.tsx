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

export default function LowHighChart() {
  const stats = useLotteryStore((state) => state.stats);
  const data = stats?.numberProfile?.lowHighSplit;

  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Baixa (1–30)", value: data.low, color: CHART_COLORS.BLUE },
      { name: "Alta (31–60)", value: data.high, color: CHART_COLORS.AMBER },
    ];
  }, [data]);

  if (!stats || chartData.length === 0) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="glass-card p-4 flex flex-col items-center">
      <h4 className="text-sm font-semibold mb-1 text-slate-200 w-full text-center">Dezenas Baixas vs Altas</h4>
      <p className="text-[10px] text-muted-foreground mb-4 text-center">Distribuição ao longo de todos os sorteios.</p>
      
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
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
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
