import { useMemo } from "react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { MAX_LOTTERY_NUMBER } from "@/domain/lottery/lottery.constants";

export default function SelectionBiasHeatmap() {
  const data = useMemo(() => {
    // Generate an artificial heatmap for Mega-Sena (60 numbers)
    // where numbers 1-31 (calendar days/months) are heavily biased by human players.
    const heatData = [];
    const maxCols = 10;
    const numBalls = MAX_LOTTERY_NUMBER; // 60

    for (let i = 1; i <= numBalls; i++) {
      const row = Math.floor((i - 1) / maxCols);
      const col = (i - 1) % maxCols;

      // Artificial bias generation based on research
      // 1-12 (Months): extreme bias
      // 13-31 (Days): high bias
      // 32-60 (Math random): lowest bias
      let biasWeight: number;
      if (i <= 12) biasWeight = 98; // Peak bias
      else if (i <= 31) biasWeight = 78; // High bias
      // eslint-disable-next-line react-hooks/purity
      else biasWeight = 15 + Math.random() * 20;

      heatData.push({
        x: col,
        y: row,
        number: i,
        bias: biasWeight,
      });
    }
    return heatData;
  }, []);

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 border-l-4 border-l-amber-500/50">
        <h3 className="text-xl font-bold mb-2 text-white font-display">Viés de Seleção Humano</h3>
        <p className="text-sm text-slate-300 mb-6 max-w-2xl leading-relaxed">
          Embora o sorteio seja matemático e uniforme, as escolhas humanas são profundamente enviesadas.
          Os pontos em <span className="text-red-400 font-bold">Vermelho</span> e <span className="text-amber-400 font-bold">Laranja</span> representam números baseados em calendários (aniversários), escolhidos por milhões de pessoas.
          <br /><br />
          <span className="text-white/90">
            <strong>O Risco:</strong> Se você ganhar com esses números, terá que dividir o prêmio com dezenas de outros apostadores, o que reduz drasticamente o lucro real por bilhete.
          </span>
        </p>

        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: -20 }}>
            <XAxis type="number" dataKey="x" name="col" hide domain={[0, 9]} />
            <YAxis type="number" dataKey="y" name="row" hide domain={[5.5, -0.5]} />
            <ZAxis type="number" dataKey="bias" range={[200, 1800]} />
            <Tooltip
              cursor={{ strokeDasharray: '4 4', stroke: 'rgba(255,255,255,0.1)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                      <div className="text-xs text-slate-400 mb-1 font-mono uppercase tracking-wider">Número {d.number}</div>
                      <div className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        {d.bias.toFixed(0)}% <span className="text-xs font-normal text-slate-400">de popularidade</span>
                      </div>
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${
                        d.bias > 85 ? 'bg-red-500/20 text-red-400' : 
                        d.bias > 60 ? 'bg-amber-500/20 text-amber-400' : 
                        'bg-slate-800 text-slate-500'
                      }`}>
                        {d.bias > 85 ? 'RISCO EXTREMO' : d.bias > 60 ? 'RISCO ALTO' : 'FAIXA SEGURA'}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Lottery Numbers" data={data}>
              {data.map((entry, index) => {
                let fill = CHART_COLORS.SLATE; // Cold/Unbiased
                let opacity = 0.3;
                if (entry.bias > 85) {
                  fill = CHART_COLORS.RED;
                  opacity = 0.9;
                } else if (entry.bias > 60) {
                  fill = CHART_COLORS.AMBER;
                  opacity = 0.7;
                }

                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={fill} 
                    fillOpacity={opacity}
                    stroke={entry.bias > 60 ? fill : 'transparent'}
                    strokeWidth={1}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        <div className="flex flex-wrap justify-center mt-6 gap-x-8 gap-y-3 text-[11px] font-medium text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> 
            Meses (1-12)
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" /> 
            Dias (13-31)
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" /> 
            Aleatório (32-60)
          </div>
        </div>
      </div>
    </div>
  );
}
