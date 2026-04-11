import { useNumberProfile } from '@/features/analytics/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/constants/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieSliceTooltip } from '../chart-tooltips';

export function ClusteringChart() {
  const meta = useLotteryMeta();
  const profile = useNumberProfile();
  const analysis = profile?.decadeAnalysis;

  const chartData = useMemo(() => {
    if (!analysis) return [];
    const mixed = Math.max(0, 100 - (analysis.clusteredPct + analysis.fullySpreadPct));
    return [
      { name: 'Aglomerados', value: analysis.clusteredPct, color: CHART_COLORS.RED },
      { name: 'Mistos', value: Number(mixed.toFixed(2)), color: CHART_COLORS.BLUE },
      {
        name: 'Totalmente Espalhados',
        value: analysis.fullySpreadPct,
        color: CHART_COLORS.EMERALD,
      },
    ];
  }, [analysis]);

  if (!meta || !analysis) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className=" p-4 flex flex-col items-center">

      <p className="text-[10px] text-muted-foreground mb-4 text-center">
        Como os números se espalham pelas linhas (1-9, 10-19...).
      </p>
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
            <Tooltip content={(props) => <PieSliceTooltip {...props} />} />
            <Legend wrapperStyle={{ fontSize: '10px', bottom: '-10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
