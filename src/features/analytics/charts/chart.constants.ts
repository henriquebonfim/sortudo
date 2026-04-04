import { primitives } from "@/components/ui";

/**
 * Chart color palette for recharts/canvas contexts.
 * All values sourced from primitives.color.chart to stay in sync with the design system.
 *
 * ⚠️ Use CSS variables (hsl(var(--primary)) etc.) in HTML/JSX contexts.
 * Use these constants ONLY in recharts prop objects where CSS vars are unsupported.
 */
export const CHART_COLORS = {
  AMBER:       primitives.color.chart.amber,       // = hsl(var(--primary))
  BLUE:        primitives.color.chart.blue,        // = hsl(var(--cold))
  GREEN:       primitives.color.chart.green,       // Tailwind green-500, used in ball gradient
  EMERALD:     primitives.color.chart.emerald,     // = hsl(var(--success))
  SLATE:       primitives.color.chart.slate,       // ≈ hsl(var(--muted-foreground))
  RED:         primitives.color.chart.red,         // = hsl(var(--hot))
  VIOLET:      primitives.color.chart.violet,      // chart-only, no CSS var equivalent
  PRIMARY:     "hsl(var(--primary))",
  MUTED:       "hsl(var(--muted))",
  TICK_LABEL:  primitives.color.chart.tickLabel,   // same as SLATE — use either
  GRID_STROKE: primitives.color.chart.gridStroke,
  CURSOR:      primitives.color.chart.cursorFill,
} as const;

type ChartColorKey = keyof typeof CHART_COLORS;

export const CHART_DIMENSIONS = {
  DEFAULT_HEIGHT: 320,
  SMALL_HEIGHT:   240,
  MARGIN: { top: 16, right: 16, bottom: 4, left: 0 },
} as const;

