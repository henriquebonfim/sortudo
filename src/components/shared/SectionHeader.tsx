import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string | ReactNode;
  icon?: ReactNode;
  subtitle?: string;
  className?: string;
}

/**
 * Standardized header component for section titles across the scrollytelling flow.
 */
export function SectionHeader({ title, icon, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        {icon ? (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-sm font-mono">*</span>
          </div>
        )}
        <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground tracking-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
