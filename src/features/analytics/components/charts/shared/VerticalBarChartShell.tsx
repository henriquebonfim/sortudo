import { CHART_COLORS } from '@/shared/styles/chart-colors';
import type { ReactNode } from 'react';
import type { TooltipProps } from 'recharts';
import { BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface VerticalBarChartShellProps {
  data: Array<Record<string, unknown>>;
  height: number;
  margin?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  xAxisTick?: Record<string, unknown>;
  xAxisDomain?: [number | string, number | string];
  xAxisAxisLine?: boolean;
  xAxisTickLine?: boolean;
  yAxisDataKey: string;
  yAxisWidth?: number;
  yAxisTick?: Record<string, unknown>;
  yAxisTickFormatter?: (value: number | string) => string;
  yAxisAxisLine?: boolean;
  yAxisTickLine?: boolean;
  gridHorizontal?: boolean;
  gridVertical?: boolean;
  gridStroke?: string;
  tooltipContent?: TooltipProps<number, string>['content'];
  tooltipCursor?: TooltipProps<number, string>['cursor'];
  children: ReactNode;
}

export const VerticalBarChartShell = (props: VerticalBarChartShellProps) => {
  const {
    data,
    height,
    margin,
    xAxisTick,
    xAxisDomain,
    xAxisAxisLine,
    xAxisTickLine,
    yAxisDataKey,
    yAxisWidth,
    yAxisTick,
    yAxisTickFormatter,
    yAxisAxisLine,
    yAxisTickLine,
    gridHorizontal = false,
    gridVertical = false,
    gridStroke = CHART_COLORS.GRID_STROKE,
    tooltipContent,
    tooltipCursor,
    children,
  } = props;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={margin}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={gridStroke}
          horizontal={gridHorizontal}
          vertical={gridVertical}
        />
        <XAxis
          type="number"
          tick={xAxisTick}
          domain={xAxisDomain}
          axisLine={xAxisAxisLine}
          tickLine={xAxisTickLine}
        />
        <YAxis
          dataKey={yAxisDataKey}
          type="category"
          tick={yAxisTick}
          width={yAxisWidth}
          tickFormatter={yAxisTickFormatter}
          axisLine={yAxisAxisLine}
          tickLine={yAxisTickLine}
        />
        {tooltipContent ? <Tooltip content={tooltipContent} cursor={tooltipCursor} /> : null}
        {children}
      </BarChart>
    </ResponsiveContainer>
  );
};
