import { ChartTooltip } from '@/features/analytics/components/shared/ChartTooltip';
import { CHART_COLORS } from '@/shared/constants/chart-colors';
import { useFrequencies } from '@/store/selectors';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { freqToColor } from './bubble-chart.utils';
import { FilterMode } from './frequency-bar.constants';

interface FrequencyBarChartProps {
  filter: FilterMode;
}

export function FrequencyBarChart({ filter }: FrequencyBarChartProps) {
  const data = useFrequencies();

  const chartData = useMemo(() => {
    if (!data?.ranking) return [];
    const ranking = [...data.ranking];
    if (filter === 'top30') return ranking.slice(0, 30);
    if (filter === 'bottom30') return ranking.slice(-30).reverse();
    return ranking;
  }, [data, filter]);

  if (!data?.ranking) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const totalItems = data.ranking.length;

  return (
    <div className=" ">
      <div className="p-4">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 8, right: 48, top: 4, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.GRID_STROKE}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <YAxis
              dataKey="number"
              type="category"
              tick={{ fontSize: 12, fill: CHART_COLORS.TICK_LABEL, fontFamily: 'monospace' }}
              width={32}
            />
            <Tooltip
              content={(props) => <ChartTooltip {...props} />}
              cursor={{ fill: CHART_COLORS.CURSOR }}
            />
            <Bar dataKey="frequency" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.number}
                  fill={freqToColor(entry.frequency, data.min.frequency, data.max.frequency)}
                />
              ))}
              <LabelList
                dataKey="percentage"
                position="right"
                formatter={(v: number) => `${v}%`}
                style={{
                  fontSize: 10,
                  fill: CHART_COLORS.TICK_LABEL,
                  fontFamily: 'monospace',
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>


    </div>
  );
}
