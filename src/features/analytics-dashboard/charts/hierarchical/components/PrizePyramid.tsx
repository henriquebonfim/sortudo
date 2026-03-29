import { motion } from "framer-motion";
import { TierData } from "../components/TierCard";
import { TIER_CONFIG } from "../prize-tier.constants";

interface PrizePyramidProps {
  sortedData: TierData[];
}

export function PrizePyramid({ sortedData }: PrizePyramidProps) {
  // Sort from Sena (top) to Quadra (bottom)
  const pyramidData = [...sortedData].reverse(); // Quadra, Quina, Sena

  return (
    <div className="relative flex flex-col items-center py-10 overflow-hidden">
      <div className="w-full max-w-[320px] flex flex-col items-center">
        {sortedData.map((tier, idx) => {
          const config = TIER_CONFIG[tier.tier];
          const widthClass = tier.tier === 'sena' ? 'w-1/3' : tier.tier === 'quina' ? 'w-2/3' : 'w-full';
          const delay = idx * 0.1;

          return (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay }}
              className={`relative ${widthClass} h-16 mb-2 flex flex-col items-center justify-center rounded-xl border group cursor-default`}
              style={{
                backgroundColor: `${config.barColor}15`,
                borderColor: `${config.barColor}30`,
              }}
            >
              <div 
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-t from-black/20"
                style={{ backgroundColor: config.barColor }}
              />
              <span className="text-[10px] uppercase tracking-wider font-bold mb-0.5" style={{ color: config.barColor }}>
                {tier.tier}
              </span>
              <span className="font-mono text-sm group-hover:scale-105 transition-transform duration-300">
                R$ {tier.avgPrize >= 1_000_000 ? `${(tier.avgPrize / 1_000_000).toFixed(1)}M` : tier.avgPrize.toLocaleString('pt-BR')}
              </span>
              
              {/* Connector lines (optional) */}
              {idx < sortedData.length - 1 && (
                <div 
                  className="absolute -bottom-2 left-1/2 w-px h-2 bg-border z-0"
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-4 italic">
        * Representação visual da concentração de prêmios por faixa de acerto
      </p>
    </div>
  );
}
