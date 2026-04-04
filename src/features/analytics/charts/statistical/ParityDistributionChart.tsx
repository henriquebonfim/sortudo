import { useMemo } from "react";
import { useParityDistribution, useLotteryMeta } from "@/application/selectors";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { ParityBar, ParityData } from "./components/ParityBar";
import { Legend } from "./components/Legend";

export function ParityDistributionChart() {
  const meta = useLotteryMeta();
  const raw = useParityDistribution();

  const data = useMemo(() => {
    if (!raw) return [];
    const total = raw.reduce((s, d) => s + d.count, 0) || 1;
    return raw
      .map((d, index) => ({
        ...d,
        pct: (d.count / total) * 100,
        originalIndex: index,
      }))
      .sort((a, b) => b.pct - a.pct);
  }, [raw]);

  if (!meta || !raw) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const top = data[0];
  const maxPct = top?.pct ?? 1;

  return (
    <div className="space-y-4">
      {/* KPI callout */}
      {top && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/10"
        >
          <span
            className="text-2xl font-display font-bold text-primary"
          >
            {top.label}
          </span>
          <span className="text-sm text-muted-foreground">
            combinação mais comum —{" "}
            <strong className="text-foreground">{top.pct.toFixed(1)}%</strong>{" "}
            dos sorteios
          </span>
        </div>
      )}

      {/* Ranked horizontal bars */}
      <div className="space-y-2">
        {data.map((d, i) => (
          <ParityBar
            key={d.label}
            data={d}
            maxPct={maxPct}
            totalItems={raw.length}
            index={i}
          />
        ))}
      </div>

      <Legend />
    </div>
  );
}
