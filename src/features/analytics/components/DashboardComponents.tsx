import { InfographicType } from '@/features/analytics/configs/dashboard-config';
import { LoadingBalls } from '@/shared/components/LoadingBalls';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';

const TYPE_BADGE_COLORS: Record<InfographicType, string> = {
  'Estatístico': 'bg-info/15 text-info border-info/20',
  'Cronológico': 'bg-violet/15 text-violet border-violet/20',
  'Comparativo': 'bg-primary/15 text-primary border-primary/20',
  'Hierárquico': 'bg-primary/15 text-primary border-primary/20',
  'Geográfico': 'bg-success/15 text-success border-success/20',
  'Informacional': 'bg-muted/15 text-muted-foreground border-border',
  'Lista': 'bg-hot/15 text-hot border-hot/20',
  'Processo': 'bg-primary/15 text-primary border-primary/20',
};

export function TypeBadge({ type }: { type: InfographicType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${TYPE_BADGE_COLORS[type]}`}
    >
      {type}
    </span>
  );
}

interface ChapterProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  lineClass: string;
  iconColorClass: string;
  index: number;
}

export function ChapterDivider({
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

// ─── Analytics States ────────────────────────────────────────────────────────

export function AnalyticsLoading() {
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

export function AnalyticsEmpty() {
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

// ─── Navigation & KPIs ────────────────────────────────────────────────────────

interface ChapterNavProps {
  chapters: Array<{ id: string; title: string; icon: ReactNode }>;
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
}

export function ChapterNav({ chapters, currentChapterIndex, onChapterSelect }: ChapterNavProps) {
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

interface KpiCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  accentClass: string;
  valueClass: string;
  delay?: number;
}

export function KpiCard({ label, value, icon, accentClass, valueClass, delay = 0 }: KpiCardProps) {
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
        <p className={`font-mono text-2xl md:text-3xl font-bold tabular-nums tracking-tight ${valueClass}`}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}
