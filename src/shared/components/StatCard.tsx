import { cn } from '@/shared/utils/cn';
import { spring } from '@/shared/utils/motion';
import { motion } from 'framer-motion';
import { statCardVariantStyles, StatCardVariant } from './StatCard.variants';

export interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  variant?: StatCardVariant;
  className?: string;
  'aria-label'?: string;
}

/**
 * StatCard Molecule — Display statistical numbers with labels and icons.
 */
export function StatCard({
  label,
  value,
  icon,
  variant = 'default',
  className,
  'aria-label': ariaLabel,
}: StatCardProps) {
  return (
    <motion.div
      role="region"
      aria-label={ariaLabel ?? `${label}: ${value}`}
      className={cn('glass-card-hover p-4 md:p-5', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={spring.standard}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && (
          <span className="text-primary" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="stat-label">{label}</span>
      </div>
      <p className={cn('stat-number', statCardVariantStyles[variant])}>{value}</p>
    </motion.div>
  );
}
