import { PieSliceTooltip } from '@/features/analytics/components/charts/shared/PieSliceTooltip';
import type { CSSProperties, ReactNode } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PieSummaryDatum {
  name: string;
  value: number;
  color: string;
}

interface PieSummaryChartProps {
  chartData: PieSummaryDatum[];
  title?: string;
  titleClassName?: string;
  subtitle?: string;
  centerContent?: ReactNode;
  innerRadius?: number | string;
  outerRadius?: number | string;
  legendWrapperStyle?: CSSProperties;
  showLegend?: boolean;
}

const DEFAULT_LEGEND_STYLE: CSSProperties = { fontSize: '10px', bottom: '-10px' };

export const PieSummaryChart = (props: PieSummaryChartProps) => {
  const {
    chartData,
    title,
    titleClassName = 'text-sm font-semibold mb-1 text-foreground w-full text-center',
    subtitle,
    centerContent,
    innerRadius = '58%',
    outerRadius = '80%',
    legendWrapperStyle = DEFAULT_LEGEND_STYLE,
    showLegend = true,
  } = props;

  return (
    <div className="w-full min-w-0 p-4 flex flex-col items-center">
      {title ? <h4 className={titleClassName}>{title}</h4> : null}

      {subtitle ? (
        <p className="text-[10px] text-muted-foreground mb-4 text-center">{subtitle}</p>
      ) : null}

      <div className="relative w-full min-w-0 h-48">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={(props) => <PieSliceTooltip {...props} />} />
            {showLegend ? <Legend wrapperStyle={legendWrapperStyle} /> : null}
          </PieChart>
        </ResponsiveContainer>

        {centerContent ? (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            {centerContent}
          </div>
        ) : null}
      </div>
    </div>
  );
};
