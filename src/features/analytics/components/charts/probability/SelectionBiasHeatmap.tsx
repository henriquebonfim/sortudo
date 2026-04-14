import { CHART_COLORS } from '@/shared/styles/chart-colors';
import { formatDecimal } from '@/shared/utils';
import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';

interface HeatPoint {
  x: number;
  y: number;
  number: number;
  bias: number;
}

/**
 * Generates data for selection bias heatmap.
 */
function generateBiasData(): HeatPoint[] {
  const data: HeatPoint[] = [];
  for (let i = 0; i < 60; i++) {
    const num = i + 1;
    let baseBias = 20; // Default for 32-60
    if (num <= 12)
      baseBias = 85; // Months
    else if (num <= 31) baseBias = 60; // Days

    // Add controlled jitter to keep it within the intended visual band mostly
    const bias = baseBias + Math.random() * 14;

    data.push({
      x: i % 10,
      y: Math.floor(i / 10),
      number: num,
      bias: formatDecimal(bias, 0),
    });
  }
  return data;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function getBiasStyles(bias: number) {
  // Red: Months (1-12)
  if (bias >= 85)
    return {
      backgroundColor: `${CHART_COLORS.RED}e6`,
      color: 'white',
      boxShadow: `inset 0 0 0 1px ${CHART_COLORS.RED}`,
    };
  // Amber: Days (13-31)
  if (bias >= 60)
    return {
      backgroundColor: `${CHART_COLORS.AMBER}cc`,
      color: 'white',
      boxShadow: `inset 0 0 0 1px ${CHART_COLORS.AMBER}`,
    };
  // Default: Random (32-60)
  return {
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.4)',
    boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.1)`,
  };
}

const GridCell = memo(function GridCell({ num, bias }: { num: number; bias: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: num * 0.005 }}
      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-mono text-[10px] sm:text-xs font-medium transition-all duration-200 hover:scale-110 cursor-default shadow-sm`}
      style={getBiasStyles(bias)}
      title={`Nº ${num}: ${bias.toFixed(0)}% de popularidade`}
    >
      {String(num).padStart(2, '0')}
    </motion.div>
  );
});

// ─── Component ─────────────────────────────────────────────────────────────────

export function SelectionBiasHeatmap() {
  const data = useMemo(() => generateBiasData(), []);

  const biasMap = useMemo(() => {
    const map: Record<number, number> = {};
    data.forEach((d) => {
      map[d.number] = d.bias;
    });
    return map;
  }, [data]);

  return (
    <div className="space-y-6 flex flex-col content-between items-center justify-between">
      <div className=" p-6  border-t-4 border-t-primary/50">
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          Embora o sorteio seja matemático e uniforme, as escolhas humanas são profundamente
          enviesadas. Os pontos em <span className="text-hot font-bold">Vermelho</span> e{' '}
          <span className="text-primary font-bold">Laranja</span> representam números baseados em
          calendários (aniversários), escolhidos por milhões de pessoas.
        </p>
      </div>
      <div className="glass-card p-3  overflow-hidden bg-black/20 border border-white/5">
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 w-max mx-auto lg:w-full lg:grid-cols-10 lg:place-items-center">
          {Array.from({ length: 60 }, (_, i) => i + 1).map((num) => (
            <GridCell key={num} num={num} bias={biasMap[num] || 0} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center mt-6 gap-x-8 gap-y-3 text-[11px] font-medium text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-hot shadow-[0_0_8px_hsl(var(--hot)/0.5)]" />
          Alta Popularidade (1-12)
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
          Popularidade Média (13-31)
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
          Baixa Popularidade (32-60)
        </div>
      </div>
    </div>
  );
}
