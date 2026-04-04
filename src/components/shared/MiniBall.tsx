import { useLotteryStore } from '@/application/useLotteryStore';
import { cn, getBallColor } from '@/lib';

interface MiniBallProps {
  number: number;
  className?: string;
}

export function MiniBall({ number, className }: MiniBallProps) {
  const stats = useLotteryStore(s => s.stats);
  
  // Default style (loading or neutral)
  let ballColor = '#2d3436'; // Dark grey
  let shadowColor = 'rgba(0,0,0,0.3)';

  if (stats?.frequencies) {
    const { frequencies, min, max } = stats.frequencies;
    const freq = frequencies[String(number)] || 0;
    
    // getBallColor returns an rgb() string based on frequency "temperature"
    ballColor = getBallColor(freq, min.frequency, max.frequency);
    shadowColor = `${ballColor.replace('rgb', 'rgba').replace(')', ', 0.4)')}`;
  }
  
  return (
    <div 
      className={cn(
        "w-12 h-12 text-sm sm:w-16 sm:h-16 sm:text-lg flex items-center justify-center rounded-full font-display font-bold shadow-2xl relative group/ball transition-transform hover:scale-110",
        className
      )}
      style={{ 
        background: `radial-gradient(circle at 30% 30%, ${ballColor}, ${ballColor})`, // Simple gradient for now
        // A more complex 3D effect would need a darker version of ballColor for the bottom
        // But getBallColor already gives us a good base
        boxShadow: `0 10px 20px -5px ${shadowColor}`,
        color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {/* 3D Highlight Overlay (The "Glass" over the color) */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/20 via-transparent to-white/30 pointer-events-none" />
      
      <span className="relative drop-shadow-md">
        {String(number).padStart(2, '0')}
      </span>
      
      {/* Glow on hover */}
      <div className="absolute inset-[-1px] rounded-full bg-white/0 group-hover/ball:bg-white/10 transition-colors pointer-events-none" />
    </div>
  );
}
