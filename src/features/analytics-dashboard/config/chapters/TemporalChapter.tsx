import { TrendingUp } from "lucide-react";
import { LotteryStats } from '@/domain/lottery/lottery.types';
import { PrizeEvolutionChart, AccumulationTrendChart, TemporalFrequencyChart, TopNumbersByDecadeChart } from '@/features/analytics-dashboard/charts';
import { Chapter } from "../types";

export const getTemporalChapter = (stats?: LotteryStats | null): Chapter => ({
  id: "time-series",
  icon: <TrendingUp className="w-4 h-4" />,
  title: "Temporalidade",
  description: "Evolução histórica e tendências ao longo do tempo",
  lineClass: "bg-violet-500/60",
  iconColorClass: "text-violet-400",
  sections: [
    {
      id: "prizes",
      title: "Evolução dos Prêmios",
      subtitle: "Série temporal 1996–hoje",
      type: "Timeline",
      insight: "A média dos prêmios da Mega da Virada (~R$ 286M) é quase 9× maior que os sorteios regulares (~R$ 32M). Os picos correspondem a sequências longas de acúmulo.",
      note: "Prêmios acumulados e sorteios especiais criam picos incomparáveis.",
      className: "md:col-span-2 lg:col-span-2",
      component: <PrizeEvolutionChart />,
    },
    {
      id: "accumulation",
      title: "Tendência de Acúmulo",
      subtitle: "Rollover por ano",
      type: "Timeline",
      insight: `Quase ${stats?.meta?.pctWithoutWinner || 79}% de todos os sorteios terminam acumulados. A maior seca registrou 28 concursos seguidos sem ganhador.`,
      note: "A cada sorteio acumulado a chance matemática continua a mesma — 1 em ~50 milhões.",
      component: <AccumulationTrendChart />,
    },
    {
      id: "temporal",
      title: "Estabilidade por Décadas",
      subtitle: "Comportamento histórico imutável",
      type: "Timeline",
      insight: "As frequências se mantêm totalmente estáveis ao longo das décadas — evidência de entropia robusta e ausência de viés mecânico.",
      note: "Não há evidência de viés crescente nos sorteios desde 1996.",
      component: <TemporalFrequencyChart />,
    },
    {
      id: "temporal-decade-bar",
      title: "Frequência de Números por Década",
      subtitle: "Como os top 10 números performaram ao longo das décadas",
      type: "Comparison",
      insight: "O gráfico de barras empilhadas mostra a constância da frequência dezena a dezena em cada década.",
      note: "Agrupado e ordenado pelo volume total histórico.",
      className: "md:col-span-2 lg:col-span-2",
      component: <TopNumbersByDecadeChart />,
    },
  ],
});
