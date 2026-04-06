import { memo } from 'react';
import { motion } from 'framer-motion';

interface StatRingProps {
  value: number;
  label: string;
  color: string;
  size?: number;
}

export const StatRing = memo(function StatRing({ value, label, color, size = 72 }: StatRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - value / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.15)"
          strokeWidth={4}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="text-center -mt-12">
        <span className="font-mono font-bold text-sm text-foreground">{value}%</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-3 text-center leading-tight">{label}</p>
    </div>
  );
});
