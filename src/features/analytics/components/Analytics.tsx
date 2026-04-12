import { buildChapters } from '@/features/analytics/configs/dashboard-config';
import { useAnalyticsMetadata } from '@/features/analytics/hooks/use-analytics-metadata';
import { useAnalyticsStore } from '@/features/analytics/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/Card';
import { ToastContainer } from '@/shared/components/ui/Toast';
import { useToast } from '@/shared/hooks/useToast';
import { downloadAsJson } from '@/shared/utils/download';
import { useDataSourceStore } from '@/store/data';
import { useGames, useIsSeeding, useLotteryMeta, useLotteryMetadata } from '@/store/selectors';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Trophy, Loader2, Lightbulb, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLotteryFullStats } from '@/features/analytics/hooks/use-analytics';
import {
  AnalyticsEmpty,
  AnalyticsLoading,
  ChapterDivider,
  ChapterNav,
  KpiCard,
  TypeBadge,
} from '@/features/analytics/components/DashboardComponents';
import { DashboardHeader } from '@/features/analytics/components/DashboardHeader';
import { DashboardKpiStrip } from '@/features/analytics/components/DashboardKpiStrip';
import { XlsxUploadModal } from '@/features/analytics/components/XlsxUploadModal';

export function Analytics() {
  const stats = useLotteryFullStats();
  const statsMeta = useLotteryMeta();
  const metadata = useLotteryMetadata();
  const games = useGames();
  const isSeeding = useIsSeeding();

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { calculateStats } = useAnalyticsStore();

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

    useDataSourceStore.getState().markLocalReady(true);
    useDataSourceStore.getState().setSource('local');

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
