export { ChartTooltip } from '@/features/analytics/components/charts/shared/ChartTooltip';

import { memo } from 'react';
import type { TooltipContentProps } from 'recharts';

export const PieSliceTooltip = memo(function PieSliceTooltip({
  active,
  payload,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const color = (payload[0].payload as { color?: string } | undefined)?.color;

  return (
    <div className="glass-card border border-border p-2 text-xs font-mono">
      <p className="text-foreground">
        {name}: <strong style={color ? { color } : undefined}>{value}%</strong>
      </p>
    </div>
  );
});
