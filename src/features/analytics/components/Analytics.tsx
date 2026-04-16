import { buildChapters } from '@/features/analytics/components/chapterFactories';
import { ChapterNav } from '@/features/analytics/components/ChapterNav';
import { FrequencyAnalysisGroup } from '@/features/analytics/components/charts/numbers/FrequencyAnalysisGroup';
import { DataSourceToggle } from '@/features/analytics/components/DataSourceToggle';
import { InfographicType } from '@/features/analytics/components/types';
import { XlsxUploadModal } from '@/features/analytics/components/XlsxUploadModal';
import { useChapterNavigation } from '@/features/analytics/hooks/useChapterNavigation';
import { useAnalyticsMetadata, useLotteryFullStats } from '@/hooks/use-analytics';
import { useDataSourceActions } from '@/hooks/use-data-source';
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
import { useToast } from '@/shared/hooks/useToast';
import {
  useGames,
  useIsAnalyticsCalculating,
  useIsSeeding,
  useLotteryMeta,
  useLotteryMetadata,
} from '@/store/selectors';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  Download,
  Lightbulb,
  Loader2,
  Sparkles,
  TrendingUp,
  Trophy,
  Upload,
  Users,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

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
  onChapterSelect: (index: number, chapterId?: string) => void;
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
        <div className={`h-8 w-1 flex-shrink-0 rounded-full ${lineClass}`} />

        {/* Icon + text */}
        <div className="min-w-0 flex items-center gap-3">
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
    <div className="container py-12 sm:py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md text-center"
      >
        <div className="mb-8 flex justify-center">
          <LoadingBalls />
        </div>
        <h1 className="mb-3 font-display text-xl font-bold text-foreground sm:text-2xl">
          Dashboard <span className="text-gradient-gold">Analítico</span>
        </h1>
        <p className="animate-pulse text-sm leading-relaxed text-muted-foreground">
          Sincronizando dados dos sorteios históricos...
        </p>
      </motion.div>
    </div>
  );
}

