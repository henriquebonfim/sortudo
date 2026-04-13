import { ChartTooltip } from '@/features/analytics/components/charts/shared/ChartTooltip';
import { useGeoWinners } from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useLotteryMeta } from '@/store/selectors';
import { motion } from 'framer-motion';
import { BarChart3Icon, MapIcon } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
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

interface BrazilMapProps {
  data: GeoDataPoint[];
}

interface GeoDataPoint {
  state: string;
  total: number;
  percentage: number;
}

interface RegionSummaryProps {
  data: GeoDataPoint[];
}

const REGIONS = [
  { name: 'Sudeste', states: ['SP', 'MG', 'RJ', 'ES'], color: CHART_COLORS.AMBER },
  { name: 'Sul', states: ['PR', 'RS', 'SC'], color: CHART_COLORS.BLUE },
  {
    name: 'Nordeste',
    states: ['BA', 'PE', 'CE', 'PB', 'MA', 'RN', 'AL', 'SE', 'PI'],
    color: CHART_COLORS.VIOLET,
  },
  { name: 'Centro-Oeste', states: ['GO', 'MT', 'MS', 'DF'], color: CHART_COLORS.EMERALD },
  { name: 'Norte', states: ['PA', 'AM', 'TO', 'AC', 'RR', 'RO', 'AP'], color: CHART_COLORS.RED },
];

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

const BRAZIL_STATES_PATH_DATA: Record<string, string> = {
  AC: 'M28,110 L35,110 L40,115 L38,125 L30,130 L25,125 Z',
  AL: 'M195,115 L200,118 L198,122 L193,120 Z',
  AP: 'M120,25 L130,22 L135,30 L125,35 Z',
  AM: 'M30,55 L85,45 L110,60 L115,100 L90,125 L45,110 L25,80 Z',
  BA: 'M160,105 L185,100 L195,125 L180,165 L165,160 L145,145 L155,120 Z',
  CE: 'M180,65 L195,68 L198,85 L185,82 Z',
  DF: 'M152,152 L158,152 L158,158 L152,158 Z',
  ES: 'M188,175 L195,178 L192,192 L185,188 Z',
  GO: 'M135,140 L160,135 L165,175 L145,190 L130,170 Z',
  MA: 'M145,50 L165,55 L170,95 L150,90 Z',
  MT: 'M95,120 L135,115 L145,170 L110,185 L85,160 Z',
  MS: 'M105,190 L130,185 L135,225 L115,235 L100,215 Z',
  MG: 'M155,160 L185,155 L190,195 L175,210 L150,205 L140,175 Z',
  PA: 'M110,40 L150,45 L160,105 L140,110 L130,120 L105,100 Z',
  PB: 'M195,85 L205,88 L203,95 L193,92 Z',
  PR: 'M115,238 L145,235 L140,255 L120,260 Z',
  PE: 'M185,88 L205,92 L203,105 L180,102 Z',
  PI: 'M165,65 L180,68 L185,110 L170,105 Z',
  RJ: 'M175,215 L188,212 L185,222 L172,225 Z',
  RN: 'M195,72 L205,75 L203,82 L193,78 Z',
  RS: 'M105,265 L135,260 L130,295 L110,298 Z',
  RO: 'M60,120 L95,115 L105,145 L80,155 L55,140 Z',
  RR: 'M75,15 L100,20 L105,50 L80,55 Z',
  SC: 'M120,255 L145,252 L140,268 L115,272 Z',
  SP: 'M140,210 L170,205 L175,235 L145,245 L135,225 Z',
  SE: 'M190,125 L195,125 L195,135 L190,135 Z',
  TO: 'M145,95 L160,100 L155,145 L140,140 Z',
};

