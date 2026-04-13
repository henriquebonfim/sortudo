import { AllJackpotWinnersChart } from '@/features/analytics/components/charts/numbers/AllJackpotWinnersChart';
import { FrequencyAnalysisGroup } from '@/features/analytics/components/charts/numbers/FrequencyAnalysisGroup';
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
import { Chapter, InfographicType } from '@/features/analytics/components/types';
import { XlsxUploadModal } from '@/features/analytics/components/XlsxUploadModal';
import {
  useAnalyticsActions,
  useAnalyticsMetadata,
  useLotteryFullStats,
} from '@/hooks/use-analytics';
import { useDataSourceActions, type DataSource } from '@/hooks/use-data-source';
import { LoadingBalls } from '@/shared/components/LoadingBalls';
import { Button } from '@/shared/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/Card';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { ANALYSIS_CONFIG, MAX_LOTTERY_NUMBER } from '@/shared/constants';
import { useToast } from '@/shared/hooks/useToast';
import { LotteryStats } from '@/shared/types';
import { cn } from '@/shared/utils';
import {
  useDataSource,
  useGames,
  useHasLocalData,
  useIsAnalyticsCalculating,
  useIsSeeding,
  useLotteryMeta,
  useLotteryMetadata,
} from '@/store/selectors';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  Database,
  Download,
  FileText,
  Hash,
  Lightbulb,
  Loader2,
  PieChart,
  Sparkles,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

interface ChapterNavProps {
  chapters: Array<{ id: string; title: string; icon: ReactNode }>;
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
}

interface DashboardHeaderProps {
  metadata: {
    totalGames: number;
    lastUpdate: string;
  } | null;
  isStale: boolean;
  freshnessLabel: string | null;
  onExport: () => void;
  onOpenUpload: () => void;
  chapters: { id: string; title: string; icon: ReactNode }[];
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
}

interface DashboardKpiStripProps {
  totalGames: number;
  pctWithoutWinner: number;
  totalJackpotWinners: number;
  highestPrize: number;
}

interface ChapterProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  lineClass: string;
  iconColorClass: string;
  index: number;
}

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accentClass: string;
  valueClass: string;
  delay?: number;
}

