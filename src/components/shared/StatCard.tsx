import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  variant?: "default" | "hot" | "cold" | "gold";
}

const variantStyles = {
  default: "text-foreground",
  hot: "text-hot",
  cold: "text-cold",
  gold: "text-primary",
};

export function StatCard({ label, value, icon, variant = "default" }: StatCardProps) {
  return (
    <motion.div
      className="glass-card-hover p-4 md:p-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-primary">{icon}</span>}
        <span className="stat-label">{label}</span>
      </div>
      <p className={`stat-number ${variantStyles[variant]}`}>{value}</p>
    </motion.div>
  );
}
