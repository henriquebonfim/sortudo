import { useHotNumbers } from '@/hooks/use-analytics';
import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { useGames, useLotteryMeta } from '@/store/selectors';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

const TEMP_COLORS: Record<string, string> = {
  hot: CHART_COLORS.RED,
  warm: CHART_COLORS.AMBER,
  mild: '#EAB308', // Keep one intermediate for better gradient
  cool: CHART_COLORS.BLUE,
  cold: CHART_COLORS.SLATE,
};

function getTemperatureStyles(count: number) {
  if (count >= 4) return { backgroundColor: `${TEMP_COLORS.hot}e6`, color: 'white' };
  if (count >= 3) return { backgroundColor: `${TEMP_COLORS.warm}cc`, color: 'white' };
  if (count >= 2) return { backgroundColor: `${TEMP_COLORS.mild}80`, color: '#FEF9C3' };
  if (count >= 1) return { backgroundColor: `${TEMP_COLORS.cool}4d`, color: '#BFDBFE' };
  return { backgroundColor: `${TEMP_COLORS.cold}66`, color: '#94A3B8' };
}

const LEGEND_ITEMS = [
  { count: 4, label: '🔥 4+ vezes' },
  { count: 3, label: '3 vezes' },
  { count: 2, label: '2 vezes' },
  { count: 1, label: '1 vez' },
  { count: 0, label: '❄️ Ausente' },
];

const HotNumberBadge = memo(function HotNumberBadge({
  number,
  count,
  index,
}: {
  number: number;
  count: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ring-1`}
      style={getTemperatureStyles(count)}
    >
      <span className="font-mono font-bold text-sm tracking-tighter">
        {String(number).padStart(2, '0')}
      </span>
      <span className="text-[10px] opacity-75 leading-none">×{count}</span>
    </motion.div>
  );
});

const GridCell = memo(function GridCell({ num, count }: { num: number; count: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: num * 0.005 }}
      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-mono text-[10px] sm:text-xs font-medium ring-1 transition-all duration-200 hover:scale-110 cursor-default shadow-sm`}
      style={getTemperatureStyles(count)}
      title={`Nº ${num}: ${count > 1 ? 'vezes' : 'vez'} nos últimos 10 sorteios`}
    >
      {String(num).padStart(2, '0')}
    </motion.div>
  );
});

export function HotColdNumbersChart() {
  const meta = useLotteryMeta();
  const hotData = useHotNumbers();
  const recentGames = useGames();

  const allFreqs = useMemo(() => {
    const map: Record<number, number> = {};
    if (!hotData) return map;
    for (const h of hotData) {
      map[h.number] = h.frequency ?? 0;
    }
    return map;
  }, [hotData]);

  if (!meta || !hotData) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {hotData.slice(0, 5).map((h, i) => (
          <HotNumberBadge key={h.number} number={h.number} count={h.frequency ?? 0} index={i} />
        ))}
      </div>
      <div className="glass-card p-3 sm:p-4 overflow-hidden">
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 w-max mx-auto lg:w-full lg:grid-cols-10 lg:place-items-center">
          {Array.from({ length: 60 }, (_, i) => i + 1).map((num) => (
            <GridCell key={num} num={num} count={allFreqs[num] || 0} />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-muted-foreground">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded`} style={getTemperatureStyles(item.count)} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>{' '}
      <div className="pt-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Últimos 10 Sorteios
          </h4>
          <span className="text-[10px] text-muted-foreground/40 font-mono italic">
            Fonte dos dados acima
          </span>
        </div>
        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
          {recentGames
            .slice(-10)
            .reverse()
            .map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between group py-1 border-b border-border/20 last:border-0 hover:bg-primary/5 px-2 rounded-md transition-colors"
              >
                <span className="text-[10px] font-medium text-muted-foreground min-w-[32px]">
                  #{game.id}
                </span>
                <div className="flex gap-1.5">
                  {game.numbers.map((n) => (
                    <span
                      key={n}
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono transition-colors shadow-sm ring-1 ring-white/5"
                      style={getTemperatureStyles(allFreqs[n] || 0)}
                    >
                      {String(n).padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
