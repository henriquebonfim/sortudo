import { useStreakEconomics } from '@/hooks/use-analytics';
import { Button } from '@/shared/components/ui/Button';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { formatCompactCurrency } from '@/shared/utils';
import { useLotteryMeta } from '@/store/selectors';
import { memo, useMemo, useState } from 'react';
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

type StreakEntry = {
  streak: number;
  count: number;
  avgCollection: number;
  avgPrize: number;
};

const VIEW_OPTIONS = [
  { id: 'chart' as const, label: 'Gráfico' },
  { id: 'table' as const, label: 'Tabela' },
];

const ChartLegend = memo(function ChartLegend() {
  return (
    <div className="flex gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.EMERALD }} />
        Arrecadação média
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.AMBER }} />
        Prêmio médio (quando sai)
      </div>
    </div>
  );
});

const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: StreakEntry; name: string; value: number; color?: string }[];
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="glass-card border border-primary/20 p-3 text-xs font-mono space-y-1">
      <p className="text-foreground font-bold text-sm mb-1.5">
        Sequência de {data.streak} acúmulo{data.streak !== 1 ? 's' : ''}
      </p>
      <p className="text-muted-foreground">
        Ocorrências: <span className="text-foreground">{data.count}</span>
      </p>
      <p className="text-muted-foreground">
        Arrecadação média:{' '}
        <span className="text-emerald-400 font-semibold">
          {formatCompactCurrency(data.avgCollection)}
        </span>
      </p>
      {data.avgPrize > 0 && (
        <p className="text-muted-foreground">
          Prêmio médio:{' '}
          <span className="text-amber-400 font-semibold">
            {formatCompactCurrency(data.avgPrize)}
          </span>
        </p>
      )}
    </div>
  );
});

const StreakChartTab = memo(function StreakChartTab({ data }: { data: StreakEntry[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 4 }}>
        <defs>
          <linearGradient id="gradCollection" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.EMERALD} stopOpacity={0.4} />
            <stop offset="95%" stopColor={CHART_COLORS.EMERALD} stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="gradPrize" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.AMBER} stopOpacity={0.4} />
            <stop offset="95%" stopColor={CHART_COLORS.AMBER} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} />
        <XAxis
          dataKey="streak"
          tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL }}
          label={{
            value: 'Nº de acúmulos',
            position: 'insideBottom',
            offset: -2,
            fontSize: 10,
            fill: '#64748B',
          }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 10, fill: CHART_COLORS.TICK_LABEL }}
          tickFormatter={(v: number) => formatCompactCurrency(v)}
          width={64}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 10, fill: CHART_COLORS.TICK_LABEL }}
          tickFormatter={(v: number) => formatCompactCurrency(v)}
          width={64}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="avgCollection"
          stroke={CHART_COLORS.EMERALD}
          fill="url(#gradCollection)"
          strokeWidth={2}
          name="Arrecadação Média"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="avgPrize"
          stroke={CHART_COLORS.AMBER}
          strokeWidth={2}
          dot={{ fill: CHART_COLORS.AMBER, r: 3 }}
          name="Prêmio Médio"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
});

const StreakTableTab = memo(function StreakTableTab({ data }: { data: StreakEntry[] }) {
  const tableData = useMemo(() => {
    return data.filter((d) => d.count >= 1);
  }, [data]);

  return (
    <div className=" ">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="text-left py-2 px-2">Acúmulos</th>
            <th className="text-right py-2 px-2">Vezes</th>
            <th className="text-right py-2 px-2">Arrec. Média</th>
            <th className="text-right py-2 px-2">Prêmio Médio</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((d) => (
            <tr key={d.streak} className="border-b border-border hover:bg-white/5">
              <td className="py-1.5 px-2 text-foreground font-semibold">{d.streak}</td>
              <td className="py-1.5 px-2 text-right text-muted-foreground">{d.count}</td>
              <td className="py-1.5 px-2 text-right text-emerald-400">
                {formatCompactCurrency(d.avgCollection)}
              </td>
              <td className="py-1.5 px-2 text-right text-amber-400">
                {d.avgPrize > 0 ? formatCompactCurrency(d.avgPrize) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export function StreakEconomicsChart() {
  const meta = useLotteryMeta();
  const rawData = useStreakEconomics();

  if (!meta || !rawData || rawData.length === 0) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="4 space-y-4">
      <div className="flex flex-col items-center gap-3">
        <StreakChartTab data={rawData} />
        <ChartLegend />
      </div>
      <StreakTableTab data={rawData} />
    </div>
  );
}
