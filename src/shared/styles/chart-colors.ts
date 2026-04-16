/**
 * Chart color palette for recharts/canvas contexts.
 * These are hex/rgba values because Recharts props do not support CSS variables.
 */
export const CHART_COLORS = {
  AMBER: '#F59E0B', // = hsl(var(--primary))
  BLUE: '#3B82F6', // = hsl(var(--cold))
  GREEN: '#22C55E', // Tailwind green-500, used in ball gradient
  EMERALD: '#10B981', // = hsl(var(--success))
  SLATE: '#94A3B8', // ≈ hsl(var(--muted-foreground))
  RED: '#EF4444', // = hsl(var(--hot))
  VIOLET: '#8B5CF6', // chart-only, no CSS var equivalent
  PRIMARY: 'hsl(var(--primary))',
  MUTED: 'hsl(var(--muted))',
  TICK_LABEL: '#94A3B8',
  GRID_STROKE: 'rgba(255,255,255,0.05)',
  CURSOR: 'rgba(255,255,255,0.03)',
  TOOLTIP_BG: '#1E293B',
  TOOLTIP_BORDER: '#334155',
  FOREGROUND: '#E2E8F0',
} as const;
