import { InfographicType } from "@/features/analytics/dashboard.config";
import { motion } from "framer-motion";

const TYPE_BADGE_COLORS: Record<InfographicType, string> = {
  Statistical: "bg-info/15 text-info border-info/20",
  Timeline: "bg-violet/15 text-violet border-violet/20",
  Comparison: "bg-primary/15 text-primary border-primary/20",
  Hierarchical: "bg-primary/15 text-primary border-primary/20",
  Geographic: "bg-success/15 text-success border-success/20",
  Informational: "bg-muted/15 text-muted-foreground border-border",
  List: "bg-hot/15 text-hot border-hot/20",
  Process: "bg-primary/15 text-primary border-primary/20",
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
/**
 * Higher-order component wrapper for chart entry animations.
 * USAGE: Wrap chart contents with <ChartFadeIn staggerIndex={i}>
 */
export function ChartFadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 1.11, 0.81, 0.99]
      }}
    >
      {children}
    </motion.div>
  );
}
