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

// ─── Pure Simulation Logic ─────────────────────────────────────────────────────

interface LLNDataPoint {
  draws: number;
  displayDraws: string;
  percentage: number;
}

/**
 * Generates LLN convergence simulation data using the Box-Muller transform
 * to model binomial variance around a 50% expectation.
 *
 * Pure function — safe to call outside the component lifecycle.
 * Uses Math.random() intentionally; results vary per render by design.
 */
function generateLLNData(): LLNDataPoint[] {
  const drawIncrements = [
    ...Array.from({ length: 100 }, (_, i) => i + 1),          // 1–100: tight, shows initial volatility
    ...Array.from({ length: 400 }, (_, i) => 100 + i * 50),   // 150–20050: medium spacing
    ...Array.from({ length: 500 }, (_, i) => 20100 + i * 1000), // 21100+: large spacing
  ];

  return drawIncrements.map((drawCount) => {
    const expectedOdds = drawCount * 0.5;
    const stdDev = Math.sqrt(drawCount * 0.25);

    // Box-Muller transform for a normal distribution sample
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const noise = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    const syntheticOddHits = expectedOdds + noise * stdDev;
    const percentage = parseFloat(((syntheticOddHits / drawCount) * 100).toFixed(2));

    return {
      draws: drawCount,
      displayDraws: drawCount < 1000 ? `${drawCount}` : `${(drawCount / 1000).toFixed(0)}k`,
      percentage,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LLNConvergenceChart() {
  // Data is computed once on mount — rerenders don't regenerate new random data.
  const chartData = useMemo(() => generateLLNData(), []);

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 border-l-4 border-l-violet-500/50">
        <h3 className="text-xl font-bold mb-2 text-foreground">A Falácia do Apostador e a LGN</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          A Falácia do Apostador sugere que, se um número Ímpar sair 3 vezes seguidas, um número Par está "para sair".{" "}
          <br /><br />
          A Lei dos Grandes Números (LGN) prova matematicamente que o ruído (grandes oscilações à esquerda) se estabiliza
          em um equilíbrio absoluto (a linha reta à direita). Números não têm memória.{" "}
          <strong>Ao longo de milhões de sorteios, um número "Quente" é apenas ruído estatístico sendo esmagado em uma linha horizontal perfeitamente uniforme.</strong>
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
              contentStyle={RECHARTS_TOOLTIP_STYLE}
              labelStyle={RECHARTS_LABEL_STYLE}
              itemStyle={{ color: CHART_COLORS.VIOLET, fontWeight: "bold" }}
              formatter={(value: number) => [`${value}% Números Ímpares`, "Proporção Histórica"]}
            />
            <ReferenceLine
              y={50}
              stroke={CHART_COLORS.VIOLET}
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: "Aleatoriedade Perfeita (50%)", fill: CHART_COLORS.VIOLET }}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke={CHART_COLORS.BLUE}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: CHART_COLORS.BLUE }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
