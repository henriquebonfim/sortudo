import { AllJackpotWinnersList } from '@/features/analytics/components/charts/numbers/AllJackpotWinnersList';
import { GapAnalysisChart } from '@/features/analytics/components/charts/numbers/GapAnalysisChart';
import { HotColdNumbersChart } from '@/features/analytics/components/charts/numbers/HotColdNumbersChart';
import { JackpotErosionWaterfall } from '@/features/analytics/components/charts/numbers/JackpotErosionWaterfall';
import { NumberProfileChart } from '@/features/analytics/components/charts/numbers/NumberProfileChart';
import { PrizeDistributionChart } from '@/features/analytics/components/charts/numbers/PrizeDistributionChart';
import { RegularVsSpecialChart } from '@/features/analytics/components/charts/numbers/RegularVsSpecialChart';
import { TopJackpotWinnersChart } from '@/features/analytics/components/charts/numbers/TopJackpotWinnersChart';
import { ClusteringChart } from '@/features/analytics/components/charts/probability/ClusteringChart';
import { ConsecutiveOverlapChart } from '@/features/analytics/components/charts/probability/ConsecutiveOverlapChart';
import { LowHighChart } from '@/features/analytics/components/charts/probability/LowHighChart';
import { MathCompositionChart } from '@/features/analytics/components/charts/probability/MathCompositionChart';
import { PairCooccurrenceChart } from '@/features/analytics/components/charts/probability/PairCooccurrenceChart';
import { ParityDistributionChart } from '@/features/analytics/components/charts/probability/ParityDistributionChart';
import { PoissonSplittingChart } from '@/features/analytics/components/charts/probability/PoissonSplittingChart';
import { SelectionBiasHeatmap } from '@/features/analytics/components/charts/probability/SelectionBiasHeatmap';
import { SumBellCurveChart } from '@/features/analytics/components/charts/probability/SumBellCurveChart';
import { AccumulationTrendChart } from '@/features/analytics/components/charts/temporal/AccumulationTrendChart';
import { GeoWinnersChart } from '@/features/analytics/components/charts/temporal/GeoWinnersChart';
import { PrizeEvolutionChart } from '@/features/analytics/components/charts/temporal/PrizeEvolutionChart';
import { StreakEconomicsChart } from '@/features/analytics/components/charts/temporal/StreakEconomicsChart';
import { TemporalFrequencyChart } from '@/features/analytics/components/charts/temporal/TemporalFrequencyChart';
import { TopNumbersByDecadeChart } from '@/features/analytics/components/charts/temporal/TopNumbersByDecadeChart';
import { Chapter } from '@/features/analytics/components/types';
import type { LotteryStats } from '@/lib/core/types';
import { ANALYSIS_CONFIG, MAX_LOTTERY_NUMBER } from '@/shared/constants';
import { Hash, PieChart, TrendingUp } from 'lucide-react';

type AnalyticsStats = LotteryStats | null | undefined;

