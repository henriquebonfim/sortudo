import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { GeoDataPoint } from "../geo.types";
import { CHART_COLORS } from "@/components/lottery/chart.constants";

const REGIONS = [
  { name: "Sudeste", states: ["SP", "MG", "RJ", "ES"], color: CHART_COLORS.AMBER },
  { name: "Sul", states: ["PR", "RS", "SC"], color: CHART_COLORS.BLUE },
  { name: "Nordeste", states: ["BA", "PE", "CE", "PB", "MA", "RN", "AL", "SE", "PI"], color: CHART_COLORS.VIOLET },
  { name: "Centro-Oeste", states: ["GO", "MT", "MS", "DF"], color: CHART_COLORS.EMERALD },
  { name: "Norte", states: ["PA", "AM", "TO", "AC", "RR", "RO", "AP"], color: "#F97316" },
];


interface RegionSummaryProps {
  data: GeoDataPoint[];
}

export const RegionSummary = memo(function RegionSummary({ data }: RegionSummaryProps) {
  const regionTotals = useMemo(() => {
    const grandTotal = data.reduce((s, d) => s + d.total, 0) || 1;
    return REGIONS.map((r) => {
      const regionTotal = data
        .filter((d) => r.states.includes(d.state))
        .reduce((sum, d) => sum + d.total, 0);
      return {
        ...r,
        total: regionTotal,
        percentage: Math.round((regionTotal / grandTotal) * 1000) / 10,
      };
    }).sort((a, b) => b.total - a.total);
  }, [data]);

  return (
    <div className="grid grid-cols-5 gap-2 mb-4">
      {regionTotals.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="text-center p-2 rounded-lg border"
          style={{ borderColor: `${r.color}40`, backgroundColor: `${r.color}12` }}
        >
          <div className="font-mono font-bold text-sm" style={{ color: r.color }}>
            {r.percentage}%
          </div>
          <div className="text-[9px] text-muted-foreground leading-tight mt-0.5">
            {r.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
});
