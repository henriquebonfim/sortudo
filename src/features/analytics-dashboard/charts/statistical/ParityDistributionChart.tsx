import { useMemo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { ParityBar, ParityData } from "./components/ParityBar";
import { Legend } from "./components/Legend";

export default function ParityDistributionChart() {
  const stats = useLotteryStore((state) => state.stats);
  const raw = stats?.parityDistribution;

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

  if (!stats || !raw) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const top = data[0];
  const maxPct = top?.pct ?? 1;

  return (
    <div className="space-y-4">
      {/* KPI callout */}
      {top && (
        <div
          className="flex items-center gap-3 p-3 rounded-xl border"
          style={{
            backgroundColor: `${CHART_COLORS.AMBER}1a`,
            borderColor: `${CHART_COLORS.AMBER}33`,
          }}
        >
          <span
            className="text-2xl font-display font-bold"
            style={{ color: CHART_COLORS.AMBER }}
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