const getNumbersChapter = (stats?: AnalyticsStats): Chapter => ({
  id: 'numeros',
  icon: <Hash className="w-4 h-4" />,
  title: 'Números',
  description: 'Análise de Frequência, temperatura, DNA das dezenas e muito mais...',
  lineClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
  iconColorClass: 'text-amber-400',
  sections: [
    {
      id: 'hot-cold',
      title: 'Termômetro',
      subtitle: 'Temperatura dos últimos 10 sorteios',
      type: 'Estatístico',
      insight:
        'A grade completa dos 60 números colorida por frequência nos últimos 10 concursos revela clusters temporais reais, mesmo que cada sorteio seja matematicamente independente.',
      note: 'Vermelho = apareceu 4+ vezes. Azul = ausente nos últimos 10 sorteios.',
      className: 'md:col-span-2 lg:col-span-1',
      component: <HotColdNumbersChart />,
    },
    {
      id: 'draw-dna',
      title: 'DNA do Sorteio',
      subtitle: 'Perfil estatístico das combinações',
      type: 'Estatístico',
      insight: `A distribuição baixo/alto é equilibrada (${stats?.numberProfile?.lowHighSplit?.low || '--'}% / ${stats?.numberProfile?.lowHighSplit?.high || '--'}%). Números primos aparecem em ${stats?.numberProfile?.primesPercentage || '--'}% das dezenas sorteadas.`,
      note: `Apenas ${stats?.numberProfile?.decadeAnalysis?.fullySpreadPct || '--'}% dos sorteios cobram ${ANALYSIS_CONFIG.FULLY_SPREAD_SIZE} dezenas diferentes. Em ${stats?.numberProfile?.decadeAnalysis?.clusteredPct || '--'}% há ${ANALYSIS_CONFIG.CLUSTERED_THRESHOLD}+ bolas na mesma dezena.`,
      className: 'md:col-span-2 lg:col-span-1',
      component: <NumberProfileChart />,
    },
    {
      id: 'gap-analysis',
      title: 'Números Atrasados',
      subtitle: 'Pressão de ausência por dezena',
      type: 'Lista',
      insight: `O número ${stats?.frequencies?.max?.number || 10} lidera com ${stats?.frequencies?.max?.frequency || '...'} sorteios. A dispersão é baixa: cada dezena tem ~${(100 / MAX_LOTTERY_NUMBER).toFixed(1)}% de chance teórica por bola.`,
      note: "Os números com maior proporção entre 'atraso atual / atraso recorde' estão sob máxima pressão estatística. Cada sorteio é independente, mas a ausência prolongada é matematicamente incomum.",
      className: 'md:col-span-2 lg:col-span-1',
      component: <GapAnalysisChart />,
    },

    {
      id: 'winner-records',
      title: 'Recordes de Ganhadores',
      subtitle: 'Top sorteios com mais acertos simultâneos',
      type: 'Lista',
      insight: `O recorde histórico é de ${stats?.topJackpotWinners?.[0]?.winners || 0} ganhadores simultâneos na Sena — o que diluiu drasticamente o prêmio individual naquele sorteio.`,
      note: 'Ocorre em bolões, números muito populares, aleatórios ou visuais, que são os mais sorteados.',
      component: <TopJackpotWinnersChart />,
    },
    {
      id: 'all-winner-list',
      title: 'Lista de Ganhadores',
      subtitle: 'Todos os sorteios com mais de 1 ganhador',
      type: 'Lista',
      insight: `O histórico de ganhadores é de ${stats?.topJackpotWinners?.length || 0} sorteios com mais de 1 ganhador.`,
      note: 'Ocorre quando números muito populares, sequenciados ou visuais são sorteados.',
      className: 'md:col-span-2 lg:col-span-2',
      component: <AllJackpotWinnersList />,
    },

    {
      id: 'waterfall',
      title: 'A Ilusão de 1 Bilhão',
      subtitle: 'Atrição Financeira (Opção Cash + Impostos)',
      type: 'Estatístico',
      insight:
        'Os prêmios anunciados são baseados em anuidades de 30 anos. Se você optar pelo valor em dinheiro vivo (o que, matematicamente, você provavelmente deveria fazer), você perde instantaneamente ~52% do valor anunciado. E então vêm os impostos.',
      note: ' Aquele anúncio dizendo "1 BILHÃO DE REAIS!" representa, na verdade, um valor de ~R$300 milhões. Combine isso com o risco de Divisão (curva de Poisson), e o valor real cai ainda mais.',
      component: <JackpotErosionWaterfall />,
    },
    {
      id: 'regular-vs-special',
      title: 'Fenômeno Mega da Virada',
      subtitle: 'Comparação de magnitude dos prêmios',
      type: 'Comparativo',
      insight:
        'A disparidade de magnitude entre prêmios é de centenas de vezes. O evento especial anualmente redefine os recordes da loteria.',
      note: 'Comparação direta entre a rentabilidade média de sorteios semanais vs. o evento anual especial.',
      className: 'md:col-span-1 lg:col-span-1',
      component: <RegularVsSpecialChart />,
    },
    {
      id: 'prize-tiers',
      title: 'Distribuição por Faixa',
      subtitle: 'Hierarquia de prêmios',
      type: 'Hierárquico',
      insight:
        'A sena concentra a maior parte do valor, mas quinas e quadras distribuem volumes significativos para milhares de apostadores.',
      note: 'Concentração vs. Capilaridade.',
      className: 'md:col-span-2 lg:col-span-1',
      component: <PrizeDistributionChart />,
    },
  ],
});

