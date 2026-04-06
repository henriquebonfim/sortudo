/**
 * Shared Chart Style Constants — Analytics Dashboard
 *
 * All values reference primitives.color.chart so they stay in sync
 * with the design system token layer.
 *
 * ✅ Use these in recharts prop objects (contentStyle, labelStyle, etc.)
 * ❌ Do NOT duplicate inline per chart
 *
 * For shared tooltip JSX components, see chart-tooltips.tsx.
 */

import { CHART_COLORS } from '@/shared/constants/chart-colors';

/** Standard tooltip container style for recharts Tooltip contentStyle prop. */
export const RECHARTS_TOOLTIP_STYLE = {
  backgroundColor: CHART_COLORS.TOOLTIP_BG,
  borderColor: CHART_COLORS.TOOLTIP_BORDER,
  borderRadius: '12px',
  border: 'none',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
} as const;

/** Muted label style for recharts Tooltip labelStyle prop. */
export const RECHARTS_LABEL_STYLE = {
  color: CHART_COLORS.TICK_LABEL,
  marginBottom: '4px',
} as const;

/** Bold label style for charts with prominent section labels. */
export const RECHARTS_LABEL_STYLE_BOLD = {
  color: CHART_COLORS.TICK_LABEL,
  marginBottom: '8px',
  fontWeight: 'bold',
} as const;

/** Light foreground for recharts LabelList and cell labels. */
export const RECHARTS_LABEL_FOREGROUND = CHART_COLORS.FOREGROUND;

/** Cursor overlay for bar charts. */
export const RECHARTS_CURSOR_BAR = { fill: CHART_COLORS.CURSOR } as const;

/** Cursor overlay for line charts. */
export const RECHARTS_CURSOR_LINE = { stroke: CHART_COLORS.GRID_STROKE } as const;
