import { useHotNumbers, useLotteryMeta } from "@/application/selectors";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";

const TEMP_COLORS: Record<string, string> = {
  hot: CHART_COLORS.RED,
  warm: CHART_COLORS.AMBER,
  mild: "#EAB308", // Keep one intermediate for better gradient
  cool: CHART_COLORS.BLUE,
  cold: CHART_COLORS.SLATE,
};

function getTemperatureStyles(count: number) {
  if (count >= 4) return { backgroundColor: `${TEMP_COLORS.hot}e6`, color: "white" };
  if (count >= 3) return { backgroundColor: `${TEMP_COLORS.warm}cc`, color: "white" };
  if (count >= 2) return { backgroundColor: `${TEMP_COLORS.mild}80`, color: "#FEF9C3" };
  if (count >= 1) return { backgroundColor: `${TEMP_COLORS.cool}4d`, color: "#BFDBFE" };
  return { backgroundColor: `${TEMP_COLORS.cold}66`, color: "#94A3B8" };
}

const LEGEND_ITEMS = [
  { count: 4, label: "🔥 4+ vezes" },
  { count: 3, label: "3 vezes" },
  { count: 2, label: "2 vezes" },
  { count: 1, label: "1 vez" },
  { count: 0, label: "❄️ Ausente" },
];

const GRID_STRUCTURE: number[][] = Array.from({ length: 6 }, (_, rowIndex) =>
  Array.from({ length: 10 }, (_, colIndex) => rowIndex * 10 + colIndex + 1)
);

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
      <span className="font-mono font-bold text-sm">
        {String(number).padStart(2, "0")}
      </span>
      <span className="text-[10px] opacity-75">×{count}</span>
    </motion.div>
  );
});

const GridCell = memo(function GridCell({
  num,
  count,
}: {
  num: number;
  count: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: num * 0.008 }}
      className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-xs font-medium ring-1 transition-all duration-200 hover:scale-110 cursor-default`}
      style={getTemperatureStyles(count)}
      title={`Nº ${num}: ${count > 1 ? 'vezes' : 'vez'} nos últimos 10 sorteios`}
    >
      {String(num).padStart(2, "0")}
    </motion.div>
  );
});

export function HotColdNumbersChart() {
  const meta = useLotteryMeta();
  const hotData = useHotNumbers();

  const allFreqs = useMemo(() => {
    const map: Record<number, number> = {};
    if (!hotData) return map;
    for (const h of hotData) {
      map[h.number] = h.count;
    }
    return map;
  }, [hotData]);

  if (!meta || !hotData) {
    return <div className="h-64 animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {hotData.slice(0, 10).map((h, i) => (
          <HotNumberBadge key={h.number} number={h.number} count={h.count} index={i} />
        ))}
      </div>

      <div className="glass-card p-4">
        <div className="grid gap-1.5">
          {GRID_STRUCTURE.map((row, ri) => (
            <div key={ri} className="flex gap-1.5 justify-center">
              {row.map((num) => (
                <GridCell key={num} num={num} count={allFreqs[num] || 0} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className={`w-4 h-4 rounded`}
              style={getTemperatureStyles(item.count)}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
