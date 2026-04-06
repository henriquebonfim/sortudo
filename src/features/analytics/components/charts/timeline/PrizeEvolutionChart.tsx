import { useLotteryMeta, usePrizeEvolution } from '@/store/selectors';
import { CHART_COLORS, CHART_DIMENSIONS } from '@/shared/constants/chart-colors';
import { MEGA_DA_VIRADA_START_YEAR } from '@/lib/lottery/constants';
import { formatCompactCurrency } from '@/lib/lottery/utils';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const LEGEND_ITEMS = [
  { color: CHART_COLORS.AMBER, label: 'Prêmio máximo do ano' },
  { color: CHART_COLORS.BLUE, label: 'Total distribuídos' },
];

import { CurrencyTooltip } from '../chart-tooltips';

export function PrizeEvolutionChart() {
  const meta = useLotteryMeta();
  const data = usePrizeEvolution();

  if (!meta || !data) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const megaViradaYear = MEGA_DA_VIRADA_START_YEAR;

  return (
    <div className="glass-card p-4">
      <ResponsiveContainer width="100%" height={CHART_DIMENSIONS.DEFAULT_HEIGHT}>
        <AreaChart data={data} margin={CHART_DIMENSIONS.MARGIN}>
          <defs>
            <linearGradient id="maxPrizeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.AMBER} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.AMBER} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="totalDistributedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.BLUE} stopOpacity={0.25} />
              <stop offset="95%" stopColor={CHART_COLORS.BLUE} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }} />
          <YAxis
            tickFormatter={formatCompactCurrency}
            tick={{ fontSize: 10, fill: CHART_COLORS.TICK_LABEL }}
            width={64}
          />
          <Tooltip
            content={(props) => <CurrencyTooltip {...props} formatter={formatCompactCurrency} />}
          />
          <ReferenceLine
            x={megaViradaYear}
            stroke={CHART_COLORS.EMERALD}
            strokeDasharray="4 4"
            label={{
              value: 'Mega da Virada',
              position: 'top',
              fontSize: 10,
              fill: CHART_COLORS.EMERALD,
            }}
          />
          <Area
            type="monotone"
            dataKey="maxPrize"
            name="Prêmio Máximo"
            stroke={CHART_COLORS.AMBER}
            strokeWidth={2}
            fill="url(#maxPrizeGrad)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="totalDistributed"
            name="Total distribuídos"
            stroke={CHART_COLORS.BLUE}
            strokeWidth={2}
            fill="url(#totalDistributedGrad)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-3 text-xs text-muted-foreground">
        {LEGEND_ITEMS.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}
