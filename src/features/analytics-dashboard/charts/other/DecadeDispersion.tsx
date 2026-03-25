import { memo } from "react";
import { CHART_COLORS } from "@/components/lottery/chart.constants";

export const DecadeDispersion = memo(function DecadeDispersion({
  fullySpreadPct,
  clusteredPct,
}: {
  fullySpreadPct: number;
  clusteredPct: number;
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-muted-foreground mb-3 font-medium">
        Dispersão por Dezena
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`text-center p-3 rounded-lg border`}
          style={{
            backgroundColor: `${CHART_COLORS.EMERALD}1a`,
            borderColor: `${CHART_COLORS.EMERALD}33`,
          }}
        >
          <span
            className="font-mono font-bold text-lg"
            style={{ color: CHART_COLORS.EMERALD }}
          >
            {fullySpreadPct}%
          </span>
          <p className="text-[10px] text-muted-foreground mt-1">
            6 dezenas diferentes
          </p>
        </div>
        <div
          className={`text-center p-3 rounded-lg border`}
          style={{
            backgroundColor: `${CHART_COLORS.RED}1a`,
            borderColor: `${CHART_COLORS.RED}33`,
          }}
        >
          <span
            className="font-mono font-bold text-lg"
            style={{ color: CHART_COLORS.RED }}
          >
            {clusteredPct}%
          </span>
          <p className="text-[10px] text-muted-foreground mt-1">
            3+ na mesma dezena
          </p>
        </div>
      </div>
    </div>
  );
});
