import { useNumberProfile } from '@/features/analytics/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/constants/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieSliceTooltip } from '@/features/analytics/components/charts/chart-tooltips';

export function LowHighChart() {
  const meta = useLotteryMeta();
  const profile = useNumberProfile();
  const data = profile?.lowHighSplit;

  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Baixa (1–30)', value: data.low, color: CHART_COLORS.BLUE },
      { name: 'Alta (31–60)', value: data.high, color: CHART_COLORS.AMBER },
    ];
  }, [data]);

  if (!meta || chartData.length === 0) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="  p-4 flex flex-col items-center">
      <h4 className="text-sm font-semibold mb-1 text-slate-200 w-full text-center">
        Dezenas Baixas vs Altas
      </h4>
      <p className="text-[10px] text-muted-foreground mb-4 text-center">
        Distribuição ao longo de todos os sorteios.
      </p>
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
            <Tooltip content={(props) => <PieSliceTooltip {...props} />} />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
