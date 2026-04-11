import { ClusteringChart } from '@/features/analytics/components/charts/informational/ClusteringChart';
import { ConsecutiveOverlapChart } from '@/features/analytics/components/charts/informational/ConsecutiveOverlapChart';
import { LowHighChart } from '@/features/analytics/components/charts/informational/LowHighChart';
import { MathCompositionChart } from '@/features/analytics/components/charts/informational/MathCompositionChart';
import { PairCooccurrenceChart } from '@/features/analytics/components/charts/informational/PairCooccurrenceChart';
import { SelectionBiasHeatmap } from '@/features/analytics/components/charts/informational/SelectionBiasHeatmap';
import { ParityDistributionChart } from '@/features/analytics/components/charts/statistical/ParityDistributionChart';
import { PoissonSplittingChart } from '@/features/analytics/components/charts/statistical/PoissonSplittingChart';
import { SumBellCurveChart } from '@/features/analytics/components/charts/statistical/SumBellCurveChart';
import { LotteryStats } from '@/lib/lottery/types';
import { PieChart } from 'lucide-react';
import { StreakEconomicsChart } from '../../components/charts/statistical/StreakEconomicsChart';
import { AccumulationTrendChart } from '../../components/charts/timeline/AccumulationTrendChart';
import { Chapter } from '../types';

export const getProbabilityChapter = (stats?: LotteryStats | null): Chapter => ({
  id: 'probability',
  icon: <PieChart className="w-4 h-4" />,
  title: 'Probabilidade',
  description: 'Distribuições e padrões matemáticos das combinações',
  lineClass: 'bg-cyan-500/60',
  iconColorClass: 'text-cyan-400',
  sections: [
    {
      id: 'parity',
      title: 'Paridade',
      subtitle: 'Distribuição Par / Ímpar',
      type: 'Estatístico',
      insight:
        'Combinações 3+3 são as mais prováveis (31%), seguidas pelos formatos 4/2 e 2/4. Juntas formam ~79% de todos os concursos.',
      note: 'Isso respeita rigorosamente a distribuição binomial estatística esperada.',
      component: <ParityDistributionChart />,
    },
    {
      id: 'pairs',
      title: 'Sequências e Co-ocorrências',
      subtitle: 'Dezenas consecutivas e pares frequentes',
      type: 'Informacional',
      insight:
        'Em 42% dos sorteios ocorre pelo menos um par de dezenas consecutivas. A probabilidade de trio consecutivo cai para apenas 3.2%.',
      note: 'Os pares mais frequentes históricos aparecem em ~1.4% dos sorteios.',
      component: <PairCooccurrenceChart />,
    },
    {
      id: 'sum',
      title: 'Soma Gaussiana',
      subtitle: 'Curva de Bell dos resultados',
      type: 'Estatístico',
      insight:
        'A média histórica da soma das 6 dezenas é 183.15, variando entre 66 e 331. A distribuição segue perfeita curva normal.',
      note: 'Extremos (somas perto de 21 ou de 345) são os eventos mais raros.',
      component: <SumBellCurveChart />,
    },
    {
      id: 'low-high',
      title: 'Distribuição: Baixas vs Altas',
      subtitle: 'Números de 1-30 vs 31-60',
      type: 'Estatístico',
      insight:
        'Apesar das crenças supersticiosas, 49.51% dos números sorteados são baixos e 50.49% são altos, revelando um equilíbrio quase perfeito a longo prazo.',
      note: 'Bolas (1-30) vs Bolas (31-60).',
      component: <LowHighChart />,
    },
    {
      id: 'math-composition',
      title: 'Composição Matemática',
      subtitle: 'Primos, Múltiplos e Padrões',
      type: 'Estatístico',
      insight:
        'Aproximadamente 28% das bolas sorteadas são números primos, enquanto 20% são múltiplos de 5. Isso mostra a diversidade matemática esperada.',
      note: 'DNA dos sorteios.',
      component: <MathCompositionChart />,
    },
    {
      id: 'clustering',
      title: 'Agrupamento de Dezenas',
      subtitle: 'Distribuição entre as linhas',
      type: 'Estatístico',
      insight:
        'Menos de 3% dos sorteios têm números primorosamente espalhados por todas as linhas (ex. 1 a 10, 11 a 20...). A maioria agrupa-se naturalmente.',
      note: 'Comportamento aglomerado vs espalhado.',
      component: <ClusteringChart />,
    },
    {
      id: 'overlap',
      title: 'Independência Consecutiva',
      subtitle: 'Repetições entre sorteios adjacentes',
      type: 'Estatístico',
      insight:
        'Mais de 52% dos sorteios não repetem nenhum número do concurso imediatamente anterior. A independência entre os eventos é soberana.',
      note: 'Falácia da Mão Quente.',
      component: <ConsecutiveOverlapChart />,
    },

    {
      id: 'poisson-splitting',
      title: 'Risco de Divisão do Prêmio',
      subtitle: 'Distribuição de Poisson em Vendas Altas',
      type: 'Estatístico',
      insight:
        'Comprar ingressos quando o prêmio chega a 1 Bilhão aumenta exponencialmente a probabilidade matemática de que, se você ganhar, terá que dividir o prêmio com muito mais pessoas.',
      note: 'Matemática de grandes números de apostas.',
      component: <PoissonSplittingChart />,
    },
    {
      id: 'human-bias-heatmap',
      title: 'Viés de Seleção Humano',
      subtitle: 'O perigo dos números de calendário (1-31)',
      type: 'Estatístico',
      insight:
        'Enquanto as bolas caem aleatoriamente, os humanos não escolhem aleatoriamente. Apostar em datas de nascimento não altera suas chances de ganhar, mas MAXIMIZA a chance de dividir o prêmio.',
      note: 'Preferências Cognitivas Humanas.',
      component: <SelectionBiasHeatmap />,
    },

  ],
});
