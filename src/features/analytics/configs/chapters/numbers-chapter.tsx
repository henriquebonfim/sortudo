import { NumberProfileChart } from '@/features/analytics/components/charts/informational/NumberProfileChart';
import { GapAnalysisChart } from '@/features/analytics/components/charts/list/GapAnalysisChart';
import { FrequencyAnalysisGroup } from '@/features/analytics/components/charts/statistical/FrequencyAnalysisGroup';
import { HotColdNumbersChart } from '@/features/analytics/components/charts/statistical/HotColdNumbersChart';
import { ANALYSIS_CONFIG, MAX_LOTTERY_NUMBER } from '@/lib/lottery/constants';
import { LotteryStats } from '@/lib/lottery/types';
import { Hash } from 'lucide-react';
import { RegularVsSpecialChart } from '../../components/charts/comparison/RegularVsSpecialChart';
import { JackpotErosionWaterfall } from '../../components/charts/economics/JackpotErosionWaterfall';
import { PrizeDistributionChart } from '../../components/charts/hierarchical/PrizeDistributionChart';
import { AllJackpotWinnersChart } from '../../components/charts/list/AllJackpotWinnersChart';
import { TopJackpotWinnersChart } from '../../components/charts/list/TopJackpotWinnersChart';
import { Chapter } from '../types';

export const getNumbersChapter = (stats?: LotteryStats | null): Chapter => ({
  id: 'numeros',
  icon: <Hash className="w-4 h-4" />,
  title: 'Números',
  description: 'Frequência, temperatura e DNA das dezenas',
  lineClass: 'bg-blue-500/60',
  iconColorClass: 'text-blue-400',
  sections: [
    {
      id: 'frequency',
      title: 'Frequência',
      subtitle: 'saiba quais números saem mais',
      type: 'Estatístico',
      insight: `O número ${stats?.frequencies?.max?.number || 10} lidera com ${stats?.frequencies?.max?.frequency || '...'} sorteios. A dispersão é baixa: cada dezena tem ~${(100 / MAX_LOTTERY_NUMBER).toFixed(1)}% de chance teórica por bola.`,
      note: 'A frequência observada coincide com a curva de expectativa estatística de longo prazo.',
      className: 'md:col-span-2 lg:col-span-3',
      component: <FrequencyAnalysisGroup />,
    },

    {
      id: 'gap-analysis',
      title: 'Números Atrasados',
      subtitle: 'Pressão de ausência por dezena',
      type: 'Lista',
      insight:
        "Os números com maior proporção entre 'atraso atual / atraso recorde' estão sob máxima pressão estatística. Cada sorteio é independente, mas a ausência prolongada é matematicamente incomum.",
      note: 'Cor vermelha = atraso atual supera 60% do recorde histórico — o valor mais incomum registrado.',
      className: 'md:col-span-2 lg:col-span-1',
      component: <GapAnalysisChart />,
    },
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
      component: <AllJackpotWinnersChart />,
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
  ],
});
