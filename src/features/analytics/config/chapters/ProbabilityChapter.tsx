import { LotteryStats } from '@/domain/lottery/draw';
import {
  ClusteringChart,
  ConsecutiveOverlapChart, LowHighChart,
  MathCompositionChart, PairCooccurrenceChart, ParityDistributionChart, SumBellCurveChart
} from '@/features/analytics/charts';
import { SelectionBiasHeatmap } from '@/features/analytics/charts/informational/SelectionBiasHeatmap';
import { LifetimesToWinChart } from '@/features/analytics/charts/simulator/LifetimesToWinChart';
import { LLNConvergenceChart } from '@/features/analytics/charts/statistical/LLNConvergenceChart';
import { PoissonSplittingChart } from '@/features/analytics/charts/statistical/PoissonSplittingChart';
import { PieChart } from "lucide-react";
import { Chapter } from "../types";

export const getProbabilityChapter = (_stats?: LotteryStats | null): Chapter => ({
  id: "probability",
  icon: <PieChart className="w-4 h-4" />,
  title: "Probabilidade",
  description: "Distribuições e padrões matemáticos das combinações",
  lineClass: "bg-cyan-500/60",
  iconColorClass: "text-cyan-400",
  sections: [
    {
      id: "parity",
      title: "Paridade",
      subtitle: "Distribuição Par / Ímpar",
      type: "Statistical",
      insight: "Combinações 3+3 são as mais prováveis (31%), seguidas pelos formatos 4/2 e 2/4. Juntas formam ~79% de todos os concursos.",
      note: "Isso respeita rigorosamente a distribuição binomial estatística esperada.",
      component: <ParityDistributionChart />,
    },
    {
      id: "sum",
      title: "Soma Gaussiana",
      subtitle: "Curva de Bell dos resultados",
      type: "Statistical",
      insight: "A média histórica da soma das 6 dezenas é 183.15, variando entre 66 e 331. A distribuição segue perfeita curva normal.",
      note: "Extremos (somas perto de 21 ou de 345) são os eventos mais raros.",
      component: <SumBellCurveChart />,
    },
    {
      id: "low-high",
      title: "Distribuição: Baixas vs Altas",
      subtitle: "Números de 1-30 vs 31-60",
      type: "Informational",
      insight: "Apesar das crenças supersticiosas, 49.51% dos números sorteados são baixos e 50.49% são altos, revelando um equilíbrio quase perfeito a longo prazo.",
      note: "Bolas (1-30) vs Bolas (31-60).",
      component: <LowHighChart />,
    },
    {
      id: "math-composition",
      title: "Composição Matemática",
      subtitle: "Primos, Múltiplos e Padrões",
      type: "Informational",
      insight: "Aproximadamente 28% das bolas sorteadas são números primos, enquanto 20% são múltiplos de 5. Isso mostra a diversidade matemática esperada.",
      note: "DNA dos sorteios.",
      component: <MathCompositionChart />,
    },
    {
      id: "clustering",
      title: "Agrupamento de Dezenas",
      subtitle: "Distribuição entre as linhas",
      type: "Informational",
      insight: "Menos de 3% dos sorteios têm números primorosamente espalhados por todas as linhas (ex. 1 a 10, 11 a 20...). A maioria agrupam-se naturalmente.",
      note: "Comportamento aglomerado vs espalhado.",
      component: <ClusteringChart />,
    },
    {
      id: "overlap",
      title: "Independência Consecutiva",
      subtitle: "Repetições entre sorteios adjacentes",
      type: "Informational",
      insight: "Mais de 52% dos sorteios não repetem nenhum número do concurso imediatamente anterior. A independência entre os eventos é soberana.",
      note: "Falácia da Mão Quente.",
      component: <ConsecutiveOverlapChart />,
    },
    {
      id: "pairs",
      title: "Sequências e Co-ocorrências",
      subtitle: "Dezenas consecutivas e pares frequentes",
      type: "Informational",
      insight: "Em 42% dos sorteios ocorre pelo menos um par de dezenas consecutivas. A probabilidade de trio consecutivo cai para apenas 3.2%.",
      note: "Os pares mais frequentes históricos aparecem em ~1.4% dos sorteios.",
      component: <PairCooccurrenceChart />,
    },
    {
      id: "lln-convergence",
      title: "Lei dos Grandes Números",
      subtitle: "Falácia do Apostador vs Realidade Estatística",
      type: "Statistical",
      insight: "A longo prazo, a aleatoriedade é matematicamente perfeita. A percepção de que um número está 'atrasado' ou 'quente' é apenas ruído no curto prazo.",
      note: "Convergência para probabilidade uniforme.",
      className: "md:col-span-2",
      component: <LLNConvergenceChart />,
    },
    {
      id: "poisson-splitting",
      title: "Risco de Divisão do Prêmio",
      subtitle: "Distribuição de Poisson em Vendas Altas",
      type: "Statistical",
      insight: "Comprar ingressos quando o prêmio chega a 1 Bilhão aumenta exponencialmente a probabilidade matemática de que, se você ganhar, terá que dividir o prêmio com muito mais pessoas.",
      note: "Matemática de grandes números de apostas.",
      component: <PoissonSplittingChart />,
    },
    {
      id: "human-bias-heatmap",
      title: "Viés de Seleção Humano",
      subtitle: "O perigo dos números de calendário (1-31)",
      type: "Informational",
      insight: "Enquanto as bolas caem aleatoriamente, os humanos não escolhem aleatoriamente. Apostar em datas de nascimento não altera suas chances de ganhar, mas MAXIMIZA a chance de dividir o prêmio.",
      note: "Preferências Cognitivas Humanas.",
      component: <SelectionBiasHeatmap />,
    },
    {
      id: "risk-of-ruin",
      title: "O Risco da Ruína",
      subtitle: "Apostando múltiplas vidas inteiras",
      type: "Statistical",
      insight: "Simulamos um jogador comprando 100 bilhetes por semana durante incontáveis vidas de 80 anos. A chance percentual de chegar ao leito de morte sem nunca ganhar nunca chega a zero realístico.",
      note: "A realidade implacável da esperança matemática.",
      className: "md:col-span-2",
      component: <LifetimesToWinChart />,
    },
  ],
});
