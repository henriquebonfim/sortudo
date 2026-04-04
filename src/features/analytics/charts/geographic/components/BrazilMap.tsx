import { memo, useMemo } from "react";
import { GeoDataPoint } from "../geo.types";
import { BRAZIL_STATES_PATH_DATA } from "../data/brazil-map-data";

interface BrazilMapProps {
  data: GeoDataPoint[];
}

export const BrazilMap = memo(function BrazilMap({ data }: BrazilMapProps) {
  const maxTotal = useMemo(() => Math.max(...data.map(d => d.total), 1), [data]);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto opacity-90 p-4">
      <svg viewBox="0 0 250 320" className="w-full h-full drop-shadow-2xl filter brightness-110">
        {/* Background base - Subtle Brazil outline represented by all states */}
        {Object.keys(BRAZIL_STATES_PATH_DATA).map((state) => (
          <path
            key={`base-${state}`}
            d={BRAZIL_STATES_PATH_DATA[state]}
            fill="rgba(255,255,255,0.02)"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        ))}
        
        {data.map((d) => {
          const path = BRAZIL_STATES_PATH_DATA[d.state];
          if (!path) return null;
          
          const intensity = d.total / maxTotal;
          const isDF = d.state === 'DF';
          
          return (
            <path
              key={d.state}
              d={path}
              fill={`rgba(var(--primary-rgb), ${0.15 + intensity * 0.85})`}
              stroke={isDF ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"}
              strokeWidth={isDF ? "1" : "0.5"}
              className="transition-all duration-300 hover:fill-primary cursor-pointer"
            >
              <title>{`${d.state}: ${d.total} ganhadores (${d.percentage}%)`}</title>
            </path>
          );
        })}
      </svg>
      <div className="absolute bottom-0 right-0 p-2 text-[9px] text-muted-foreground uppercase tracking-widest bg-black/40 backdrop-blur-sm rounded">
        Mapa de Densidade
      </div>
    </div>
  );
});
