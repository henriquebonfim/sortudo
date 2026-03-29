import { useMemo, useState } from "react";
import { useLotteryStore } from "@/application/useLotteryStore";
import { RegionSummary } from "./components/RegionSummary";
import { GeoBarChart } from "./components/GeoBarChart";
import { BrazilMap } from "./components/BrazilMap";
import { MapIcon, BarChart3Icon } from "lucide-react";

export default function GeoWinnersChart() {
  const stats = useLotteryStore((state) => state.stats);
  const data = stats?.geoWinners;
  const [view, setView] = useState<"map" | "bar">("bar");

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
      {/* View Switcher */}
      <div className="flex justify-end gap-2 px-1">
        <button
          onClick={() => setView("map")}
          className={`p-1.5 rounded-lg border transition-all ${view === "map" ? "bg-primary/20 text-primary border-primary/30" : "text-muted-foreground border-border/50 hover:bg-muted"}`}
          title="Vista do Mapa"
        >
          <MapIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setView("bar")}
          className={`p-1.5 rounded-lg border transition-all ${view === "bar" ? "bg-primary/20 text-primary border-primary/30" : "text-muted-foreground border-border/50 hover:bg-muted"}`}
          title="Vista de Barras"
        >
          <BarChart3Icon className="w-4 h-4" />
        </button>
      </div>

      <RegionSummary data={chartData} />
      {view === "map" ? (
        <BrazilMap data={data || []} />
      ) : (
        <GeoBarChart data={chartData} />
      )}
    </div>
  );
}
