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

import { primitives } from "@/components/ui";

/** Standard tooltip container style for recharts Tooltip contentStyle prop. */
export const RECHARTS_TOOLTIP_STYLE = {
  backgroundColor: primitives.color.chart.tooltipBg,
  borderColor:     primitives.color.chart.tooltipBorder,
  borderRadius:    "12px",
  border:          "none",
  boxShadow:       "0 20px 25px -5px rgb(0 0 0 / 0.5)",
} as const;

/** Muted label style for recharts Tooltip labelStyle prop. */
export const RECHARTS_LABEL_STYLE = {
  color:        primitives.color.chart.tickLabel,
  marginBottom: "4px",
} as const;

/** Bold label style for charts with prominent section labels. */
export const RECHARTS_LABEL_STYLE_BOLD = {
  color:        primitives.color.chart.tickLabel,
  marginBottom: "8px",
  fontWeight:   "bold",
} as const;

/** Light foreground for recharts LabelList and cell labels. */
export const RECHARTS_LABEL_FOREGROUND = primitives.color.chart.foreground;

/** Cursor overlay for bar charts. */
export const RECHARTS_CURSOR_BAR = { fill: primitives.color.chart.cursorFill } as const;

/** Cursor overlay for line charts. */
const RECHARTS_CURSOR_LINE = { stroke: primitives.color.chart.gridStroke } as const;
