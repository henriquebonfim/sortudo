import { Hash } from "lucide-react";
import { LotteryStats } from '@/domain/lottery/lottery.types';
import { BubbleChart, FrequencyBarChart, GapAnalysisChart, HotColdNumbersChart, RecentHotNumbersChart, NumberProfileChart } from '@/features/analytics-dashboard/charts';
import { Chapter } from "../types";

export const getNumbersChapter = (stats?: LotteryStats | null): Chapter => ({
  id: "numbers",
  icon: <Hash className="w-4 h-4" />,
  title: "Números",
  description: "Frequência, temperatura e DNA das dezenas",
  lineClass: "bg-blue-500/60",
  iconColorClass: "text-blue-400",
  sections: [
    {
      id: "frequency",
      title: "Frequência",
      subtitle: "Quais números saem mais",
      type: "Statistical",
      insight: `O número ${stats?.frequencies?.max?.number || 10} lidera (${stats?.frequencies?.max?.frequency || 352} sorteios), mas a dispersão é baixa. Cada bola tem ~1.6% de chance teórica por sorteio.`,
      note: "Frequência coincide com a expectativa estatística de longo prazo.",
      className: "md:col-span-2 lg:col-span-2 row-span-2",
      component: (
        <div className="space-y-6">
          <BubbleChart />
          <FrequencyBarChart stats={stats} />
        </div>
      ),
    },
    {
      id: "gap-analysis",
      title: "Números Atrasados",
      subtitle: "Pressão de ausência por dezena",
      type: "List",
      insight: "Os números com maior proporção entre 'atraso atual / atraso recorde' estão sob máxima pressão estatística. Cada sorteio é independente, mas a ausência prolongada é matematicamente incomum.",
      note: "Cor vermelha = atraso atual supera 60% do recorde histórico — o valor mais incomum registrado.",
      className: "md:col-span-2 lg:col-span-2",
      component: <GapAnalysisChart />,
    },
    {
      id: "hot-cold",
      title: "Termômetro",
      subtitle: "Temperatura dos últimos 10 sorteios",
      type: "Statistical",
      insight: "A grade completa dos 60 números colorida por frequência nos últimos 10 concursos revela clusters temporais reais, mesmo que cada sorteio seja matematicamente independente.",
      note: "Vermelho = apareceu 4+ vezes. Azul = ausente nos últimos 10 sorteios.",
      component: <HotColdNumbersChart />,
    },
    {
      id: "recent-hot",
      title: "Números Quentes (Top 10)",
      subtitle: "Números que aparecem com mais frequência nos sorteios recentes",
      type: "List",
      insight: "Apresenta os números mais quentes filtrados puramente pelos últimos 10 concursos.",
      note: "Visualização rápida em lista.",
      component: <RecentHotNumbersChart />,
    },
    {
      id: "draw-dna",
      title: "DNA do Sorteio",
      subtitle: "Perfil estatístico das combinações",
      type: "Informational",
      insight: "A distribuição baixo/alto é quase perfeita (49.5% / 50.5%). Números primos representam ~29% — próximo da proporção de primos no universo 1-60 (30%).",
      note: "Apenas ~3% dos sorteios cobrem 6 dezenas diferentes. Em ~30% dos concursos há 3+ bolas na mesma dezena.",
      className: "md:col-span-1 lg:col-span-1 row-span-2",
      component: <NumberProfileChart />,
    },
  ],
});
