import { motion } from 'framer-motion';
import { getBallColor } from '@/lib/ball-color';

interface FreqStat {
  mean: number;
  min: { frequency: number };
  max: { frequency: number };
  frequencies: Record<string, number>;
}

interface BallDisplayProps {
  displayNums: number[];
  shuffling: boolean;
  freq: FreqStat | null | undefined;
}

export function BallDisplay({ displayNums, shuffling, freq }: BallDisplayProps) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      {displayNums.map((num, idx) => {
        const color = freq && num > 0
          ? getBallColor(
              freq.frequencies[String(num)] ?? freq.mean,
              freq.min.frequency,
              freq.max.frequency
            )
          : 'hsl(var(--muted))';
          
        return (
          <motion.div
            key={idx}
            animate={shuffling ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.15, repeat: shuffling ? Infinity : 0 }}
            className="ball-shadow flex h-16 w-16 items-center justify-center rounded-full font-mono text-xl font-bold text-foreground sm:h-20 sm:w-20 sm:text-2xl"
            style={{ background: color, color: '#fff' }}
          >
            {num > 0 ? String(num).padStart(2, '0') : '--'}
          </motion.div>
        );
      })}
    </div>
  );
}
