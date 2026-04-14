import type { PrizeTimelineSeriesVisibility } from '@/shared/hooks/usePrizeTimelineInteraction';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import type { CSSProperties } from 'react';
import type { TooltipProps } from 'recharts';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface PrizeTimelineChartDatum {
  year: number;
  maxPrize: number;
  totalDistributed: number;
  totalRevenue: number;
}

interface PrizeTimelineChartProps {
  data: PrizeTimelineChartDatum[];
  selectedYear: number | null;
  visibleSeries: PrizeTimelineSeriesVisibility;
  onToggleSeries: (key: keyof PrizeTimelineSeriesVisibility) => void;
  onChartClick: (state: unknown) => void;
  tooltipContent: TooltipProps<number, string>['content'];
  chartContainerClassName?: string;
  chartClassName?: string;
  chartStyle?: CSSProperties;
  responsiveStyle?: CSSProperties;
  xAxisTick?: Record<string, unknown>;
  xAxisTickMargin?: number;
  xAxisInterval?: number | 'preserveStartEnd';
  yAxisTick?: Record<string, unknown>;
  yAxisTickFormatter?: (value: number) => string;
  yAxisTickMargin?: number;
  yAxisWidth?: number;
  barSelectedOpacity?: number;
  barUnselectedOpacity?: number;
  maxPrizeSeriesName?: string;
  revenueSeriesName?: string;
  distributedSeriesName?: string;
  distributedLegendLabel?: string;
  revenueLegendLabel?: string;
  legendVariant?: 'minimal' | 'chip';
  showMegaDaViradaMarker?: boolean;
  megaDaViradaYear?: number;
  selectionStrokeOpacity?: number;
}

