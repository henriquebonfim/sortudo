import { CHART_COLORS } from '@/shared/styles/chart-colors';
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
/** Light foreground for recharts LabelList and cell labels. */
const RECHARTS_LABEL_FOREGROUND = CHART_COLORS.FOREGROUND;
const RECHARTS_TOOLTIP_STYLE = {
  backgroundColor: CHART_COLORS.TOOLTIP_BG,
  borderColor: CHART_COLORS.TOOLTIP_BORDER,
  borderRadius: '12px',
  border: 'none',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
} as const;

/** Cursor overlay for bar charts. */
const RECHARTS_CURSOR_BAR = { fill: CHART_COLORS.CURSOR } as const;

export function JackpotErosionWaterfall() {
  const chartData = useMemo(() => {
    const advertisedJackpot = 1_000_000_000; // 1 Billion Base Case

    // Roughly half the advertised annuity is in the cash pool
    const cashValue = advertisedJackpot * 0.48;

    // Federal Tax (Highest bracket is 37%) - Note: mandatory initial withholding is 24% but ultimate tax is 37%
    const federalTax = cashValue * 0.37;

    // Average State Tax across US (let's say 6.5%, though some are 0 and some like NY are 10.9%)
    const stateTax = cashValue * 0.065;

    const trueTakeHome = cashValue - federalTax - stateTax;

    return [
      {
        name: 'Prêmio Anunciado',
        value: advertisedJackpot,
        displayValue: '$1.0B',
        baseColor: CHART_COLORS.EMERALD,
      },
      {
        name: 'Opção em Dinheiro (Valor Único)',
        value: cashValue,
        displayValue: `$${(cashValue / 1_000_000).toFixed(0)}M`,
        baseColor: '#059669', // darker emerald — no primitive yet
      },
      {
        name: 'Impostos Federais (37%)',
        value: federalTax,
        displayValue: `-$${(federalTax / 1_000_000).toFixed(0)}M`,
        baseColor: CHART_COLORS.RED,
      },
      {
        name: 'Impostos Estaduais (Média 6,5%)',
        value: stateTax,
        displayValue: `-$${(stateTax / 1_000_000).toFixed(0)}M`,
        baseColor: '#F87171', // light red — no primitive yet
      },
      {
        name: 'Valor Real Recebido (líquido)',
        value: trueTakeHome,
        displayValue: `$${(trueTakeHome / 1_000_000).toFixed(0)}M`,
        baseColor: CHART_COLORS.AMBER,
      },
    ];
  }, []);

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 60, left: 40, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_COLORS.GRID_STROKE}
            horizontal={false}
            vertical={true}
          />
          <XAxis
            type="number"
            tickFormatter={(val) => `$${(val / 1_000_000).toFixed(0)}M`}
            tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: 'monospace' }}
            domain={[0, 1_000_000_000]}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 12, fill: '#CBD5E1', fontWeight: 'bold' }}
            width={160}
          />
          <Tooltip
            cursor={RECHARTS_CURSOR_BAR}
            contentStyle={RECHARTS_TOOLTIP_STYLE}
            itemStyle={{ color: RECHARTS_LABEL_FOREGROUND, fontWeight: 'bold' }}
            formatter={(value: number) => [`$${(value / 1_000_000).toFixed(0)} Milhões`, 'Quantia']}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.baseColor} fillOpacity={0.8} />
            ))}
            <LabelList
              dataKey="displayValue"
              position="right"
              style={{
                fill: RECHARTS_LABEL_FOREGROUND,
                fontSize: 13,
                fontWeight: 'bold',
                fontFamily: 'monospace',
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
