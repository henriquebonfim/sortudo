import { motion } from "framer-motion";
import { spring } from "@/components/ui";
import {
  type StatCardProps,
  statCardVariantStyles,
} from "@/components/ui/types";

export function StatCard({
  label,
  value,
  icon,
  variant = "default",
  className,
  "aria-label": ariaLabel,
}: StatCardProps) {
  return (
    <motion.div
      role="region"
      aria-label={ariaLabel ?? `${label}: ${value}`}
      className={["glass-card-hover p-4 md:p-5", className].filter(Boolean).join(" ")}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={spring.standard}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-primary" aria-hidden="true">{icon}</span>}
        <span className="stat-label">{label}</span>
      </div>
      <p className={`stat-number ${statCardVariantStyles[variant]}`}>{value}</p>
    </motion.div>
  );
}

