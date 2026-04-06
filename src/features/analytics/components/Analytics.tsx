import { buildChapters } from '@/features/analytics/configs/dashboard-config';
import { useAnalyticsMetadata } from '@/features/analytics/hooks/use-analytics-metadata';
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
import { downloadAsJson } from '@/shared/utils/download';
import { useDataSourceStore } from '@/store/data';
import { useGames, useIsSeeding, useLotteryMeta, useLotteryMetadata } from '@/store/selectors';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lightbulb, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLotteryFullStats } from '../hooks/use-analytics';
import { AnalyticsEmpty, AnalyticsLoading } from './AnalyticsStates';
import { SuggestedFeaturesPanel } from './charts/list/SuggestedFeaturesPanel';
import { ChapterDivider, TypeBadge } from './DashboardComponents';
import { DashboardHeader } from './DashboardHeader';
import { DashboardKpiStrip } from './DashboardKpiStrip';
import { XlsxUploadModal } from './XlsxUploadModal';

export function Analytics() {
  const stats = useLotteryFullStats();
  const statsMeta = useLotteryMeta();
  const metadata = useLotteryMetadata();
  const games = useGames();
  const isSeeding = useIsSeeding();

  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const { toasts, toast, closeToast } = useToast();
  const { setSource, markLocalReady } = useDataSourceStore();

  const { isStale, freshnessLabel } = useAnalyticsMetadata(metadata);

  const handleExport = () => {
    const filename = `mega-sena-dados-${new Date().toISOString().split('T')[0]}.json`;
    downloadAsJson(games, filename);
  };

  const handleUploadSuccess = (count: number) => {
    useDataSourceStore.getState().markLocalReady(true);
    useDataSourceStore.getState().setSource('local');
    toast({
      type: 'success',
      message: `Dados atualizados com sucesso — ${count.toLocaleString()} sorteios carregados.`,
    });
  };

  const hasData = metadata && metadata.totalGames > 0;
  const chapters = useMemo(() => (stats ? buildChapters(stats) : []), [stats]);

  if (isSeeding) return <AnalyticsLoading />;
  if (!hasData) return <AnalyticsEmpty />;

  const safeChapterIndex =
    chapters.length > 0 && currentChapterIndex >= chapters.length ? 0 : currentChapterIndex;
  const currentChapter = chapters[safeChapterIndex];
  const isLastChapter = safeChapterIndex === chapters.length - 1;

  const nextChapter = () => {
    if (safeChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(safeChapterIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevChapter = () => {
    if (safeChapterIndex > 0) {
      setCurrentChapterIndex(safeChapterIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
        onChapterSelect={setCurrentChapterIndex}
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
              <div id={`chapter-${currentChapter.id}`} className="scroll-mt-24">
                <ChapterDivider
                  icon={currentChapter.icon}
                  title={currentChapter.title}
                  description={currentChapter.description}
                  lineClass={currentChapter.lineClass}
                  iconColorClass={currentChapter.iconColorClass}
                  index={currentChapterIndex}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {isLastChapter && (
              <div id="chapter-next-steps" className="mt-16 pt-8 border-t border-border">
                <ChapterDivider
                  icon={<Lightbulb className="w-4 h-4" />}
                  title="Próximos Passos"
                  description="Ideias para expandir a plataforma"
                  lineClass="bg-rose-500/40"
                  iconColorClass="text-rose-400"
                  index={chapters.length}
                />
                <SuggestedFeaturesPanel />
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-border mt-12">
              <Button
                variant="ghost"
                onClick={prevChapter}
                disabled={currentChapterIndex === 0}
                className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all px-6 py-6 rounded-2xl border border-transparent hover:border-border"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                    Anterior
                  </p>
                  <p className="text-sm font-semibold">
                    {currentChapterIndex > 0 ? chapters[currentChapterIndex - 1].title : 'Início'}
                  </p>
                </div>
              </Button>

              <div className="flex items-center gap-2">
                {chapters.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentChapterIndex
                        ? 'w-8 bg-primary shadow-[0_0_8px_rgba(251,197,49,0.4)]'
                        : 'bg-border hover:bg-muted-foreground/30'
                    }`}
                    aria-label={`Ir para capítulo ${idx + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={nextChapter}
                disabled={isLastChapter}
                className="group flex items-center gap-2 border-primary/20 hover:border-primary/50 text-foreground hover:bg-primary/5 transition-all px-8 py-6 rounded-2xl"
              >
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                    Próximo
                  </p>
                  <p className="text-sm font-semibold">
                    {!isLastChapter ? chapters[currentChapterIndex + 1].title : 'Fim'}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
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
