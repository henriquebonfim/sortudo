import { useMemo } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { TOTAL_COMBINATIONS } from "@/domain/lottery/lottery.constants";
import { poissonProbability } from "@/domain/math/statistics";

export default function PoissonSplittingChart() {
  const chartData = useMemo(() => {
    const data = [];
    const jackpotOdds = TOTAL_COMBINATIONS; // 50,063,860
    
    // Simulate varying ticket sales from 2M to 250M tickets
    for (let sales = 2_000_000; sales <= 250_000_000; sales += 4_000_000) {
      const lambda = sales / jackpotOdds; // Expected winners
      
      const probZero = poissonProbability(lambda, 0);
      const probOne = poissonProbability(lambda, 1);
      const probMultiple = 1 - (probZero + probOne);
      
      data.push({
        sales: sales,
        displaySales: `${(sales / 1_000_000).toFixed(0)}M`,
        probZero: parseFloat((probZero * 100).toFixed(1)),
        probOne: parseFloat((probOne * 100).toFixed(1)),
        probMultiple: parseFloat((probMultiple * 100).toFixed(1)),
        lambda: lambda.toFixed(2)
      });
    }
    return data;
  }, []);

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 border-l-4 border-l-blue-500/50">
        <h3 className="text-xl font-bold mb-2 text-white font-display">O Risco de Divisão (Poisson)</h3>
        <p className="text-sm text-slate-300 mb-6 max-w-2xl leading-relaxed">
          À medida que as vendas de bilhetes (Eixo X) superam as combinações totais ({TOTAL_COMBINATIONS.toLocaleString()}), a probabilidade de você ser forçado a dividir o prêmio (área em <span className="text-amber-500 font-bold">Laranja</span>) dispara.
          <br /><br />
          Em sorteios como a <strong>Mega da Virada</strong>, onde as vendas frequentemente ultrapassam 150 milhões de bilhetes, ganhar sozinho é matematicamente quase impossível.
        </p>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ left: 10, right: 30, top: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.GRID_STROKE} vertical={false} />
            <XAxis 
              dataKey="displaySales" 
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: "monospace" }} 
              angle={-45}
              textAnchor="end"
              dy={15}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: CHART_COLORS.TICK_LABEL, fontFamily: "monospace" }} 
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
              itemStyle={{ fontSize: '12px', padding: '2px 0' }}
              labelStyle={{ color: '#94A3B8', marginBottom: '8px', fontWeight: 'bold' }}
              formatter={(value, name) => {
                if (name === "probMultiple") return [`${value}%`, "Dividindo (≥ 2 ganhadores)"];
                if (name === "probOne") return [`${value}%`, "Ganhador Único"];
                if (name === "probZero") return [`${value}%`, "Ninguém Ganha (Acumula)"];
                return [value, name];
              }}
            />
            
            <Area type="monotone" dataKey="probMultiple" fill={CHART_COLORS.AMBER} stroke="none" fillOpacity={0.4} />
            <Area type="monotone" dataKey="probOne" fill={CHART_COLORS.EMERALD} stroke="none" fillOpacity={0.6} stackId="1" />
            <Area type="monotone" dataKey="probZero" fill={CHART_COLORS.BLUE} stroke="none" fillOpacity={0.3} stackId="1" />
            
            <Line type="monotone" dataKey="probMultiple" stroke={CHART_COLORS.AMBER} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
