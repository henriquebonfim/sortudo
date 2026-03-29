import { PiggyBank } from "lucide-react";
import { LotteryStats } from '@/domain/lottery/lottery.types';
import { PrizeDistributionChart, StreakEconomicsChart, RegularVsSpecialChart, TopJackpotWinnersChart, StreakFrequencyChart } from '@/features/analytics-dashboard/charts';
import TrueNetEVChart from '@/features/analytics-dashboard/charts/statistical/TrueNetEVChart';
import JackpotErosionWaterfall from '@/features/analytics-dashboard/charts/economics/JackpotErosionWaterfall';
import { Chapter } from "../types";

export const getEconomicsChapter = (_stats?: LotteryStats | null): Chapter => ({
  id: "economics",
  icon: <PiggyBank className="w-4 h-4" />,
  title: "Economia e Prêmios",
  description: "Análise financeira dos prêmios e arrecadação",
  lineClass: "bg-amber-500/60",
  iconColorClass: "text-amber-400",
  sections: [
    {
      id: "prize-tiers",
      title: "Distribuição por Faixa",
      subtitle: "Hierarquia de prêmios",
      type: "Hierarchical",
      insight: "A sena concentra a maior parte do valor, mas quinas e quadras distribuem volumes significativos para milhares de apostadores.",
      note: "Concentração vs. Capilaridade.",
      className: "md:col-span-2 lg:col-span-1",
      component: <PrizeDistributionChart />,
    },
    {
      id: "economics-streak",
      title: "Impacto do Acúmulo",
      subtitle: "Arrecadação vs. Sequência de acúmulos",
      type: "Statistical",
      insight: "O volume de apostas cresce exponencialmente à medida que o prêmio acumula. Sorteios com 10+ acúmulos arrecadam até 5× mais que sorteios iniciais.",
      note: "Correlação prêmio/volume.",
      className: "md:col-span-1 lg:col-span-1",
      component: <StreakEconomicsChart />,
    },
    {
      id: "streak-frequency",
      title: "Distribuição de Acúmulos",
      subtitle: "Frequência dos Tamanhos de Sequência",
      type: "Informational",
      insight: "Mais de 21% de todos os prêmios são ganhos no primeiro sorteio (Streak 0). Sequências com mais de 10 acúmulos são eventos matematicamente raros.",
      note: "Acúmulos vs Probabilidades.",
      className: "md:col-span-1 lg:col-span-1",
      component: <StreakFrequencyChart />,
    },
    {
      id: "true-ev",
      title: "Valor Esperado (EV) Líquido",
      subtitle: "A ilusão matemática do prêmio gigante",
      type: "Statistical",
      insight: "O valor real do bilhete afunda quando o prêmio passa do ponto de equilíbrio, porque as vendas explodem e o risco de dividir o prêmio zera sua vantagem matemática.",
      note: "Análise de Retorno sobre Investimento.",
      component: <TrueNetEVChart />,
    },
    {
      id: "waterfall",
      title: "A Ilusão de 1 Bilhão",
      subtitle: "Atrição Financeira (Opção Cash + Impostos)",
      type: "Informational",
      insight: "Prêmios bilionários anunciados representam anuidades de 30 anos. A opção Cash subtrai ~50%, e os impostos devoram mais 43% do que sobra. O take-home real é em torno de 30%.",
      note: "Valor Real vs. Valor Anunciado.",
      component: <JackpotErosionWaterfall />,
    },
    {
      id: "regular-vs-special",
      title: "Fenômeno Mega da Virada",
      subtitle: "Comparação de magnitude dos prêmios",
      type: "Comparison",
      insight: "A disparidade de magnitude entre prêmios é de centenas de vezes. O evento especial anualmente redefine os recordes da loteria.",
      note: "Especial vs. Regular.",
      className: "md:col-span-1 lg:col-span-1",
      component: <RegularVsSpecialChart />,
    },
    {
      id: "winner-records",
      title: "Recordes de Ganhadores",
      subtitle: "Top concursos com mais acertos simultâneos",
      type: "List",
      insight: `O recorde histórico é de ${_stats?.topJackpotWinners?.[0]?.winners || 52} ganhadores simultâneos na Sena — o que diluiu drasticamente o prêmio individual naquele concurso.`,
      note: "Ocorre quando números muito populares, sequenciados ou visuais são sorteados.",
      component: <TopJackpotWinnersChart />,
    },
  ],
});
