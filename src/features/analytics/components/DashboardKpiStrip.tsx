import { BarChart3, TrendingUp, Users, Trophy } from "lucide-react";
import { KpiCard } from "./KpiCard";

interface DashboardKpiStripProps {
  totalDraws: number;
  pctWithoutWinner: number;
  totalJackpotWinners: number;
  highestPrize: number;
}

export function DashboardKpiStrip({
  totalDraws,
  pctWithoutWinner,
  totalJackpotWinners,
  highestPrize,
}: DashboardKpiStripProps) {
  const kpiCards = [
    {
      label: "Total de sorteios",
      value: totalDraws.toLocaleString("pt-BR") || "0",
      icon: <BarChart3 className="w-4 h-4" />,
      accentClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
      valueClass: "text-[hsl(var(--info))]",
    },
    {
      label: "Sem ganhador (seca)",
      value: `${pctWithoutWinner ?? "--"}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      accentClass: "bg-gradient-to-r from-orange-500 to-amber-400",
      valueClass: "text-hot",
    },
    {
      label: "Total de ganhadores",
      value: totalJackpotWinners.toLocaleString("pt-BR") || "0",
      icon: <Users className="w-4 h-4" />,
      accentClass: "bg-gradient-to-r from-primary to-amber-300",
      valueClass: "text-primary",
    },
    {
      label: "Maior prêmio",
      value: `R$${((highestPrize || 0) / 1_000_000).toLocaleString("pt-BR", {
        maximumFractionDigits: 0,
      })}M`,
      icon: <Trophy className="w-4 h-4" />,
      accentClass: "bg-gradient-to-r from-emerald-500 to-green-400",
      valueClass: "text-success",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
      {kpiCards.map((card, i) => (
        <KpiCard key={card.label} {...card} delay={0.1 + i * 0.07} />
      ))}
    </div>
  );
}
