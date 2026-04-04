import { useLotteryActions } from '@/application/selectors';
import { useLotteryFullStats, useLotteryMeta } from '@/application/selectors';
import { useDraws, useIsSeeding, useLotteryMetadata } from '@/application/selectors';
import { LoadingBalls } from '@/components/shared/LoadingBalls';
import { Button } from '@/components/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/components/card';
import { SuggestedFeaturesPanel } from '@/features/analytics/charts';
import { ChapterNav, KpiCard } from '@/features/analytics/components';
import { ChapterDivider, TypeBadge } from '@/features/analytics/dashboard.components';
import { buildChapters } from '@/features/analytics/dashboard.config';
import { downloadAsJson } from '@/lib';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  Download,
  Info,
  Lightbulb,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import { useMemo, useRef } from 'react';

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Analytics() {
  const stats = useLotteryFullStats();
  const statsMeta = useLotteryMeta();
  const metadata = useLotteryMetadata();
  const draws = useDraws();
  const isSeeding = useIsSeeding();
  const { refresh } = useLotteryActions();
  const headerRef = useRef<HTMLDivElement>(null);

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

  // ── Loading ──
  if (isSeeding) {
    return (
      <div className="container py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center">
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

  // ── Empty state ──
  if (!hasData) {
    return (
      <div className="container py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto text-center">
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

  const kpiCards = [
    {
      label: 'Total de sorteios',
      value: metadata?.totalDraws.toLocaleString('pt-BR') || '0',
      icon: <BarChart3 className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      valueClass: 'text-[hsl(var(--info))]',
    },
    {
      label: 'Sem ganhador (seca)',
      value: `${statsMeta?.pctWithoutWinner ?? '--'}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-orange-500 to-amber-400',
      valueClass: 'text-hot',
    },
    {
      label: 'Total de ganhadores',
      value: statsMeta?.totalJackpotWinners.toLocaleString('pt-BR') || '0',
      icon: <Users className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-primary to-amber-300',
      valueClass: 'text-primary',
    },
    {
      label: 'Maior prêmio',
      value: `R$${((statsMeta?.highestPrize || 0) / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}M`,
      icon: <Trophy className="w-4 h-4" />,
      accentClass: 'bg-gradient-to-r from-emerald-500 to-green-400',
      valueClass: 'text-success',
    },
  ];

  return (
    <div>
      {/* ── Hero Header ── */}
      <div ref={headerRef} className="relative overflow-hidden border-b border-border">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 80% at 80% 50%, hsl(43 96% 56% / 0.05) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 10% 20%, hsl(217 91% 60% / 0.06) 0%, transparent 70%)',
          }} />

        <div className="container relative py-10 md:py-14">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">

            {/* Left: Title block */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              {/* Status row */}
              <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{metadata?.totalDraws.toLocaleString('pt-BR')} sorteios</span>
                </div>

                <span className="text-border/60">•</span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={isStale ? 'stale' : 'fresh'}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${isStale
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isStale ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    {freshnessLabel}
                  </motion.div>
                </AnimatePresence>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight mb-2">
                Dashboard <span className="text-gradient-gold">Analítico</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg">
                Relatório estatístico completo dos sorteios da Mega-Sena — padrões, frequências e probabilidades.
              </p>
            </motion.div>

            {/* Right: Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2 border-border/70 hover:border-primary/40 hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar JSON
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={refresh}
                className="hover:text-primary transition-colors duration-200 cursor-pointer"
                aria-label="Atualizar dados"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Chapter quick-nav */}
          <div className="mt-7 pt-5 border-t border-border/40">
            <ChapterNav
              chapters={[
                ...chapters.map(ch => ({ id: ch.id, title: ch.title, icon: ch.icon })),
                { id: 'next-steps', title: 'Próximos Passos', icon: <Lightbulb className="w-3.5 h-3.5" /> },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div className="container py-10 md:py-14 space-y-4">

        {/* ── KPI Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {kpiCards.map((card, i) => (
            <KpiCard key={card.label} {...card} delay={0.1 + i * 0.07} />
          ))}
        </div>

        {/* ── Chapters ── */}
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
                    {/* Card accent line */}
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

        {/* ── Próximos Passos ── */}
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

        {/* ── Footer note ── */}
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
