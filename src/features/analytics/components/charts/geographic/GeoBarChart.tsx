import { CHART_COLORS } from '@/shared/constants/chart-colors';
import { ChartTooltip } from '@/features/analytics/components/shared/ChartTooltip';
import { memo } from 'react';
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
import { GeoDataPoint } from './geo.types';
const STATE_COLORS: Record<string, string> = {
  SP: CHART_COLORS.AMBER,
  MG: CHART_COLORS.RED,
  RJ: CHART_COLORS.VIOLET,
  PR: CHART_COLORS.BLUE,
  RS: CHART_COLORS.EMERALD,
  SC: 'hsl(var(--info))',
  BA: 'hsl(var(--primary))',
  GO: 'hsl(var(--success))',
  PB: 'hsl(var(--hot))',
  PE: 'hsl(var(--info) / 0.8)',
  CE: 'hsl(var(--violet))',
  ELECT: 'hsl(var(--muted-foreground))',
};

const STATE_NAMES: Record<string, string> = {
  ELECT: 'Canal Eletrônico',
};

const tickFormatter = (v: string) => (STATE_NAMES[v] ? '🌐' : v);
const percentageFormatter = (v: number) => `${v}%`;

export const GeoBarChart = memo(function GeoBarChart({ data }: { data: GeoDataPoint[] }) {
  return (
    <div className="glass-card p-4">
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 48, top: 4, bottom: 4 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.GRID_STROKE}
            horizontal={false}
          />
          <XAxis type="number" tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }} />
          <YAxis
            dataKey="state"
            type="category"
            tick={{ fontSize: 12, fill: CHART_COLORS.TICK_LABEL, fontFamily: 'monospace' }}
            width={32}
            tickFormatter={tickFormatter}
          />
          <Tooltip
            content={(props) => {
              const { formatter: _f, ...rest } = props;
              return (
                <ChartTooltip
                  {...rest}
                  items={[
                    { label: 'Ganhadores', value: 'total' },
                    {
                      label: 'Percentual',
                      value: 'percentage',
                      suffix: '%',
                      color: 'text-primary',
                    },
                  ]}
                />
              );
            }}
            cursor={{ fill: CHART_COLORS.CURSOR }}
          />
          <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={24}>
            {data.map((d) => (
              <Cell key={d.state} fill={STATE_COLORS[d.state] ?? '#6366F1'} />
            ))}
            <LabelList
              dataKey="percentage"
              position="right"
              formatter={percentageFormatter}
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
  );
});
