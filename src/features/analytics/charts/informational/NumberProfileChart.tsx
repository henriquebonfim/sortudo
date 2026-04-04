import { memo, useMemo } from "react";
import { useNumberProfile, useLotteryMeta } from "@/application/selectors";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { StatRing } from "./components/StatRing";
import { LowHighDistribution } from "./components/LowHighDistribution";
import { OverlapChart } from "./components/OverlapChart";
import { DecadeDispersion } from "./components/DecadeDispersion";

export function NumberProfileChart() {
  const meta = useLotteryMeta();
  const data = useNumberProfile();

  const overlapData = useMemo(() => {
    if (!data) return [];
    return [
      { label: "0", value: data.drawOverlaps.zero, color: CHART_COLORS.BLUE },
      { label: "1", value: data.drawOverlaps.one, color: CHART_COLORS.AMBER },
      { label: "2", value: data.drawOverlaps.two, color: CHART_COLORS.RED },
      { label: "3+", value: data.drawOverlaps.threePlus, color: CHART_COLORS.VIOLET },
    ];
  }, [data]);

  if (!meta || !data) return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;

  return (
    <div className="space-y-5">
      <LowHighDistribution
        low={data.lowHighSplit.low}
        high={data.lowHighSplit.high}
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-3">
          <StatRing
            value={data.primesPercentage}
            label="Primos"
            color={CHART_COLORS.VIOLET}
          />
        </div>
        <div className="glass-card p-3">
          <StatRing
            value={data.multiplesOf5Percentage}
            label="Múlt. de 5"
            color={CHART_COLORS.EMERALD}
          />
        </div>
        <div className="glass-card p-3">
          <StatRing
            value={data.multiplesOf10Percentage}
            label="Múlt. de 10"
            color={CHART_COLORS.AMBER}
          />
        </div>
      </div>

      <OverlapChart data={overlapData} />

      <DecadeDispersion
        fullySpreadPct={data.decadeAnalysis.fullySpreadPct}
        clusteredPct={data.decadeAnalysis.clusteredPct}
      />
    </div>
  );
}
