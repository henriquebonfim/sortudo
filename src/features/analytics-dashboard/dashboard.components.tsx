import { motion } from "framer-motion";
import { InfographicType } from "@/features/analytics-dashboard/dashboard.config";

const TYPE_BADGE_COLORS: Record<InfographicType, string> = {
  Statistical: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Timeline: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Comparison: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  Hierarchical: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Geographic: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Informational: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  List: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  Process: "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

export function TypeBadge({ type }: { type: InfographicType }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${TYPE_BADGE_COLORS[type]}`}>
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

export function ChapterDivider({ icon, title, description, lineClass, iconColorClass, index }: ChapterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center gap-4 mb-6 mt-2"
    >
      <div className={`h-px flex-1 max-w-8 ${lineClass}`} />
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border glass-card cursor-default">
        <span className={iconColorClass}>{icon}</span>
        <span className="text-sm font-display font-semibold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground hidden sm:block">— {description}</span>
      </div>
      <div className={`h-px flex-1 ${lineClass} opacity-30`} />
    </motion.div>
  );
}