export const PrizeTimelineChart = (props: PrizeTimelineChartProps) => {
  const {
    data,
    selectedYear,
    visibleSeries,
    onToggleSeries,
    onChartClick,
    tooltipContent,
    chartContainerClassName = 'h-[400px] w-full',
    chartClassName,
    chartStyle,
    responsiveStyle,
    xAxisTick = { fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontWeight: '600' },
    xAxisTickMargin = 12,
    xAxisInterval,
    yAxisTick = { fontSize: 10, fill: CHART_COLORS.TICK_LABEL },
    yAxisTickFormatter,
    yAxisTickMargin,
    yAxisWidth = 70,
    barSelectedOpacity = 0.4,
    barUnselectedOpacity = 0.1,
    maxPrizeSeriesName = 'Maior Prêmio',
    revenueSeriesName = 'Arrecadação',
    distributedSeriesName = 'Distribuído',
    distributedLegendLabel,
    revenueLegendLabel = 'Arrecadação',
    legendVariant = 'chip',
    showMegaDaViradaMarker = false,
    megaDaViradaYear,
    selectionStrokeOpacity = 0.6,
  } = props;

  const distributedLabel = distributedLegendLabel ?? distributedSeriesName;
  const maxPrizeLabel = maxPrizeSeriesName;

  return (
    <>
      <div className={`min-w-0 ${chartContainerClassName}`}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={1}
          style={responsiveStyle}
        >
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 0, bottom: 0, left: -20 }}
            onClick={onChartClick}
            className={chartClassName}
            style={chartStyle}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.GRID_STROKE}
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={xAxisTick}
              axisLine={false}
              tickLine={false}
              tickMargin={xAxisTickMargin}
              interval={xAxisInterval}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={yAxisTick}
              tickFormatter={yAxisTickFormatter}
              axisLine={false}
              tickLine={false}
              tickMargin={yAxisTickMargin}
              width={yAxisWidth}
            />
            <Tooltip content={tooltipContent} cursor={{ fill: CHART_COLORS.CURSOR }} />

            {visibleSeries.totalRevenue && (
              <Bar
                dataKey="totalRevenue"
                name={revenueSeriesName}
                fill={CHART_COLORS.EMERALD}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS.EMERALD}
                    opacity={
                      selectedYear === entry.year ? barSelectedOpacity : barUnselectedOpacity
                    }
                    className="transition-opacity duration-300"
                  />
                ))}
              </Bar>
            )}

            {visibleSeries.totalDistributed && (
              <Line
                type="monotone"
                dataKey="totalDistributed"
                name={distributedSeriesName}
                stroke={CHART_COLORS.BLUE}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: CHART_COLORS.BLUE }}
              />
            )}

            {visibleSeries.maxPrize && (
              <Line
                type="monotone"
                dataKey="maxPrize"
                name={maxPrizeSeriesName}
                stroke={CHART_COLORS.AMBER}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: CHART_COLORS.AMBER }}
              />
            )}

            {showMegaDaViradaMarker && typeof megaDaViradaYear === 'number' ? (
              <ReferenceLine
                x={megaDaViradaYear}
                stroke={CHART_COLORS.VIOLET}
                strokeDasharray="3 3"
                opacity={0.3}
              />
            ) : null}

            {selectedYear != null && (
              <ReferenceLine
                x={selectedYear}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeOpacity={selectionStrokeOpacity}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {legendVariant === 'chip' ? (
        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] sm:text-xs">
          <button
            type="button"
            aria-pressed={visibleSeries.maxPrize}
            onClick={() => onToggleSeries('maxPrize')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              visibleSeries.maxPrize
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-500 font-bold'
                : 'border-transparent text-muted-foreground opacity-50'
            }`}
          >
            <div className="w-3 h-1 rounded-full" style={{ backgroundColor: CHART_COLORS.AMBER }} />
            {maxPrizeLabel}
          </button>
          <button
            type="button"
            aria-pressed={visibleSeries.totalDistributed}
            onClick={() => onToggleSeries('totalDistributed')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              visibleSeries.totalDistributed
                ? 'border-blue-500/30 bg-blue-500/10 text-blue-500 font-bold'
                : 'border-transparent text-muted-foreground opacity-50'
            }`}
          >
            <div
              className="w-3 h-0.5 border-t border-dashed"
              style={{ borderColor: CHART_COLORS.BLUE }}
            />
            {distributedLabel}
          </button>
          <button
            type="button"
            aria-pressed={visibleSeries.totalRevenue}
            onClick={() => onToggleSeries('totalRevenue')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              visibleSeries.totalRevenue
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-bold'
                : 'border-transparent text-muted-foreground opacity-50'
            }`}
          >
            <div className="w-2 h-2 rounded bg-emerald-500/40" />
            {revenueLegendLabel}
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-muted-foreground select-none">
          <button
            type="button"
            aria-pressed={visibleSeries.maxPrize}
            onClick={() => onToggleSeries('maxPrize')}
            className={`flex items-center gap-2 transition-opacity duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${
              visibleSeries.maxPrize
                ? 'opacity-100 hover:opacity-80'
                : 'opacity-40 hover:opacity-60'
            }`}
          >
            <div className="w-4 h-1 rounded-full" style={{ backgroundColor: CHART_COLORS.AMBER }} />
            <span>{maxPrizeLabel}</span>
          </button>
          <button
            type="button"
            aria-pressed={visibleSeries.totalDistributed}
            onClick={() => onToggleSeries('totalDistributed')}
            className={`flex items-center gap-2 transition-opacity duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${
              visibleSeries.totalDistributed
                ? 'opacity-100 hover:opacity-80'
                : 'opacity-40 hover:opacity-60'
            }`}
          >
            <div
              className="w-4 h-0.5 border-t-2 border-dashed"
              style={{ borderColor: CHART_COLORS.BLUE }}
            />
            <span>{distributedLabel}</span>
          </button>
          <button
            type="button"
            aria-pressed={visibleSeries.totalRevenue}
            onClick={() => onToggleSeries('totalRevenue')}
            className={`flex items-center gap-2 transition-opacity duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded ${
              visibleSeries.totalRevenue
                ? 'opacity-100 hover:opacity-80'
                : 'opacity-40 hover:opacity-60'
            }`}
          >
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: CHART_COLORS.EMERALD, opacity: 0.4 }}
            />
            <span>{revenueLegendLabel}</span>
          </button>
        </div>
      )}
    </>
  );
};
