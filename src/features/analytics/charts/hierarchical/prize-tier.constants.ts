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
    label: "Sena",
    emoji: "🥇",
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-500",
    barColor: CHART_COLORS.AMBER,
    rank: 1,
  },
  quina: {
    label: "Quina",
    emoji: "🥈",
    gradient: "from-info/25 via-info/15 to-info/5",
    border: "border-info/30",
    badge: "bg-info/20 text-info",
    barColor: CHART_COLORS.BLUE,
    rank: 2,
  },
  quadra: {
    label: "Quadra",
    emoji: "🥉",
    gradient: "from-success/20 via-success/10 to-success/5",
    border: "border-success/25",
    badge: "bg-success/20 text-success",
    barColor: CHART_COLORS.EMERALD,
    rank: 3,
  },
};
