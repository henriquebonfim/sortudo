import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import {
  RECHARTS_TOOLTIP_STYLE,
  RECHARTS_CURSOR_BAR,
  RECHARTS_LABEL_FOREGROUND,
} from "../chart-styles";
import { primitives } from "@/components/ui";

export function JackpotErosionWaterfall() {
  const chartData = useMemo(() => {
    const advertisedJackpot = 1_000_000_000; // 1 Billion Base Case
    
    // Roughly half the advertised annuity is in the cash pool
    const cashValue = advertisedJackpot * 0.48; 
    
    // Federal Tax (Highest bracket is 37%) - Note: mandatory initial withholding is 24% but ultimate tax is 37%
    const federalTax = cashValue * 0.37;
    
    // Average State Tax across US (let's say 6.5%, though some are 0 and some like NY are 10.9%)
    const stateTax = cashValue * 0.065;
    
    const trueTakeHome = cashValue - federalTax - stateTax;

    return [
      {
        name: "Prêmio Anunciado",
        value: advertisedJackpot,
        displayValue: "$1.0B",
        baseColor: primitives.color.chart.emerald,
      },
      {
        name: "Opção em Dinheiro (Valor Único)",
        value: cashValue,
        displayValue: `$${(cashValue / 1_000_000).toFixed(0)}M`,
        baseColor: "#059669", // darker emerald — no primitive yet
      },
      {
        name: "Impostos Federais (37%)",
        value: federalTax,
        displayValue: `-$${(federalTax / 1_000_000).toFixed(0)}M`,
        baseColor: primitives.color.chart.red,
      },
      {
        name: "Impostos Estaduais (Média 6,5%)",
        value: stateTax,
        displayValue: `-$${(stateTax / 1_000_000).toFixed(0)}M`,
        baseColor: "#F87171", // light red — no primitive yet
      },
      {
        name: "Valor Real Recebido (líquido)",
        value: trueTakeHome,
        displayValue: `$${(trueTakeHome / 1_000_000).toFixed(0)}M`,
        baseColor: primitives.color.chart.amber,
      },
    ];
  }, []);

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 border-l-4 border-l-emerald-500/50">
        <h3 className="text-xl font-bold mb-2 text-white">A Ilusão de $1 Bilhão</h3>
        <p className="text-sm text-slate-300 mb-6 max-w-2xl leading-relaxed">
          Os prêmios anunciados são baseados em anuidades de 30 anos. Se você optar pelo valor em dinheiro vivo (o que, matematicamente, você provavelmente deveria fazer), você perde instantaneamente ~52% do valor anunciado. E então vêm os impostos. 
          <br /><br />
          <strong>A Realidade:</strong> Aquele anúncio dizendo "1 BILHÃO DE DÓLARES!" representa, na verdade, um cheque de ~$300 milhões. Combine isso com o risco de Divisão (curva de Poisson), e o valor real cai ainda mais.
        </p>

        <ResponsiveContainer width="100%" height={380}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 60, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} horizontal={false} vertical={true} />
            <XAxis 
                type="number" 
                tickFormatter={(val) => `$${(val / 1_000_000).toFixed(0)}M`}
                tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: "monospace" }} 
                domain={[0, 1_000_000_000]}
            />
            <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12, fill: "#CBD5E1", fontWeight: "bold" }}
                width={160}
            />
            <Tooltip
              cursor={RECHARTS_CURSOR_BAR}
              contentStyle={RECHARTS_TOOLTIP_STYLE}
              itemStyle={{ color: RECHARTS_LABEL_FOREGROUND, fontWeight: 'bold' }}
              formatter={(value: number) => [`$${(value / 1_000_000).toFixed(0)} Milhões`, "Quantia"]}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={40}>
               {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.baseColor} fillOpacity={0.8} />
               ))}
               <LabelList
                 dataKey="displayValue"
                 position="right"
                 style={{ fill: RECHARTS_LABEL_FOREGROUND, fontSize: 13, fontWeight: 'bold', fontFamily: "monospace" }}
               />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
