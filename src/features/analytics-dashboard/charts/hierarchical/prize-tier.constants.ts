import { CHART_COLORS } from "@/components/lottery/chart.constants";

export interface TierConfig {
  label: string;
  emoji: string;
  gradient: string;
  border: string;
  badge: string;
  barColor: string;
  rank: number;
}

export const TIER_CONFIG: Record<string, TierConfig> = {
  sena: {
    label: "6 Acertos (Sena)",
    emoji: "🥇",
    gradient: "from-amber-500/30 via-yellow-500/20 to-amber-600/10",
    border: "border-amber-500/40",
    badge: "bg-amber-500/20 text-amber-300",
    barColor: CHART_COLORS.AMBER,
    rank: 1,
  },
  quina: {
    label: "5 Acertos (Quina)",
    emoji: "🥈",
    gradient: "from-blue-500/25 via-blue-400/15 to-blue-600/5",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-300",
    barColor: CHART_COLORS.BLUE,
    rank: 2,
  },
  quadra: {
    label: "4 Acertos (Quadra)",
    emoji: "🥉",
    gradient: "from-emerald-500/20 via-emerald-400/10 to-emerald-600/5",
    border: "border-emerald-500/25",
    badge: "bg-emerald-500/20 text-emerald-300",
    barColor: CHART_COLORS.EMERALD,
    rank: 3,
  },
};
