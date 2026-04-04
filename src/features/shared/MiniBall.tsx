import { useLotteryStore } from '@/application/useLotteryStore';
import { cn, getBallColor } from '@/lib';

interface MiniBallProps {
  number: number;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  dimmed?: boolean;
}

const sizes = {
  xs: "w-7 h-7 text-[10px]",
  sm: "w-9 h-9 text-xs",
  md: "w-12 h-12 text-sm sm:w-14 sm:h-14 sm:text-base",
  lg: "w-14 h-14 text-base sm:w-18 sm:h-18 sm:text-xl",
};

export function MiniBall({ number, className, size = 'md', dimmed = false }: MiniBallProps) {
  const stats = useLotteryStore(s => s.stats);

  // Default style (loading or neutral)
  let ballColor = '#2d3436'; // Dark grey
  let shadowColor = 'rgba(0,0,0,0.3)';

  if (stats?.frequencies) {
    const { frequencies, min, max } = stats.frequencies;
    const freq = frequencies[String(number)] || 0;

    ballColor = getBallColor(freq, min.frequency, max.frequency);
    shadowColor = `${ballColor.replace('rgb', 'rgba').replace(')', ', 0.4)')}`;
  }

  return (
    <div
      key={number}
      title={number.toString()}
      className={cn(
        "flex items-center justify-center rounded-full font-display font-bold relative group/ball transition-all duration-300 shrink-0",
        sizes[size],
        dimmed 
          ? "opacity-30 grayscale blur-[0.5px] scale-90 hover:opacity-100 hover:grayscale-0 hover:blur-0 hover:scale-110 hover:z-10 cursor-help" 
          : "shadow-xl hover:scale-110 z-0",
        className
      )}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${ballColor}, ${ballColor})`,
        boxShadow: !dimmed ? (size === 'xs' ? `0 4px 8px -2px ${shadowColor}` : `0 10px 20px -5px ${shadowColor}`) : undefined,
        color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/20 via-transparent to-white/30 pointer-events-none" />

      <span className="relative drop-shadow-md pointer-events-none">
        {String(number).padStart(2, '0')}
      </span>

      {/* Hover Reveal Overlay (For dimmed state only) */}
      {dimmed && (
        <div 
          className="absolute inset-[0] rounded-full opacity-0 group-hover/ball:opacity-100 transition-opacity duration-300"
          style={{ 
            boxShadow: size === 'xs' ? `0 4px 10px -2px ${shadowColor}` : `0 12px 24px -6px ${shadowColor}`,
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        />
      )}
      
      {/* Interaction glow */}
      <div className="absolute inset-[-1px] rounded-full bg-white/0 group-hover/ball:bg-white/10 transition-colors pointer-events-none" />
    </div>
  );
}
