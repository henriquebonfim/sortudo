import { useNumberProfile } from '@/features/analytics/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/constants/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieSliceTooltip } from '../chart-tooltips';

export function MathCompositionChart() {
  const meta = useLotteryMeta();
  const profile = useNumberProfile();

  const chartData = useMemo(() => {
    if (!profile) return [];
    const outros = Math.max(
      0,
      100 -
      (profile.primesPercentage +
        profile.multiplesOf5Percentage +
        profile.multiplesOf10Percentage)
    );
    return [
      { name: 'Primos', value: profile.primesPercentage, color: CHART_COLORS.VIOLET },
      { name: 'Múltiplos de 5', value: profile.multiplesOf5Percentage, color: CHART_COLORS.AMBER },
      {
        name: 'Múltiplos de 10',
        value: profile.multiplesOf10Percentage,
        color: CHART_COLORS.EMERALD,
      },
      { name: 'Outros', value: Number(outros.toFixed(2)), color: CHART_COLORS.SLATE },
    ];
  }, [profile]);

  if (!meta || !profile || chartData.length === 0) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className=" p-4 flex flex-col items-center">
      <p className="text-[10px] text-muted-foreground mb-4 text-center">
        Tipos de números mais sorteados.
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
