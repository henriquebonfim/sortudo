import { useTemporalFrequency } from '@/features/analytics/hooks/use-analytics';
import { useLotteryMeta } from '@/store/selectors';
import { memo, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CHART_COLORS } from '@/shared/constants/chart-colors';

interface DecadeEntryData {
  number: string;
  [decade: string]: number | string;
}

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    dataKey: string | number;
    value: number | string;
    color: string;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card border border-primary/20 p-3 text-xs font-mono space-y-1">
      <p className="text-foreground font-bold mb-1">Nº {label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey}: {p.value}×
        </p>
      ))}
    </div>
  );
});

export function TopNumbersByDecadeChart() {
  const meta = useLotteryMeta();
  const data = useTemporalFrequency();

  const groupedData = useMemo(() => {
    if (!data || !data.length) return [];

    const numMap: Record<number, DecadeEntryData> = {};

    data.forEach((decadeEntry) => {
      const dec = decadeEntry.decade;
      decadeEntry.data.forEach((item) => {
        if (!numMap[item.number]) {
          numMap[item.number] = { number: String(item.number).padStart(2, '0') };
        }
        numMap[item.number][dec] = item.frequency;
      });
    });

    return Object.values(numMap).sort((a, b) => {
      const totalA = Object.entries(a).reduce(
        (sum, [k, v]) => (k !== 'number' ? sum + Number(v) : sum),
        0
      );
      const totalB = Object.entries(b).reduce(
        (sum, [k, v]) => (k !== 'number' ? sum + Number(v) : sum),
        0
      );
      return totalB - totalA;
    });
  }, [data]);

  if (!meta) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  if (groupedData.length === 0) return null;

  return (
    <div className="pt-4">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={groupedData}
          layout="vertical"
          margin={{ left: -10, top: 0, bottom: 0, right: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.GRID_STROKE}
            horizontal={true}
            vertical={false}
          />
          <XAxis
            type="number"
            tick={{ fill: CHART_COLORS.TICK_LABEL, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="number"
            type="category"
            tick={{ fill: '#F8FAFC', fontSize: 11, fontWeight: 600 }}
            width={45}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} />
          <Bar dataKey="1990s" fill={CHART_COLORS.SLATE} radius={[0, 4, 4, 0]} />
          <Bar dataKey="2000s" fill={CHART_COLORS.BLUE} radius={[0, 4, 4, 0]} />
          <Bar dataKey="2010s" fill={CHART_COLORS.EMERALD} radius={[0, 4, 4, 0]} />
          <Bar dataKey="2020s" fill={CHART_COLORS.AMBER} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
