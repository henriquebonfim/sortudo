import { useDraws, useIsSeeding, useLotteryActions, useLotteryFullStats, useLotteryMeta, useLotteryMetadata } from '@/application/selectors';
import { Button } from '@/components/layout/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/layout/card';
import { SuggestedFeaturesPanel } from '@/features/analytics/charts';
import { ChapterDivider, TypeBadge } from '@/features/analytics/dashboard.components';
import { buildChapters } from '@/features/analytics/dashboard.config';
import { downloadAsJson } from '@/lib';
import { motion } from 'framer-motion';
import { Info, Lightbulb, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { AnalyticsEmpty, AnalyticsLoading } from './AnalyticsStates';
import { DashboardHeader } from './DashboardHeader';
import { DashboardKpiStrip } from './DashboardKpiStrip';

export function Analytics() {
  const stats = useLotteryFullStats();
  const statsMeta = useLotteryMeta();
  const metadata = useLotteryMetadata();
  const draws = useDraws();
  const isSeeding = useIsSeeding();
  const { refresh } = useLotteryActions();

  const handleExport = () => {
    const filename = `mega-sena-dados-${new Date().toISOString().split('T')[0]}.json`;
    downloadAsJson(draws, filename);
  };

  const hasData = metadata && metadata.totalDraws > 0;
  const chapters = useMemo(() => (stats ? buildChapters(stats) : []), [stats]);

  const isStale = useMemo(() => {
    if (!metadata?.lastUpdate) return false;
    const last = new Date(metadata.lastUpdate).getTime();
    const now = new Date().getTime();
    return (now - last) > 7 * 24 * 60 * 60 * 1000;
  }, [metadata]);

  const freshnessLabel = useMemo(() => {
    if (!metadata?.lastUpdate) return null;
    const days = Math.floor((new Date().getTime() - new Date(metadata.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Atualizado hoje';
    if (days === 1) return 'Atualizado ontem';
    return `Há ${days} dias`;
  }, [metadata]);

  if (isSeeding) return <AnalyticsLoading />;
  if (!hasData) return <AnalyticsEmpty />;

  return (
    <div>
      <DashboardHeader
        metadata={metadata}
        isStale={isStale}
        freshnessLabel={freshnessLabel}
        onExport={handleExport}
        onRefresh={refresh}
        chapters={chapters}
      />

      <div className="container py-10 md:py-14 space-y-4">
        <DashboardKpiStrip
          totalDraws={metadata?.totalDraws || 0}
          pctWithoutWinner={statsMeta?.pctWithoutWinner || 0}
          totalJackpotWinners={statsMeta?.totalJackpotWinners || 0}
          highestPrize={statsMeta?.highestPrize || 0}
        />

        {chapters.map((chapter, chapterIdx) => (
          <div
            key={chapter.id}
            id={`chapter-${chapter.id}`}
            className={`scroll-mt-24 ${chapterIdx > 0 ? 'mt-16 pt-2' : 'mt-8'}`}
          >
            <ChapterDivider
              icon={chapter.icon}
              title={chapter.title}
              description={chapter.description}
              lineClass={chapter.lineClass}
              iconColorClass={chapter.iconColorClass}
              index={chapterIdx}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {chapter.sections.map((s, sIdx) => (
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
                  <Card className="h-full glass-card border-border overflow-hidden flex flex-col group hover:border-primary/20 transition-colors duration-300">
                    <div className={`h-[2px] w-full flex-shrink-0 ${chapter.lineClass} opacity-70`} />

                    <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between space-y-0">
                      <div className="space-y-2 min-w-0 flex-1">
                        <CardTitle className="text-sm font-display font-semibold tracking-tight text-foreground leading-snug">
                          {s.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <TypeBadge type={s.type} />
                          {s.subtitle && (
                            <CardDescription className="text-xs text-muted-foreground/80">
                              {s.subtitle}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground/50 hover:text-primary hover:bg-primary/10 flex-shrink-0 ml-2 transition-colors duration-200 cursor-pointer rounded-lg"
                        aria-label={s.insight}
                      >
                        <Info className="h-3.5 w-3.5" />
                      </Button>
                    </CardHeader>

                    <CardContent className="p-5 pt-2 flex-grow">
                      {s.component}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        <div id="chapter-next-steps" className="mt-16 pt-2">
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-border/30 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50">
            <Sparkles className="w-3 h-3" />
            <span>Dados analisados com base em {metadata?.totalDraws.toLocaleString('pt-BR')} sorteios históricos da Mega-Sena</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
