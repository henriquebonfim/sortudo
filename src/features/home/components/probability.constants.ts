import { formatNumber } from "@/lib/formatters";
import { PROB_QUADRA, PROB_QUINA, TOTAL_COMBINATIONS } from "@/domain/lottery/lottery.constants";

export const probData = [
  {
    name: "Sena (6/6)",
    odds: TOTAL_COMBINATIONS,
    label: `1 em ${formatNumber(TOTAL_COMBINATIONS)}`,
    color: "hsl(0 84% 60%)",
  },
  {
    name: "Quina (5/6)",
    odds: Math.round(1 / PROB_QUINA),
    label: `1 em ${formatNumber(Math.round(1 / PROB_QUINA))}`,
    color: "hsl(38 92% 50%)",
  },
  {
    name: "Quadra (4/6)",
    odds: Math.round(1 / PROB_QUADRA),
    label: `1 em ${formatNumber(Math.round(1 / PROB_QUADRA))}`,
    color: "hsl(142 71% 45%)",
  },
];
