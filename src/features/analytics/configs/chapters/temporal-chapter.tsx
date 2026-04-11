import { TopNumbersByDecadeChart } from '@/features/analytics/components/charts/comparison/TopNumbersByDecadeChart';
import { PrizeEvolutionChart } from '@/features/analytics/components/charts/timeline/PrizeEvolutionChart';
import { TemporalFrequencyChart } from '@/features/analytics/components/charts/timeline/TemporalFrequencyChart';
import { LotteryStats } from '@/lib/lottery/types';
import { TrendingUp } from 'lucide-react';
import { GeoWinnersChart } from '../../components/charts/geographic/GeoWinnersChart';
import { StreakEconomicsChart } from '../../components/charts/statistical/StreakEconomicsChart';
import { AccumulationTrendChart } from '../../components/charts/timeline/AccumulationTrendChart';
import { Chapter } from '../types';

export const getTemporalChapter = (stats?: LotteryStats | null): Chapter => ({
  id: 'time-series',
  icon: <TrendingUp className="w-4 h-4" />,
  title: 'Temporalidade',
  description: 'Evolução histórica e tendências ao longo do tempo',
  lineClass: 'bg-violet-500/60',
  iconColorClass: 'text-violet-400',
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
        'As frequências se mantêm totalmente estáveis ao longo das décadas — evidência de entropia robusta e ausência de viés mecânico.',
      note: 'Não há evidência de viés crescente nos sorteios desde 1996.',
      className: ' col-span-2',
      component: <TemporalFrequencyChart />,
    },

    {
      id: 'accumulation',
      title: 'Tendência de Acúmulo',
      subtitle: 'Rollover por ano',
      type: 'Estatístico',
      insight: `Quase ${stats?.meta?.pctWithoutWinner || 79}% de todos os sorteios terminam acumulados. A maior seca registrou 28 concursos seguidos sem ganhador.`,
      note: 'A cada sorteio acumulado a chance matemática continua a mesma — 1 em ~50 milhões.',
      component: <AccumulationTrendChart />,
    },
    {
      id: 'temporal-decade-bar',
      title: 'Frequência de Números por Década',
      subtitle: 'Como todos os 60 números performaram ao longo das décadas',
      type: 'Comparativo',
      insight:
        'O gráfico de barras empilhadas mostra a constância da frequência dezena a dezena em cada década.',
      note: 'Agrupado e ordenado pelo volume total histórico.',

      className: 'md:col-span-2 lg:col-span-2',
      component: <TopNumbersByDecadeChart />,
    },
    {
      id: 'economics-streak',
      title: 'Impacto do Acúmulo',
      subtitle: 'Arrecadação vs. Sequência de acúmulos',
      type: 'Estatístico',
      insight:
        'O volume de apostas cresce exponencialmente à medida que o prêmio acumula. Sorteios com 10+ acúmulos arrecadam até 5× mais que sorteios iniciais.',
      note: 'Correlação prêmio/volume.',
      component: <StreakEconomicsChart />,
    },
  ],
});