const tickFormatter = (v: string) => (STATE_NAMES[v] ? '🌐' : v);
const percentageFormatter = (v: number) => `${v}%`;
const RegionSummary = memo(function RegionSummary({ data }: RegionSummaryProps) {
  const regionTotals = useMemo(() => {
    const grandTotal = data.reduce((s, d) => s + d.total, 0) || 1;

    const regions: {
      name: string;
      states: string[];
      color: string;
      total: number;
      percentage: number;
    }[] = REGIONS.map((r) => {
      const regionTotal = data
        .filter((d) => r.states.includes(d.state))
        .reduce((sum, d) => sum + d.total, 0);
      return {
        ...r,
        total: regionTotal,
        percentage: Math.round((regionTotal / grandTotal) * 1000) / 10,
      };
    });

    const digitalTotal = data
      .filter((d) => d.state === 'ELECT')
      .reduce((sum, d) => sum + d.total, 0);

    if (digitalTotal > 0) {
      regions.push({
        name: 'Digital',
        states: ['ELECT'],
        color: CHART_COLORS.SLATE,
        total: digitalTotal,
        percentage: Math.round((digitalTotal / grandTotal) * 1000) / 10,
      });
    }

    return regions.sort((a, b) => b.total - a.total);
  }, [data]);

  return (
    <div className={`grid gap-2 mb-4 ${regionTotals.length > 5 ? 'grid-cols-6' : 'grid-cols-5'}`}>
      {regionTotals.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="text-center p-2 rounded-lg border border-border bg-card/30"
        >
          <div className="font-mono font-bold text-sm text-foreground">{r.percentage}%</div>
          <div className="text-[9px] text-muted-foreground leading-tight mt-0.5">{r.name}</div>
        </motion.div>
      ))}
    </div>
  );
});


const GeoBarChart = memo(function GeoBarChart({ data }: { data: GeoDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 48, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} horizontal={false} />
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
  );
});

const BrazilMap = memo(function BrazilMap({ data }: BrazilMapProps) {
  const maxTotal = useMemo(() => Math.max(...data.map((d) => d.total), 1), [data]);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto opacity-90 p-4">
      <svg viewBox="0 0 250 320" className="w-full h-full drop-shadow-2xl filter brightness-110">
        {/* Background base - Subtle Brazil outline represented by all states */}
        {Object.keys(BRAZIL_STATES_PATH_DATA).map((state) => (
          <path
            key={`base-${state}`}
            d={BRAZIL_STATES_PATH_DATA[state]}
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        ))}

        {data.map((d) => {
          const path = BRAZIL_STATES_PATH_DATA[d.state];
          if (!path) return null;

          const intensity = d.total / maxTotal;
          const isDF = d.state === 'DF';

          return (
            <path
              key={d.state}
              d={path}
              fill={`rgba(var(--primary-rgb), ${0.15 + intensity * 0.85})`}
              stroke={isDF ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}
              strokeWidth={isDF ? '1' : '0.5'}
              className="transition-all duration-300 hover:fill-primary cursor-pointer"
            >
              <title>{`${d.state}: ${d.total} ganhadores (${d.percentage}%)`}</title>
            </path>
          );
        })}
      </svg>
      <div className="absolute bottom-0 right-0 p-2 text-[9px] text-muted-foreground uppercase tracking-widest bg-black/40 backdrop-blur-sm rounded">
        Mapa de Densidade
      </div>
    </div>
  );
});

export function GeoWinnersChart() {
  const meta = useLotteryMeta();
  const data = useGeoWinners();
  const [view, setView] = useState<'map' | 'bar'>('bar');

  const chartData = useMemo(() => {
    return (data || []).slice(0, 15);
  }, [data]);

  if (!meta) return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 bg-muted/5 border border-dashed rounded-xl px-4">
        <MapIcon className="w-8 h-8 text-muted-foreground/20" />
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium">
            Dados geográficos não encontrados
          </p>
          <p className="text-[11px] text-muted-foreground/50 max-w-[200px]">
            Para visualizar este mapa, os dados precisam incluir o campo de localidade.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Switcher */}
      <div className="flex justify-end gap-2 px-1">
        <button
          onClick={() => setView('map')}
          className={`p-1.5 rounded-lg border transition-all ${view === 'map' ? 'bg-primary/20 text-primary border-primary/30' : 'text-muted-foreground border-border hover:bg-muted'}`}
          title="Vista do Mapa"
        >
          <MapIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setView('bar')}
          className={`p-1.5 rounded-lg border transition-all ${view === 'bar' ? 'bg-primary/20 text-primary border-primary/30' : 'text-muted-foreground border-border hover:bg-muted'}`}
          title="Vista de Barras"
        >
          <BarChart3Icon className="w-4 h-4" />
        </button>
      </div>

      <RegionSummary data={data || []} />
      {view === 'map' ? <BrazilMap data={data || []} /> : <GeoBarChart data={chartData} />}
    </div>
  );
}
