import { CHART_COLORS } from "@/features/analytics/charts/chart.constants";

export type FilterMode = "top10" | "bottom10" | "all";

const COLORS = {
  GOLD: CHART_COLORS.AMBER,
  HOT: CHART_COLORS.RED,
  COLD: CHART_COLORS.BLUE,
};

export const FILTER_OPTIONS: { id: FilterMode; label: string }[] = [
  { id: "top10", label: "Top 10 mais sorteados" },
  { id: "bottom10", label: "Top 10 menos sorteados" },
  { id: "all", label: "Todos os 60" },
];

export const LEGEND_ITEMS = [
  { color: COLORS.HOT, label: "Mais sorteados" },
  { color: COLORS.GOLD, label: "Intermediários" },
  { color: COLORS.COLD, label: "Menos sorteados" },
];

export function getColor(position: number, total: number): string {
  const t = 1 - (position - 1) / (total - 1 || 1);
  if (t > 0.7) return COLORS.HOT;
  if (t > 0.3) return COLORS.GOLD;
  return COLORS.COLD;
}
