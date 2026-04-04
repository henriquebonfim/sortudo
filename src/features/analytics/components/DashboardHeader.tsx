import { Button } from "@/components/layout/button";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Download, Lightbulb, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { ChapterNav } from "./ChapterNav";

interface DashboardHeaderProps {
  metadata: {
    totalDraws: number;
    lastUpdate: string;
  } | null;
  isStale: boolean;
  freshnessLabel: string | null;
  onExport: () => void;
  onRefresh: () => void;
  chapters: { id: string; title: string; icon: ReactNode }[];
}

export function DashboardHeader({
  metadata,
  isStale,
  freshnessLabel,
  onExport,
  onRefresh,
  chapters,
}: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-border">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 80% 50%, hsl(43 96% 56% / 0.05) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 10% 20%, hsl(217 91% 60% / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container relative py-10 md:py-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Left: Title block */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{metadata?.totalDraws.toLocaleString("pt-BR")} sorteios</span>
              </div>

              <span className="text-border/60">•</span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isStale ? "stale" : "fresh"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${isStale
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isStale ? "bg-rose-500" : "bg-emerald-500"}`} />
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
              onClick={onExport}
              className="gap-2 border-border/70 hover:border-primary/40 hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar JSON
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
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
              ...chapters.map((ch) => ({ id: ch.id, title: ch.title, icon: ch.icon })),
              { id: "next-steps", title: "Próximos Passos", icon: <Lightbulb className="w-3.5 h-3.5" /> },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
