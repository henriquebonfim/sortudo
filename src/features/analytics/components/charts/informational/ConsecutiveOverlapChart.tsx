import { useNumberProfile } from '@/features/analytics/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/constants/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieSliceTooltip } from '../chart-tooltips';

export function ConsecutiveOverlapChart() {
  const meta = useLotteryMeta();
  const profile = useNumberProfile();
  const overlaps = profile?.drawOverlaps;

  const chartData = useMemo(() => {
    if (!overlaps) return [];
    return [
      { name: '0 Repetidos', value: overlaps.zero, color: CHART_COLORS.EMERALD },
      { name: '1 Repetido', value: overlaps.one, color: CHART_COLORS.BLUE },
      {
        name: '2+ Repetidos',
        value: Number((overlaps.two + overlaps.threePlus).toFixed(2)),
        color: CHART_COLORS.AMBER,
      },
    ];
  }, [overlaps]);

  if (!meta || !overlaps || chartData.length === 0) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="glass-card p-4 flex flex-col items-center">
      <h4 className="text-sm font-semibold mb-1 text-slate-200 w-full text-center">
        Números Repetidos
      </h4>
      <p className="text-[10px] text-muted-foreground mb-4 text-center">
        Frequência em que números do sorteio anterior se repetem no atual.
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