const getProbabilityChapter = (): Chapter => ({
  id: 'probabilidades',
  icon: <PieChart className="w-4 h-4" />,
  title: 'Probabilidade',
  description: 'Análise de distribuições, padrões matemáticos das combinações e muito mais...',
  lineClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
  iconColorClass: 'text-amber-400',
  sections: [
    {
      id: 'parity',
      title: 'Paridade',
      subtitle: 'Distribuição Par / Ímpar',
      type: 'Estatístico',
      insight:
        'Combinações 3+3 são as mais prováveis (31%), seguidas pelos formatos 4/2 e 2/4. Juntas formam ~79% de todos os concursos.',
      note: null,
      component: <ParityDistributionChart />,
    },
    {
      id: 'pairs',
      title: 'Sequências e Co-ocorrências',
      subtitle: 'Dezenas consecutivas e pares frequentes',
      type: 'Informacional',
      insight:
        'Em 42% dos sorteios ocorre pelo menos um par de dezenas consecutivas. A probabilidade de trio consecutivo cai para apenas 3.2%. Os pares mais frequentes históricos aparecem em ~1.4% dos sorteios.',
      note: null,
      component: <PairCooccurrenceChart />,
    },
    {
      id: 'human-bias-heatmap',
      title: 'Viés de Seleção Humano',
      subtitle: 'O perigo dos números de calendário (1-31)',
      type: 'Estatístico',
      insight:
        'Enquanto as bolas caem aleatoriamente, os humanos não escolhem aleatoriamente. Apostar em datas de nascimento não altera suas chances de ganhar, mas MAXIMIZA a chance de dividir o prêmio.',
      note: 'Se você ganhar com esses números, terá que dividir o prêmio com dezenas de outros apostadores, o que reduz drasticamente o lucro real por bilhete.',
      component: <SelectionBiasHeatmap />,
    },

    {
      id: 'overlap',
      title: 'Independência Consecutiva',
      subtitle: 'Repetições entre sorteios adjacentes',
      type: 'Estatístico',
      insight:
        'Mais de 52% dos sorteios não repetem nenhum número do concurso imediatamente anterior. A independência entre os eventos é soberana.',
      note: 'Frequência em que números do sorteio anterior se repetem no atual.',
      component: <ConsecutiveOverlapChart />,
    },

    {
      id: 'poisson-splitting',
      title: 'Risco de Divisão do Prêmio',
      subtitle: 'Distribuição de Poisson em Vendas Altas',
      type: 'Estatístico',
      insight:
        'Comprar ingressos quando o prêmio chega a 1 Bilhão aumenta exponencialmente a probabilidade matemática de que, se você ganhar, terá que dividir o prêmio com muito mais pessoas.',
      note: null,
      component: <PoissonSplittingChart />,
    },
    {
      id: 'sum',
      title: 'Soma Gaussiana',
      subtitle: 'Curva de Bell dos resultados',
      type: 'Estatístico',
      insight:
        'A média histórica da soma das 6 dezenas é 183.15, variando entre 66 e 331. A distribuição segue perfeita curva normal. Extremos (somas perto de 21 ou de 345) são os eventos mais raros, enquanto a maioria dos sorteios se concentra entre 150 e 200.',
      note: 'Total de 2.994 sorteios analisados. Soma mínima teórica: 21 (1+2+3+4+5+6) · Máxima: 345 (55+56+57+58+59+60).',
      component: <SumBellCurveChart />,
    },
    {
      id: 'low-high',
      title: 'Distribuição: Baixas vs Altas',
      subtitle: 'Números de 1-30 vs 31-60',
      type: 'Estatístico',
      insight:
        'Apesar das crenças supersticiosas, 49.51% dos números sorteados são baixos e 50.49% são altos, revelando um equilíbrio quase perfeito a longo prazo.',
      note: null,
      component: <LowHighChart />,
    },
    {
      id: 'math-composition',
      title: 'Composição Matemática',
      subtitle: 'Primos, Múltiplos e Padrões',
      type: 'Estatístico',
      insight:
        'Aproximadamente 28% das bolas sorteadas são números primos, enquanto 20% são múltiplos de 5. Isso mostra a diversidade matemática esperada.',
      note: null,
      component: <MathCompositionChart />,
    },
    {
      id: 'clustering',
      title: 'Agrupamento de Dezenas',
      subtitle: 'Distribuição entre as linhas',
      type: 'Estatístico',
      insight:
        'Menos de 3% dos sorteios têm números primorosamente espalhados por todas as linhas (ex. 1 a 10, 11 a 20...). A maioria agrupa-se naturalmente.',
      note: null,
      component: <ClusteringChart />,
    },
  ],
});

