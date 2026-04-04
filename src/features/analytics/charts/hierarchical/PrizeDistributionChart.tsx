import { usePrizeTierComparison, useLotteryMeta } from "@/application/selectors";
import { ListIcon, PyramidIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { PrizePyramid } from "./components/PrizePyramid";
import { TierCard, TierData } from "./components/TierCard";
import { TIER_CONFIG } from "./prize-tier.constants";

export function PrizeDistributionChart() {
  const meta = useLotteryMeta();
  const rawData = usePrizeTierComparison();
  const [view, setView] = useState<"pyramid" | "list">("pyramid");

  const { maxAvg, ratio, sorted } = useMemo(() => {
    if (!rawData) return { maxAvg: 0, ratio: "—", sorted: [] };

    const maxA = rawData.reduce((m, d) => Math.max(m, d.avgPrize), 0);
    const sena = rawData.find((d) => d.tier === "sena");
    const quina = rawData.find((d) => d.tier === "quina");
    const rat = sena && quina && quina.avgPrize > 0
      ? (sena.avgPrize / quina.avgPrize).toFixed(0)
      : "—";

    const sort = ["sena", "quina", "quadra"]
      .map((t) => rawData.find((d) => d.tier === t))
      .filter((d): d is TierData => !!d);

    return { maxAvg: maxA, ratio: rat, sorted: sort };
  }, [rawData]);

  if (!meta || !rawData) {
    return <div className="h-48 animate-pulse bg-muted/20 rounded-xl" />;
  }

  const hasRatio = ratio !== "—";

  return (
    <div className="space-y-4">
      {/* View Switcher */}
      <div className="flex justify-end gap-2 px-1">
        <button
          onClick={() => setView("pyramid")}
          className={`p-1.5 rounded-lg border transition-all ${view === "pyramid" ? "bg-primary/20 text-primary border-primary/30" : "text-muted-foreground border-border hover:bg-muted"}`}
          title="Visão Pirâmide"
        >
          <PyramidIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setView("list")}
          className={`p-1.5 rounded-lg border transition-all ${view === "list" ? "bg-primary/20 text-primary border-primary/30" : "text-muted-foreground border-border hover:bg-muted"}`}
          title="Visão Lista"
        >
          <ListIcon className="w-4 h-4" />
        </button>
      </div>

      {hasRatio && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-2xl font-display font-bold text-amber-400">
            {ratio}×
          </span>
          <span className="text-sm text-muted-foreground">
            O prêmio da Sena é em média{" "}
            <strong className="text-foreground">{ratio}× maior</strong> que o
            da Quina
          </span>
        </div>
      )}

      {view === "pyramid" ? (
        <PrizePyramid sortedData={sorted} />
      ) : (
        <div className="space-y-3">
          {sorted.map((data, index) => {
            const config = TIER_CONFIG[data.tier];
            if (!config) return null;
            return (
              <TierCard
                key={data.tier}
                data={data}
                config={config}
                maxAvg={maxAvg}
                index={index}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
