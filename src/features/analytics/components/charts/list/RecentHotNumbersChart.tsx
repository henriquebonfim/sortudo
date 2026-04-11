import { useHotNumbers } from '@/features/analytics/hooks/use-analytics';
import { useLotteryMeta } from '@/store/selectors';
import { memo } from 'react';

const HotBadge = memo(function HotBadge({ number, count }: { number: number; count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/30 shadow-[0_0_10px_rgba(245,158,11,0.1)] transition-colors hover:bg-accent/30 cursor-default">
      {String(number).padStart(2, '0')} <span className="text-accent/70 font-mono">×{count}</span>
    </span>
  );
});

export function RecentHotNumbersChart() {
  const meta = useLotteryMeta();
  const hotData = useHotNumbers();

  if (!meta || !hotData) {
    return <div className="h-20 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {hotData.slice(0, 10).map((h) => (
        <HotBadge 
          key={h.number} 
          number={h.number} 
          count={h.frequency ?? (h as any).count ?? 0} 
        />
      ))}
    </div>
  );
}
