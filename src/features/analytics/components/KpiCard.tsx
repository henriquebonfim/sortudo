import { motion } from 'framer-motion';

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accentClass: string; // gradient class for the top accent bar
  valueClass: string; // text color class for the value
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
      {/* Accent top bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${accentClass}`} />

      {/* Hover shimmer */}
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
        <p
          className={`font-mono text-2xl md:text-3xl font-bold tabular-nums tracking-tight ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}