const getNumbersChapter = (stats?: LotteryStats | null): Chapter => ({
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

const getProbabilityChapter = (_stats?: LotteryStats | null): Chapter => ({
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

const getTemporalChapter = (stats?: LotteryStats | null): Chapter => ({
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

function downloadAsJson(data: unknown, fileName: string) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildChapters(stats?: LotteryStats | null): Chapter[] {
  return CHAPTER_FACTORIES.map((factory) => factory(stats));
}

const CHAPTER_FACTORIES = [getNumbersChapter, getTemporalChapter, getProbabilityChapter];

const TYPE_BADGE_COLORS: Record<InfographicType, string> = {
  Estatístico: 'bg-info/15 text-info border-info/20',
  Cronológico: 'bg-violet/15 text-violet border-violet/20',
  Comparativo: 'bg-primary/15 text-primary border-primary/20',
  Hierárquico: 'bg-primary/15 text-primary border-primary/20',
  Geográfico: 'bg-success/15 text-success border-success/20',
  Informacional: 'bg-muted/15 text-muted-foreground border-border',
  Lista: 'bg-hot/15 text-hot border-hot/20',
  Processo: 'bg-primary/15 text-primary border-primary/20',
};

function TypeBadge({ type }: { type: InfographicType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${TYPE_BADGE_COLORS[type]}`}
    >
      {type}
    </span>
  );
}

function ChapterDivider({
  icon,
  title,
  description,
  lineClass,
  iconColorClass,
  index,
}: ChapterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 mt-2"
    >
      <div className="flex items-center gap-4">
        {/* Left accent bar */}
        <div className={`h-8 w-1 rounded-full flex-shrink-0 ${lineClass}`} />

        {/* Icon + text */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'hsl(var(--muted) / 0.7)' }}
          >
            <span className={iconColorClass}>{icon}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-display font-semibold text-foreground leading-none mb-0.5">
              {title}
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block truncate">{description}</p>
          </div>
        </div>

        {/* Right rule line */}
        <div className={`hidden sm:block h-px flex-1 ${lineClass} opacity-20`} />
      </div>
    </motion.div>
  );
}

function AnalyticsLoading() {
  return (
    <div className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="mb-8 flex justify-center">
          <LoadingBalls />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-3">
          Dashboard <span className="text-gradient-gold">Analítico</span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed animate-pulse">
          Sincronizando dados dos sorteios históricos...
        </p>
      </motion.div>
    </div>
  );
}

function AnalyticsEmpty() {
  return (
    <div className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-7 h-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-3">
          Dashboard <span className="text-gradient-gold">Analítico</span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          O banco de dados de sorteios está vazio e as informações não estão sincronizadas.
        </p>
      </motion.div>
    </div>
  );
}

function KpiCard({ label, value, icon, accentClass, valueClass, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card relative overflow-hidden group cursor-default"
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentClass}`} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, hsl(43 96% 56% / 0.03) 0%, transparent 60%)',
        }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium leading-tight max-w-[70%]">
            {label}
          </span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/60">
            <span className={valueClass}>{icon}</span>
          </div>
        </div>
        <p
          className={`font-mono text-2xl md:text-3xl font-bold tabular-nums tracking-tight ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function DashboardKpiStrip({
  totalGames,
  pctWithoutWinner,
  totalJackpotWinners,
  highestPrize,
}: DashboardKpiStripProps) {
  const isCalculating = useIsAnalyticsCalculating();

  const kpiCards = [
    {
      label: 'Total de jogos',
      value: totalGames.toLocaleString('pt-BR') || '0',
      icon: <BarChart3 className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      valueClass: 'text-[hsl(var(--info))]',
    },
    {
      label: 'Sem ganhador (seca)',
      value: `${pctWithoutWinner ?? '--'}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
      valueClass: 'text-hot',
    },
    {
      label: 'Total de ganhadores',
      value: totalJackpotWinners.toLocaleString('pt-BR') || '0',
      icon: <Users className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-primary to-amber-300',
      valueClass: 'text-primary',
    },
    {
      label: 'Maior prêmio',
      value: `R$${((highestPrize || 0) / 1_000_000).toLocaleString('pt-BR', {
        maximumFractionDigits: 0,
      })}M`,
      icon: <Trophy className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-emerald-500 to-green-400',
      valueClass: 'text-success',
    },
  ];

  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {kpiCards.map((card, i) => (
          <KpiCard key={card.label} {...card} delay={0.1 + i * 0.07} />
        ))}
      </div>

      <AnimatePresence>
        {isCalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -inset-x-2 -inset-y-2 z-50 flex items-center justify-center bg-background/40 backdrop-blur-[2px] rounded-2xl border-2 border-primary/20 border-dashed"
          >
            <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-full shadow-xl border border-border">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Recalculando estatísticas...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChapterNav({ chapters, currentChapterIndex, onChapterSelect }: ChapterNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
    >
      {chapters.map((ch, idx) => (
        <button
          key={ch.id}
          onClick={() => onChapterSelect(idx)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer flex-shrink-0 backdrop-blur-md text-xs font-semibold
            ${
              idx === currentChapterIndex
                ? 'bg-primary border-primary text-black shadow-[0_0_12px_rgba(251,197,49,0.3)]'
                : 'bg-card/30 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-card/60'
            }`}
        >
          <span
            className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 ${idx === currentChapterIndex ? 'scale-110' : 'opacity-60'}`}
          >
            {ch.icon}
          </span>
          {ch.title}
        </button>
      ))}
    </motion.div>
  );
}

function DataSourceToggle() {
  const source = useDataSource();
  const hasLocalData = useHasLocalData();
  const { switchTo, clearLocalData } = useDataSourceActions();
  const isSeeding = useIsSeeding();
  const [isSwitching, setIsSwitching] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // If the user hasn't uploaded any local data yet, there's no reason to show the toggle.
  if (!hasLocalData) return null;

  const handleToggle = async (newSource: DataSource) => {
    if (newSource === source || isSwitching || isSeeding) return;

    setIsSwitching(true);
    try {
      await switchTo(newSource);
    } catch (error) {
      console.error('Failed to switch data source:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleClearLocal = async () => {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true);
      // Auto-reset confirmation state after 3 seconds
      setTimeout(() => setIsConfirmingClear(false), 3000);
      return;
    }

    try {
      await clearLocalData();
      setIsConfirmingClear(false);
    } catch (error) {
      console.error('Failed to clear local data:', error);
    }
  };

  const loading = isSwitching || isSeeding;

  return (
    <div className="flex items-center gap-1.5 transition-all">
      {/* Source Selector */}
      <div className="flex items-center p-1 rounded-xl bg-muted/10 border border-border backdrop-blur-md relative group/toggle">
        <button
          disabled={loading}
          onClick={() => handleToggle('official')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative z-10',
            source === 'official'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/10 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSwitching && source !== 'official' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Database size={14} />
          )}
          <span>Dados Oficiais</span>
        </button>

        <button
          disabled={loading}
          onClick={() => handleToggle('local')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative z-10',
            source === 'local'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/10 disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSwitching && source !== 'local' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <FileText size={14} />
          )}
          <span>Arquivo Local</span>
        </button>

        {loading && (
          <div className="absolute inset-0 rounded-xl bg-background/20 backdrop-blur-[1px] z-20 flex items-center justify-center pointer-events-none" />
        )}
      </div>

      {/* Clear/Delete Local Data Button */}
      <AnimatePresence>
        {source === 'local' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClearLocal}
            className={cn(
              'p-2.5 rounded-xl border transition-all text-muted-foreground flex items-center gap-2 min-w-[40px] justify-center overflow-hidden',
              isConfirmingClear
                ? 'bg-hot text-white border-hot shadow-hot-subtle px-4'
                : 'bg-muted/10 border-border hover:bg-hot hover:text-white'
            )}
            title="Sair do modo local e remover arquivo salvo"
          >
            {isConfirmingClear ? (
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
              >
                Confirmar Limpeza
              </motion.span>
            ) : (
              <Trash2 size={15} />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function DashboardHeader({
  metadata,
  isStale,
  freshnessLabel,
  onExport,
  onOpenUpload,
  chapters,
  currentChapterIndex,
  onChapterSelect,
}: DashboardHeaderProps) {
  const hasLocalData = useHasLocalData();
  return (
    <div className="relative overflow-hidden border-b border-border">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 80% 50%, hsl(43 96% 56% / 0.05) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 10% 20%, hsl(217 91% 60% / 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container relative py-10 md:py-14">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          {/* Left: Title block */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{metadata?.totalGames.toLocaleString('pt-BR')} jogos</span>
              </div>

              <span className="text-border/60">•</span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isStale ? 'stale' : 'fresh'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${
                    isStale
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${isStale ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  />
                  {freshnessLabel}
                </motion.div>
              </AnimatePresence>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight mb-2">
              Dashboard <span className="text-gradient-gold">Analítico</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg">
              Relatório estatístico completo dos sorteios da Mega-Sena — padrões, frequências e
              probabilidades.
            </p>
            {/* Chapter quick-nav */}
            <div className="mt-7 pt-5  flex">
              <ChapterNav
                chapters={chapters.map((ch) => ({ id: ch.id, title: ch.title, icon: ch.icon }))}
                currentChapterIndex={currentChapterIndex}
                onChapterSelect={onChapterSelect}
              />
            </div>
          </motion.div>

          {/* Right: Actions & Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-col items-start lg:items-end gap-4"
          >
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 rounded-full border flex-shrink-0 text-xs font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5" />
                  Exportar JSON
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenUpload}
                className="flex items-center gap-2 px-4 py-2 rounded-full border flex-shrink-0 text-xs font-semibold bg-primary/5 hover:bg-primary/10 text-primary border-primary/20 hover:text-primary"
              >
                <span className="flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  Atualizar Dados
                </span>
              </Button>
            </div>

            {hasLocalData && <DataSourceToggle />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function Analytics() {
  const stats = useLotteryFullStats();
  const statsMeta = useLotteryMeta();
  const metadata = useLotteryMetadata();
  const games = useGames();
  const isSeeding = useIsSeeding();
  const { calculateStats } = useAnalyticsActions();
  const { markLocalReady, setSource } = useDataSourceActions();

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const chapters = useMemo(() => (stats ? buildChapters(stats) : []), [stats]);

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && chapters.length > 0) {
        const index = chapters.findIndex((ch) => ch.id === hash);
        if (index !== -1) {
          setCurrentChapterIndex(index);
        }
      }
    };

    if (chapters.length > 0) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [chapters]);

  const onChapterSelect = (index: number) => {
    setCurrentChapterIndex(index);
    if (chapters[index]) {
      window.history.pushState(null, '', `#${chapters[index].id}`);
    }
  };

  useEffect(() => {
    if (stats?.hotNumbers?.length) {
      const isOldSchema = 'count' in stats.hotNumbers[0] && !('frequency' in stats.hotNumbers[0]);
      if (isOldSchema) {
        console.warn('Old analytics schema detected, forcing recalculation...');
        calculateStats(true);
      }
    }
  }, [stats, calculateStats]);

  const { toasts, toast, closeToast } = useToast();

  const { isStale, freshnessLabel } = useAnalyticsMetadata(metadata);

  const handleExport = () => {
    const filename = `mega-sena-dados-${new Date().toISOString().split('T')[0]}.json`;
    downloadAsJson(games, filename);
  };

  const handleUploadSuccess = (newCount: number) => {
    const oldCount = metadata?.totalGames || 0;
    const delta = newCount - oldCount;

    markLocalReady(true);
    setSource('local');

    if (delta < 0) {
      toast({
        type: 'info',
        message: `Banco de dados atualizado, mas houve redução: ${oldCount} → ${newCount} sorteios.`,
      });
    } else if (delta === 0) {
      toast({
        type: 'info',
        message: `A base de dados já está na mesma versão (${newCount} sorteios). Nada foi alterado.`,
      });
    } else {
      toast({
        type: 'success',
        message: `Dados atualizados com sucesso — ${newCount.toLocaleString()} sorteios carregados${delta > 0 ? ` (+${delta} novos)` : ''}.`,
      });
    }
  };

  const hasData = metadata && metadata.totalGames > 0;

  if (isSeeding) return <AnalyticsLoading />;
  if (!hasData) return <AnalyticsEmpty />;

  const safeChapterIndex =
    chapters.length > 0 && currentChapterIndex >= chapters.length ? 0 : currentChapterIndex;
  const currentChapter = chapters[safeChapterIndex];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        metadata={metadata}
        isStale={isStale}
        freshnessLabel={freshnessLabel}
        onExport={handleExport}
        onOpenUpload={() => setIsUploadOpen(true)}
        chapters={chapters}
        currentChapterIndex={currentChapterIndex}
        onChapterSelect={onChapterSelect}
      />

      <div className="container py-8 md:py-12 space-y-12">
        <DashboardKpiStrip
          totalGames={metadata?.totalGames || 0}
          pctWithoutWinner={statsMeta?.pctWithoutWinner || 0}
          totalJackpotWinners={statsMeta?.totalJackpotWinners || 0}
          highestPrize={statsMeta?.highestPrize || 0}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter?.id || 'empty'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="space-y-8"
          >
            {currentChapter && (
              <div id={currentChapter.id} className="scroll-mt-24">
                <ChapterDivider
                  icon={currentChapter.icon}
                  title={currentChapter.title}
                  description={currentChapter.description}
                  lineClass={currentChapter.lineClass}
                  iconColorClass={currentChapter.iconColorClass}
                  index={currentChapterIndex}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 m-auto max-w-7xl">
                  {currentChapter.sections.map((s, sIdx) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{
                        delay: sIdx * 0.06,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={s.className}
                    >
                      <Card className="h-full glass-card border-border overflow-hidden flex flex-col group hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
                        <div
                          className={`h-[3px] w-full flex-shrink-0 ${currentChapter.lineClass} opacity-80`}
                        />

                        <CardHeader className="p-6 pb-4 flex flex-row items-start justify-between space-y-0">
                          <div className="space-y-2.5 min-w-0 flex-1">
                            <CardTitle className="text-base font-display font-bold tracking-tight text-foreground leading-snug">
                              {s.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 flex-wrap">
                              <TypeBadge type={s.type} />
                              {s.subtitle && (
                                <CardDescription className="text-xs text-muted-foreground/90 font-medium uppercase tracking-wider">
                                  {s.subtitle}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-6 pt-2 flex-grow flex flex-col">
                          <div className="flex-grow">{s.component}</div>

                          {(s.insight || s.note) && (
                            <div className="mt-6 pt-5 border-t border-border space-y-4 bg-primary/5 -mx-6 -mb-6 p-6">
                              {s.insight && (
                                <div className="flex gap-3">
                                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Lightbulb className="w-3.5 h-3.5 text-primary" />
                                  </div>
                                  <p className="text-xs text-foreground/90 leading-relaxed font-medium italic">
                                    {s.insight}
                                  </p>
                                </div>
                              )}
                              {s.note && (
                                <div className="flex items-start gap-2 ml-9">
                                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">
                                    Nota:
                                  </span>
                                  <p className="text-[10px] text-muted-foreground leading-normal font-medium opacity-80">
                                    {s.note}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/40 font-mono uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" />
            <span>
              Dados analisados com base em {metadata?.totalGames.toLocaleString('pt-BR')} jogos
              históricos
            </span>
          </div>
        </motion.div>
      </div>

      <XlsxUploadModal
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  );
}
