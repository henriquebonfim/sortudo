import { motion } from "framer-motion";
import { DollarSign, Hash, MapPin, PieChart, TrendingUp } from "lucide-react";

import {
  AccumulationTrendChart,
  BubbleChart,
  DataParsingProcessChart,
  FrequencyBarChart,
  GapAnalysisChart,
  GeoWinnersChart,
  HotColdNumbersChart,
  NumberProfileChart,
  PairCooccurrenceChart,
  ParityDistributionChart,
  PrizeDistributionChart,
  PrizeEvolutionChart,
  RecentHotNumbersChart,
  StreakEconomicsChart,
  SumBellCurveChart,
  TemporalFrequencyChart,
  TopJackpotWinnersChart,
  TopNumbersByDecadeChart,
  OddsVisualizerChart,
} from '@/features/analytics-dashboard/charts';


export type InfographicType =
  | "Statistical"
  | "Timeline"
  | "Comparison"
  | "Hierarchical"
  | "Geographic"
  | "Informational"
  | "List"
  | "Process";

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  type: InfographicType;
  insight: string;
  note: string;
  component: React.ReactNode;
  className?: string;
}

export interface Chapter {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  lineClass: string;
  iconColorClass: string;
  sections: Section[];
}

export function buildChapters(): Chapter[] {
  return [
    // ── NÚMEROS ──────────────────────────────────────────────────────────────
    {
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
          insight: "O número 10 lidera (352 sorteios), mas a dispersão é baixa. Cada bola tem ~1.6% de chance teórica por sorteio.",
          note: "Frequência coincide com a expectativa estatística de longo prazo.",
          className: "md:col-span-2 lg:col-span-2 row-span-2",
          component: (
            <div className="space-y-6">
              <BubbleChart />
              <FrequencyBarChart />
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
    },

    // ── TEMPORALIDADE ─────────────────────────────────────────────────────────
    {
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
          insight: "Quase 80% (79%) de todos os sorteios terminam acumulados. A maior seca registrou 28 concursos seguidos sem ganhador.",
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
    },

    // ── PROBABILIDADE ─────────────────────────────────────────────────────────
    {
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
          id: "pairs",
          title: "Sequências e Co-ocorrências",
          subtitle: "Dezenas consecutivas e pares frequentes",
          type: "Informational",
          insight: "Em 42% dos sorteios ocorre pelo menos um par de dezenas consecutivas. A probabilidade de trio consecutivo cai para apenas 3.2%.",
          note: "Os pares mais frequentes históricos aparecem em ~1.4% dos sorteios.",
          component: <PairCooccurrenceChart />,
        },
      ],
    },

    // ── FINANÇAS ──────────────────────────────────────────────────────────────
    {
      id: "economics",
      icon: <DollarSign className="w-4 h-4" />,
      title: "Finanças",
      description: "Prêmios, recordes e economia das apostas",
      lineClass: "bg-amber-500/60",
      iconColorClass: "text-amber-400",
      sections: [
        {
          id: "tiers",
          title: "Hierarquia de Premiação",
          subtitle: "Sena · Quina · Quadra",
          type: "Hierarchical",
          insight: "O prêmio médio da Sena (~R$ 39M) é quase 1.200× maior que o da Quina (~R$ 30K). A Quadra paga ~R$ 556 — diluído entre muitos.",
          note: "A concentração extrema no top cria o efeito jackpot que motiva o volume de apostas.",
          component: <PrizeDistributionChart />,
        },
        {
          id: "streak-economics",
          title: "Economia dos Acúmulos",
          subtitle: "Receita vs. prêmio por seca",
          type: "Statistical",
          insight: "A arrecadação cresce exponencialmente com cada sorteio acumulado — mais apostadores entram esperando o prêmio gordo. Um ciclo de retroalimentação financeira.",
          note: "O efeito jackpot: a cada acúmulo a arrecadação do próximo sorteio cresce significativamente.",
          className: "md:col-span-2 lg:col-span-2",
          component: <StreakEconomicsChart />,
        },
        {
          id: "winner-records",
          title: "Recordes de Ganhadores",
          subtitle: "Top concursos com mais acertos simultâneos",
          type: "List",
          insight: "O recorde histórico é de 52 ganhadores simultâneos na Sena — o que diluiu drasticamente o prêmio individual naquele concurso.",
          note: "Ocorre quando números muito populares, sequenciados ou visuais são sorteados.",
          component: <TopJackpotWinnersChart />,
        },
      ],
    },

    // ── GEOGRAFIA ────────────────────────────────────────────────────────────
    {
      id: "geography",
      icon: <MapPin className="w-4 h-4" />,
      title: "Geografia",
      description: "Distribuição geográfica dos ganhadores",
      lineClass: "bg-emerald-500/60",
      iconColorClass: "text-emerald-400",
      sections: [
        {
          id: "geo-map",
          title: "Mapa dos Ganhadores",
          subtitle: "Estados e regiões premiados",
          type: "Geographic",
          insight: "A região Sudeste domina. São Paulo (SP) lidera. O 'Canal Eletrônico' já representa ~4.5% de todas as apostas vencedoras identificadas.",
          note: "A cidade não-capital mais premiada historicamente é Santos/SP.",
          className: "md:col-span-2 lg:col-span-2",
          component: <GeoWinnersChart />,
        },
      ],
    },


    // ── PSICOLOGIA E EDUCAÇÃO ────────────────────────────────────────────────
    {
      id: "psychology",
      icon: <PieChart className="w-4 h-4" />,
      title: "Psicologia da Aposta",
      description: "A Ilusão da Probabilidade",
      lineClass: "bg-pink-500/60",
      iconColorClass: "text-pink-400",
      sections: [
        {
          id: "odds-visualizer",
          title: "A Escala da Improbabilidade",
          subtitle: "1 em 50 milhões na prática",
          type: "Informational",
          insight: "O cérebro humano tem dificuldade em processar números maiores que 10.000. Esta visualização compara a Mega-Sena com eventos raros reais.",
          note: "A probabilidade é tão baixa que apostar a vida inteira altera sua chance em menos de 0.01%.",
          className: "md:col-span-1 lg:col-span-3",
          component: <OddsVisualizerChart />,
        },
      ],
    },

    // ── METODOLOGIA ──────────────────────────────────────────────────────────
    {
      id: "methodology",
      icon: <PieChart className="w-4 h-4" />,
      title: "Metodologia",
      description: "Como os dados são processados e validados",
      lineClass: "bg-slate-500/60",
      iconColorClass: "text-slate-400",
      sections: [
        {
          id: "data-process",
          title: "Fluxo de Dados",
          subtitle: "Do Excel bruto aos insights estatísticos",
          type: "Process",
          insight: "Os dados seguem um rigoroso processo de normalização e validação antes de serem transformados em gráficos. Cada cálculo é auditado contra os totais oficiais.",
          note: "Processamento 100% client-side para garantir privacidade total dos seus dados de navegação.",
          className: "md:col-span-2 lg:col-span-2",
          component: <DataParsingProcessChart />,
        },
      ],
    },
  ];
}
