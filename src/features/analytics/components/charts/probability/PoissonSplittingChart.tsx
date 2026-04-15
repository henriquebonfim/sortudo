import { usePoissonSplitSeries } from '@/hooks/use-analytics';
import { TOTAL_COMBINATIONS } from '@/shared/constants';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const RECHARTS_LABEL_STYLE_BOLD = {
  color: CHART_COLORS.TICK_LABEL,
  marginBottom: '8px',
  fontWeight: 'bold',
} as const;
const RECHARTS_TOOLTIP_STYLE = {
  backgroundColor: CHART_COLORS.TOOLTIP_BG,
  borderColor: CHART_COLORS.TOOLTIP_BORDER,
  borderRadius: '12px',
  border: 'none',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
} as const;

export function PoissonSplittingChart() {
  const chartData = usePoissonSplitSeries();

  return (
    <div className="space-y-4">
      <div className="  p-6 ">
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          À medida que as vendas de bilhetes (Eixo X) superam as combinações totais (
          {TOTAL_COMBINATIONS.toLocaleString()}), a probabilidade de você ser forçado a dividir o
          prêmio (área em <span className="text-primary font-bold">Laranja</span>) dispara.
        </p>
      </div>
      <ResponsiveContainer width="100%" height={700} minWidth={0} minHeight={1}>
        <ComposedChart data={chartData} margin={{ left: -20, right: 30, top: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="displaySales"
            tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: 'monospace' }}
            angle={-45}
            textAnchor="end"
            dy={15}
          />
          <YAxis
            tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: 'monospace' }}
            domain={[0, 100]}
            tickFormatter={(val) => `${val}%`}
          />

          <Tooltip
            contentStyle={RECHARTS_TOOLTIP_STYLE}
            itemStyle={{ fontSize: '12px', padding: '2px 0' }}
            labelStyle={RECHARTS_LABEL_STYLE_BOLD}
            formatter={(value, name) => {
              if (name === 'probMultiple') return [`${value}%`, 'Dividindo (≥ 2 ganhadores)'];
              if (name === 'probOne') return [`${value}%`, 'Ganhador Único'];
              if (name === 'probZero') return [`${value}%`, 'Ninguém Ganha (Acumula)'];
              return [value, name];
            }}
          />

          <Area
            type="monotone"
            dataKey="probMultiple"
            fill={CHART_COLORS.AMBER}
            stroke="none"
            fillOpacity={0.4}
          />
          <Area
            type="monotone"
            dataKey="probOne"
            fill={CHART_COLORS.EMERALD}
            stroke="none"
            fillOpacity={0.6}
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="probZero"
            fill={CHART_COLORS.BLUE}
            stroke="none"
            fillOpacity={0.3}
            stackId="1"
          />

          <Line
            type="monotone"
            dataKey="probMultiple"
            stroke={CHART_COLORS.AMBER}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
