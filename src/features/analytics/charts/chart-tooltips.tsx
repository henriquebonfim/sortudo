/**
 * Shared Recharts Custom Tooltip Components — Analytics Dashboard
 *
 * These are typed using `TooltipContentProps` and exported as render functions
 * to be used as: `content={(props) => <PieSliceTooltip {...props} />}`
 * — OR — passed directly as JSX elements: `content={<PieSliceTooltip />}`
 * (recharts accepts both patterns; TypeScript prefers the render function form).
 *
 * For constant chart styles (contentStyle, labelStyle, etc.), see chart-styles.ts.
 */

import { memo } from "react";
import type { TooltipContentProps } from "recharts";

// ─── Pie Chart Tooltip ────────────────────────────────────────────────────────

/**
 * Compact pie-slice tooltip.
 * Expects chart data entries shaped as: `{ name: string; value: number; color: string }`.
 *
 * Replaces the identical `CustomTooltip` previously duplicated across:
 *   - ClusteringChart, LowHighChart, MathCompositionChart, ConsecutiveOverlapChart
 *
 * Usage: `content={(props) => <PieSliceTooltip {...props} />}`
 */
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

// ─── Streak Bar Tooltip ──────────────────────────────────────────────────────

interface StreakEntry {
  streak: number;
  count: number;
}

/**
 * Bar chart tooltip for StreakFrequencyChart.
 * Usage: `content={(props) => <StreakTooltip {...props} />}`
 */
export const StreakTooltip = memo(function StreakTooltip({
  active,
  payload,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as StreakEntry;

  return (
    <div className="glass-card border border-border p-3 text-xs font-mono space-y-1">
      <p className="text-foreground font-bold text-sm mb-1.5">
        Sequência de {data.streak} acúmulo{data.streak !== 1 ? "s" : ""}
      </p>
      <p className="text-muted-foreground">
        Ocorrências:{" "}
        <span className="text-info font-semibold">{data.count} sorteios</span>
      </p>
    </div>
  );
});

// ─── Overlap Bar Tooltip ─────────────────────────────────────────────────────

interface OverlapEntry {
  label: string;
  value: number;
}

/**
 * Bar chart tooltip for OverlapChart.
 * Usage: `content={(props) => <OverlapBarTooltip {...props} />}`
 */
export const OverlapBarTooltip = memo(function OverlapBarTooltip({
  active,
  payload,
}: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload as OverlapEntry;

  return (
    <div className="glass-card border border-primary/20 p-2 text-xs font-mono">
      <p className="text-foreground">
        {data.label} repetições: <strong>{data.value}%</strong>
      </p>
    </div>
  );
});
/**
 * Generic currency tooltip for charts like PrizeEvolutionChart.
 * Expects formatted label and colored payload items.
 *
 * Usage: `content={(props) => <CurrencyTooltip {...props} formatter={formatCompactCurrency} />}`
 */
export const CurrencyTooltip = memo(function CurrencyTooltip({
  active,
  payload,
  label,
  formatter = (v: number) => `R$${v.toLocaleString()}`,
}: TooltipContentProps<number, string> & { formatter?: (v: number) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card border border-border p-3 text-[11px] font-mono space-y-1.5 shadow-xl">
      <p className="text-foreground font-bold border-b border-border/50 pb-1.5 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
          </div>
          <span className="font-bold whitespace-nowrap" style={{ color: p.color }}>
            {formatter(p.value as number)}
          </span>
        </div>
      ))}
    </div>
  );
});
