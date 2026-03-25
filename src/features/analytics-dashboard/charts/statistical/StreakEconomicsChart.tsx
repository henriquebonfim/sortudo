import { useState, useMemo, memo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import { ChartLegend } from "../other/ChartLegend";
import { StreakChartTab, StreakEntry } from "../other/StreakChartTab";
import { StreakTableTab } from "../other/StreakTableTab";

const VIEW_OPTIONS = [
  { id: "chart" as const, label: "Gráfico" },
  { id: "table" as const, label: "Tabela" },
];

export default function StreakEconomicsChart() {
  const stats = useLotteryStore((state) => state.stats);
  const [view, setView] = useState<"chart" | "table">("chart");

  const rawData = stats?.streakEconomics;

  const filteredData = useMemo(() => {
    if (!rawData) return [];
    return rawData.filter((d) => d.drawsCount >= 2 && d.streakLength <= 20);
  }, [rawData]);

  if (!rawData || rawData.length === 0) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {VIEW_OPTIONS.map((f) => (
          <button
            key={f.id}
            onClick={() => setView(f.id)}
            className={`pill-btn ${view === f.id ? "pill-btn-active" : "pill-btn-inactive"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {view === "chart" ? (
        <StreakChartTab data={filteredData} />
      ) : (
        <StreakTableTab data={rawData} />
      )}

      <ChartLegend />
    </div>
  );
}
