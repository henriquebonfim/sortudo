import { CHART_COLORS } from '@/shared/constants/chart-colors';
import { memo } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PieSliceTooltip, OverlapBarTooltip } from '../chart-tooltips';

interface OverlapDataEntry {
  label: string;
  value: number;
  color: string;
}

export const OverlapChart = memo(function OverlapChart({ data }: { data: OverlapDataEntry[] }) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-muted-foreground mb-2 font-medium">
        Repetições entre sorteios consecutivos
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            content={(props) => <OverlapBarTooltip {...props} />}
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-muted-foreground mt-1">
        Números que se repetem do sorteio anterior
      </p>
    </div>
  );
});
