import { memo } from "react";
import { CHART_COLORS } from "@/domain/lottery/lottery.constants";

export const ChartLegend = memo(function ChartLegend() {
  return (
    <div className="flex gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: CHART_COLORS.EMERALD }}
        />
        Arrecadação média
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: CHART_COLORS.AMBER }}
        />
        Prêmio médio (quando sai)
      </div>
    </div>
  );
});
