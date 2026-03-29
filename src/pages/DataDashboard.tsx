import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useLotteryStore } from '@/application/useLotteryStore';
import { LoadingBalls } from '@/components/shared/LoadingBalls';
import { StatCard } from '@/components/shared/StatCard';
import { buildChapters } from '@/features/analytics-dashboard/dashboard.config';
import { ChapterDivider, TypeBadge } from '@/features/analytics-dashboard/dashboard.components';
import { SuggestedFeaturesPanel } from '@/features/analytics-dashboard/charts';
import { downloadAsJson } from '@/lib/export';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw, BarChart3, Download, Info, Lightbulb } from 'lucide-react';

export default function DataDashboard() {
  const { stats, metadata, draws, isSeeding, refresh } = useLotteryStore();

  const handleExport = () => {
    const filename = `mega-sena-dados-${new Date().toISOString().split('T')[0]}.json`;
    downloadAsJson(draws, filename);
  };

  const hasData = metadata && metadata.totalDraws > 0;
  const chapters = buildChapters(stats);

  const isStale = useMemo(() => {
    if (!metadata?.lastUpdate) return false;
    const last = new Date(metadata.lastUpdate).getTime();
    const now = new Date().getTime();
    return (now - last) > 7 * 24 * 60 * 60 * 1000;
  }, [metadata]);

  const freshnessLabel = useMemo(() => {
    if (!metadata?.lastUpdate) return null;
    const days = Math.floor((new Date().getTime() - new Date(metadata.lastUpdate).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Atualizado hoje";
    if (days === 1) return "Atualizado ontem";
    return `Há ${days} dias`;
  }, [metadata]);

  if (isSeeding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingBalls />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="container py-10 md:py-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">
            Relatório <span className="text-gradient-gold">Analítico</span>
          </h1>
          <p className="text-muted-foreground">O banco de dados de sorteios está vazio e as informações não estão sincronizadas.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-10 md:py-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2 font-mono">
            <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5" />
                Concursos: {metadata?.totalDraws.toLocaleString('pt-BR')}
            </div>
            <span className="opacity-30">|</span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                isStale ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isStale ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                {freshnessLabel}
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Dashboard <span className="text-gradient-gold">Analítico</span>
          </h1>
          <p className="text-muted-foreground text-sm">Visualização em tempo real dos dados da Mega-Sena</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" /> Exportar JSON
          </Button>
          <Button variant="ghost" size="sm" onClick={refresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12"
      >
        <StatCard label="Total de concursos" value={metadata?.totalDraws.toLocaleString('pt-BR') || '0'} />
        <StatCard label="Sem ganhador" value={`${stats?.meta.pctWithoutWinner}%`} variant="hot" />
        <StatCard label="Total ganhadores" value={stats?.meta.totalJackpotWinners.toLocaleString('pt-BR') || '0'} variant="gold" />
        <StatCard
          label="Maior prêmio"
          value={`R$${((stats?.meta.highestPrize || 0) / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}M`}
          variant="gold"
        />
      </motion.div>

      {chapters.map((chapter, chapterIdx) => (
        <div key={chapter.id} className={chapterIdx > 0 ? 'mt-16' : ''}>
          <ChapterDivider
            icon={chapter.icon}
            title={chapter.title}
            description={chapter.description}
            lineClass={chapter.lineClass}
            iconColorClass={chapter.iconColorClass}
            index={chapterIdx}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapter.sections.map((s, sIdx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: chapterIdx * 0.1 + sIdx * 0.06 }}
                className={s.className}
              >
                <Card className="h-full glass-card border-primary/10 overflow-hidden flex flex-col">
                  <CardHeader className="p-5 pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <TypeBadge type={s.type} />
                        <CardTitle className="text-base font-display tracking-tight">{s.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">{s.subtitle}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary flex-shrink-0 cursor-pointer"
                      title={`${s.insight}\n\n${s.note || ''}`}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-5 flex-grow">
                    {s.component}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-16">
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
    </div>
  );
}
