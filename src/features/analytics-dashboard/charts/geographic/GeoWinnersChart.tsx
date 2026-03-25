import { useMemo } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import { RegionSummary } from "./components/RegionSummary";
import { GeoBarChart } from "./components/GeoBarChart";

export default function GeoWinnersChart() {
  const stats = useLotteryStore((state) => state.stats);
  const data = stats?.geoWinners;

  const chartData = useMemo(() => {
    return (data || []).slice(0, 15);
  }, [data]);

  if (!stats) return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;

  if (chartData.length === 0) {
    return (
      <div className="glass-card p-4 text-center space-y-2">
        <p className="text-muted-foreground text-sm">
          Dados geográficos não disponíveis. Certifique-se que a coluna{" "}
          <code className="text-primary">Cidade / UF</code> está presente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RegionSummary data={chartData} />
      <GeoBarChart data={chartData} />
    </div>
  );
}