function AnalyticsEmpty() {
  return (
    <div className="container py-12 sm:py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-7 h-7 text-muted-foreground" />
        </div>
        <h1 className="mb-3 font-display text-xl font-bold text-foreground sm:text-2xl">
          Dashboard <span className="text-gradient-gold">Analítico</span>
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
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
      className="  relative overflow-hidden group cursor-default"
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentClass}`} />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, hsl(43 96% 56% / 0.03) 0%, transparent 60%)',
        }}
      />
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between">
          <span className="max-w-[70%] text-[11px] font-medium uppercase leading-tight tracking-widest text-muted-foreground sm:text-xs">
            {label}
          </span>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted/60">
            <span className={valueClass}>{icon}</span>
          </div>
        </div>
        <p
          className={`font-mono text-xl font-bold tracking-tight tabular-nums sm:text-2xl md:text-3xl ${valueClass}`}
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
      accentClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
      valueClass: 'text-primary',
    },
    {
      label: 'Total de ganhadores',
      value: totalJackpotWinners.toLocaleString('pt-BR') || '0',
      icon: <Users className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
      valueClass: 'text-primary',
    },
    {
      label: 'Sorteios sem ganhadores (%)',
      value: `${pctWithoutWinner ?? '--'}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
      valueClass: 'text-primary',
    },
    {
      label: 'Maior prêmio já distribuido',
      value: `R$${((highestPrize || 0) / 1_000_000).toLocaleString('pt-BR', {
        maximumFractionDigits: 0,
      })}M`,
      icon: <Trophy className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
      valueClass: 'text-primary',
    },
  ];

  return (
    <div className="relative">
      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mb-12 lg:grid-cols-4">
        {kpiCards.map((card, i) => (
          <KpiCard key={card.label} {...card} delay={0.1 + i * 0.07} />
        ))}
      </div>
      <FrequencyAnalysisGroup />

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
  return (
    <div className="relative overflow-hidden border-b border-border">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 80% 50%, hsl(43 96% 56% / 0.05) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 10% 20%, hsl(217 91% 60% / 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container relative py-8 sm:py-10 md:py-14">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:items-end">
          {/* Left: Title block */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-1 text-center lg:text-left"
          >
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground sm:text-xs">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{metadata?.totalGames.toLocaleString('pt-BR')} jogos</span>
              </div>

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

            <h1 className="mb-2 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
              Dashboard <span className="text-gradient-gold">Analítico</span>
            </h1>
            <p className="mx-auto max-w-lg text-sm text-muted-foreground md:text-base lg:mx-0">
              Relatório estatístico completo dos sorteios da Mega-Sena — padrões, frequências e
              probabilidades.
            </p>
            {/* Chapter quick-nav */}
            <div className="mt-6 flex justify-center pt-4 sm:mt-7 sm:pt-5 lg:justify-start">
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
            className="flex w-full flex-col items-center gap-4 lg:w-auto lg:items-end"
          >
            <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto lg:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex h-9 items-center gap-2 rounded-full border px-4 text-xs font-semibold"
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
                className="flex h-9 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary"
              >
                <span className="flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  Atualizar Dados
                </span>
              </Button>
            </div>

            <DataSourceToggle />
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
  const { markLocalReady, setSource } = useDataSourceActions();

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const chapters = useMemo(() => (stats ? buildChapters(stats) : []), [stats]);
  const { activeChapterIndex, onChapterSelect } = useChapterNavigation(chapters.length);

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
        message: `${newCount.toLocaleString()} dados atualizados com sucesso!`,
      });
    }
  };

  const hasData = metadata && metadata.totalGames > 0;

  if (isSeeding) return <AnalyticsLoading />;
  if (!hasData) return <AnalyticsEmpty />;
  const currentChapter = chapters[activeChapterIndex];

  return (
    <div className="page-hero min-h-screen">
      <DashboardHeader
        metadata={metadata}
        isStale={isStale}
        freshnessLabel={freshnessLabel}
        onExport={handleExport}
        onOpenUpload={() => setIsUploadOpen(true)}
        chapters={chapters}
        currentChapterIndex={activeChapterIndex}
        onChapterSelect={onChapterSelect}
      />

      <div className="container space-y-10 py-6 sm:space-y-12 sm:py-8 md:py-12">
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
            className="space-y-6 sm:space-y-8"
          >
            {currentChapter && (
              <div id={currentChapter.id} className="scroll-mt-24">
                <ChapterDivider
                  icon={currentChapter.icon}
                  title={currentChapter.title}
                  description={currentChapter.description}
                  lineClass={currentChapter.lineClass}
                  iconColorClass={currentChapter.iconColorClass}
                  index={activeChapterIndex}
                />

                <div className="m-auto grid max-w-7xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                      <Card className="group flex h-full flex-col overflow-hidden shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
                        <div
                          className={`h-[3px] w-full flex-shrink-0 ${currentChapter.lineClass} opacity-80`}
                        />

                        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-3 sm:p-6 sm:pb-4">
                          <div className="min-w-0 flex-1 space-y-2.5">
                            <CardTitle className="text-base font-display font-bold tracking-tight text-foreground leading-snug">
                              {s.title}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-2">
                              <TypeBadge type={s.type} />
                              {s.subtitle && (
                                <CardDescription className="text-xs text-muted-foreground/90 font-medium uppercase tracking-wider">
                                  {s.subtitle}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="flex flex-grow flex-col p-4 pt-2 sm:p-6 sm:pt-2">
                          <div className="flex-grow">{s.component}</div>

                          {(s.insight || s.note) && (
                            <div className="-mx-4 -mb-4 mt-5 space-y-4 border-t border-border bg-primary/5 p-4 pt-4 sm:-mx-6 sm:-mb-6 sm:mt-6 sm:p-6 sm:pt-5">
                              {s.insight && (
                                <div className="flex gap-3">
                                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <Lightbulb className="w-3.5 h-3.5 text-primary" />
                                  </div>
                                  <p className="text-xs text-foreground/90 leading-relaxed font-medium italic">
                                    {s.insight}
                                  </p>
                                </div>
                              )}
                              {s.note && (
                                <div className="ml-9 flex items-start gap-2">
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
          className="mt-12 pt-6 text-center sm:mt-16 sm:pt-8"
        >
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/40">
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
