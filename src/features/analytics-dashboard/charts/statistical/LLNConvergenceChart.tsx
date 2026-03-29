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

export default function LLNConvergenceChart() {
  // Simulate the Law of Large Numbers by virtually "tossing a coin" thousands of times
  // Or in lottery terms, checking parity (Odd VS Even) which should perfect to 50%
  const chartData = useMemo(() => {
    const data = [];
    const oddHits = 0;
    
    // We simulate draws logarithmically to show the "flattening" effect
    // 10, 100, 1000, 10000, 100000 draws
    const drawIncrements = [
      ...Array.from({length: 100}, (_, i) => i + 1), // First 100 are tight to show initial volatility
      ...Array.from({length: 400}, (_, i) => 100 + i * 50), // Next step spacing
      ...Array.from({length: 500}, (_, i) => 20100 + i * 1000) // Huge spacing
    ];

    for (const drawCount of drawIncrements) {
      // For this sample size, simulate the actual # of odd hits
      // To simulate quickly, we just add normally distributed noise around 50%
      // Variance = n * p * (1-p) => std_dev = sqrt(n * 0.25)
      
      const expectedOdds = drawCount * 0.5;
      const stdDev = Math.sqrt(drawCount * 0.25);
      
      // Box-Muller transform for normal distribution simulation of noise
      let u = 0, v = 0;
      // eslint-disable-next-line react-hooks/purity
      while(u === 0) u = Math.random();
      // eslint-disable-next-line react-hooks/purity
      while(v === 0) v = Math.random();
      const noise = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      
      const syntheticOddHits = expectedOdds + (noise * stdDev);
      const runningPercentage = (syntheticOddHits / drawCount) * 100;
      
      data.push({
        draws: drawCount,
        displayDraws: drawCount < 1000 ? `${drawCount}` : `${(drawCount / 1000).toFixed(0)}k`,
        percentage: parseFloat(runningPercentage.toFixed(2))
      });
    }

    return data;
  }, []);

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 border-l-4 border-l-purple-500/50">
        <h3 className="text-xl font-bold mb-2 text-white">A Falácia do Apostador e a LGN</h3>
        <p className="text-sm text-slate-300 mb-6 max-w-2xl leading-relaxed">
          A Falácia do Apostador sugere que, se um número Ímpar sair 3 vezes seguidas, um número Par está "para sair". 
          <br /><br />
          A Lei dos Grandes Números (LGN) prova matematicamente que o ruído (grandes oscilações à esquerda) se estabiliza em um equilíbrio absoluto (a linha reta à direita). Números não têm memória. <strong>Ao longo de milhões de sorteios, um número "Quente" é apenas ruído estatístico sendo esmagado em uma linha horizontal perfeitamente uniforme.</strong>
        </p>
        
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ left: 10, right: 30, top: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} vertical={false} />
            <XAxis 
              dataKey="displayDraws" 
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: "monospace" }} 
              minTickGap={40}
              angle={-45}
              textAnchor="end"
              dy={15}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: "monospace" }} 
              domain={[30, 70]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px' }}
              labelStyle={{ color: '#94A3B8' }}
              itemStyle={{ color: '#A855F7', fontWeight: 'bold' }}
              formatter={(value: number) => [`${value}% Números Ímpares`, "Proporção Histórica"]}
            />
            <ReferenceLine y={50} stroke="#A855F7" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'Aleatoriedade Perfeita (50%)', fill: '#A855F7' }} />
            <Line 
              type="monotone" 
              dataKey="percentage" 
              stroke="#D8B4FE" 
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: "#D8B4FE" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