const getTemporalChapter = (stats?: AnalyticsStats): Chapter => ({
  id: 'evolucoes',
  icon: <TrendingUp className="w-4 h-4" />,
  title: 'Evolução',
  description:
    'Análise da evolução histórica, recordes, tendências ao longo do tempo e muito mais...',
  lineClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
  iconColorClass: 'text-amber-400',
  sections: [
    {
      id: 'prizes',
      title: 'Evolução dos Prêmios',
      subtitle: 'Série temporal 1996–hoje',
      type: 'Cronológico',
      insight:
        'A média dos prêmios da Mega da Virada (~R$ 286M) é quase 9× maior que os sorteios regulares (~R$ 32M). Os picos correspondem a sequências longas de acúmulo.',
      note: 'Prêmios acumulados e sorteios especiais criam picos incomparáveis.',
      className: 'md:col-span-2 lg:col-span-2',
      component: <PrizeEvolutionChart />,
    },
    {
      id: 'geo-map',
      title: 'Mapa dos Ganhadores',
      subtitle: 'Estados e regiões premiados',
      type: 'Geográfico',
      insight: `A região Sudeste domina. ${stats?.geoWinners?.[0]?.state || 'SP'} lidera com ${stats?.geoWinners?.[0]?.total || '--'} ganhadores. O 'Canal Eletrônico' já representa ~4.5%.`,
      note: 'A cidade não-capital mais premiada historicamente é Santos/SP.',
      className: 'md:col-span-1 lg:col-span-1',
      component: <GeoWinnersChart />,
    },
    {
      id: 'temporal',
      title: 'Estabilidade por Décadas',
      subtitle: 'Comportamento histórico imutável',
      type: 'Cronológico',
      insight:
        'As frequências se mantêm totalmente estáveis ao longo das décadas desde a digitalização em 1996.',
      note: null,
      className: ' col-span-2',
      component: <TemporalFrequencyChart />,
    },

    {
      id: 'accumulation',
      title: 'Tendência de Acúmulo',
      subtitle: 'Rollover por ano',
      type: 'Estatístico',
      insight: `Quase ${stats?.meta?.pctWithoutWinner || 79}% de todos os sorteios terminam acumulados. A maior seca registrou 28 concursos seguidos sem ganhador.`,
      note: null,
      component: <AccumulationTrendChart />,
    },
    {
      id: 'temporal-decade-bar',
      title: 'Frequência de Números por Década',
      subtitle: 'Como todos os 60 números performaram ao longo das décadas',
      type: 'Comparativo',
      insight:
        'O gráfico de barras empilhadas mostra a constância da frequência dezena a dezena em cada década.',
      note: null,
      component: <TopNumbersByDecadeChart />,
    },
    {
      id: 'economics-streak',
      title: 'Impacto do Acúmulo',
      subtitle: 'Arrecadação vs. Sequência de acúmulos',
      type: 'Estatístico',
      insight:
        'O volume de apostas cresce exponencialmente à medida que o prêmio acumula. Sorteios com 10+ acúmulos arrecadam até 5× mais que sorteios iniciais.',
      note: '*As informações em branco são de dados que não foram devidamente cadastrados no banco de dados, e não necessariamente indicam ausência de ganhadores ou acúmulos.',
      className: 'md:col-span-2 lg:col-span-2',
      component: <StreakEconomicsChart />,
    },
  ],
});

const CHAPTER_FACTORIES = [getNumbersChapter, getTemporalChapter, getProbabilityChapter];

export function buildChapters(stats?: AnalyticsStats): Chapter[] {
  return CHAPTER_FACTORIES.map((factory) => factory(stats));
}
