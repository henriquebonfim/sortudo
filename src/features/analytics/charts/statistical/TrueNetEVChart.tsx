import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { RECHARTS_TOOLTIP_STYLE, RECHARTS_LABEL_STYLE } from "../chart-styles";
import { TOTAL_COMBINATIONS, TICKET_PRICE } from "@/domain/lottery/lottery.constants";
import { calculateTrueExpectedValue } from "@/domain/math";

export function TrueNetEVChart() {
  const chartData = useMemo(() => {
    const data = [];
    const ticketCost = TICKET_PRICE; // R$ 6,00 (standard Mega-Sena)
    const jackpotOdds = TOTAL_COMBINATIONS; // 50,063,860
    const secondaryPrizesEV = 1.20; // Average R$ from smaller prizes (Quina/Quadra)
    
    // Simulate jackpot growth from 2M to 150M
    for (let jackpot = 2_000_000; jackpot <= 200_000_000; jackpot += 5_000_000) {
      // Estimate tickets sold based on jackpot size (exponential hype curve)
      const ticketsSold = Math.min(250_000_000, Math.max(2_000_000, Math.pow(jackpot, 1.05) * 0.5)); 
      
      const ev = calculateTrueExpectedValue(
        ticketCost,
        jackpot,
        jackpotOdds,
        ticketsSold,
        secondaryPrizesEV
      );
      
      data.push({
        jackpot: jackpot,
        displayJackpot: `R$ ${(jackpot / 1_000_000).toFixed(0)}M`,
        ev: parseFloat(ev.toFixed(2)),
        ticketsSold: ticketsSold
      });
    }
    return data;
  }, []);

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 border-l-4 border-l-emerald-500/50">
        <h3 className="text-xl font-bold mb-2 text-white font-display">Expectativa de Valor Líquido (EV)</h3>
        <p className="text-sm text-slate-300 mb-6 max-w-2xl leading-relaxed">
          O Valor Esperado (EV) calcula quanto você ganha ou perde em média por aposta.
          Devido ao risco de divisão do prêmio e impostos, <strong>na Mega-Sena o EV é quase sempre negativo.</strong>
          <br /><br />
          Mesmo em jackpots astronômicos, o aumento exponencial de jogadores destrói a rentabilidade teórica, mantendo o "lucro esperado" abaixo de zero.
        </p>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ left: 10, right: 30, top: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} vertical={false} />
            <XAxis 
              dataKey="displayJackpot" 
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: "monospace" }} 
              angle={-45}
              textAnchor="end"
              dy={15}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: "monospace" }} 
              domain={[-6, 1]}
              tickFormatter={(val) => `R$${val.toFixed(1)}`}
            />
            
            <Tooltip
              contentStyle={RECHARTS_TOOLTIP_STYLE}
              itemStyle={{ color: CHART_COLORS.EMERALD, fontWeight: 'bold', fontSize: '13px' }}
              formatter={(value: number) => [`R$ ${value}`, "EV Estimado"]}
              labelStyle={RECHARTS_LABEL_STYLE}
            />
            <ReferenceLine y={0} stroke={CHART_COLORS.RED} strokeWidth={2} strokeDasharray="4 4" label={{ position: 'top', value: 'Equilíbrio (R$ 0)', fill: CHART_COLORS.RED, fontSize: 12, fontWeight: 'bold' }} />
            <Line 
              type="monotone" 
              dataKey="ev" 
              stroke={CHART_COLORS.EMERALD} 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: CHART_COLORS.EMERALD, stroke: RECHARTS_TOOLTIP_STYLE.backgroundColor, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
