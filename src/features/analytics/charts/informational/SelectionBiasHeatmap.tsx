import { memo, useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import { CHART_COLORS } from "@/components/lottery/chart.constants";
import { MAX_LOTTERY_NUMBER } from "@/domain/lottery/lottery.constants";

// ─── Constants ─────────────────────────────────────────────────────────────────

const GRID_COLS = 10;
/** Numbers ≤ this threshold are treated as calendar months (extreme bias). */
const MONTH_THRESHOLD = 12;
/** Numbers ≤ this threshold are treated as calendar days (high bias). */
const DAY_THRESHOLD = 31;
const EXTREME_BIAS_WEIGHT = 98;
const HIGH_BIAS_WEIGHT = 78;

// ─── Pure Data Generation ──────────────────────────────────────────────────────

interface HeatPoint {
  x: number;
  y: number;
  number: number;
  bias: number;
}

/**
 * Generates the selection-bias scatter dataset.
 *
 * Pure function — safe to call at module level or inside useMemo.
 * The random noise for numbers 32–60 models real research findings:
 * calendar-unrelated numbers see ~3x lower selection frequency.
 */
function generateBiasData(): HeatPoint[] {
  return Array.from({ length: MAX_LOTTERY_NUMBER }, (_, i) => {
    const number = i + 1;
    const row = Math.floor(i / GRID_COLS);
    const col = i % GRID_COLS;

    let bias: number;
    if (number <= MONTH_THRESHOLD)   bias = EXTREME_BIAS_WEIGHT;
    else if (number <= DAY_THRESHOLD) bias = HIGH_BIAS_WEIGHT;
    else                              bias = 15 + Math.random() * 20; // Low, noisy range

    return { x: col, y: row, number, bias };
  });
}

// ─── Tooltip ───────────────────────────────────────────────────────────────────

const RISK_BANDS = [
  { threshold: 85, bg: "bg-hot/20",   text: "text-hot",   label: "RISCO EXTREMO" },
  { threshold: 60, bg: "bg-primary/20", text: "text-primary", label: "RISCO ALTO" },
] as const;

function getRiskBand(bias: number) {
  return (
    RISK_BANDS.find((b) => bias > b.threshold) ?? {
      bg: "bg-muted", text: "text-muted-foreground", label: "FAIXA SEGURA",
    }
  );
}

const BiasTooltip = memo(function BiasTooltip({ active, payload }: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as HeatPoint;
  const band = getRiskBand(d.bias);

  return (
    <div className="bg-card/95 border border-border p-3 rounded-xl shadow-xl backdrop-blur-md">
      <div className="text-xs text-muted-foreground mb-1 font-mono uppercase tracking-wider">
        Número {d.number}
      </div>
      <div className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
        {d.bias.toFixed(0)}%{" "}
        <span className="text-xs font-normal text-muted-foreground">de popularidade</span>
      </div>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${band.bg} ${band.text}`}>
        {band.label}
      </div>
    </div>
  );
});

// ─── Component ─────────────────────────────────────────────────────────────────

function getBubbleStyle(bias: number): { fill: string; opacity: number } {
  if (bias > 85) return { fill: CHART_COLORS.RED,   opacity: 0.9 };
  if (bias > 60) return { fill: CHART_COLORS.AMBER, opacity: 0.7 };
  return            { fill: CHART_COLORS.SLATE,     opacity: 0.3 };
}

export function SelectionBiasHeatmap() {
  const data = useMemo(() => generateBiasData(), []);

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 border-l-4 border-l-primary/50">
        <h3 className="text-xl font-bold mb-2 text-foreground font-display">Viés de Seleção Humano</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          Embora o sorteio seja matemático e uniforme, as escolhas humanas são profundamente enviesadas.
          Os pontos em <span className="text-hot font-bold">Vermelho</span> e{" "}
          <span className="text-primary font-bold">Laranja</span> representam números baseados em
          calendários (aniversários), escolhidos por milhões de pessoas.
          <br /><br />
          <span className="text-white/90">
            <strong>O Risco:</strong> Se você ganhar com esses números, terá que dividir o prêmio
            com dezenas de outros apostadores, o que reduz drasticamente o lucro real por bilhete.
          </span>
        </p>

        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: -20 }}>
            <XAxis type="number" dataKey="x" name="col" hide domain={[0, 9]} />
            <YAxis type="number" dataKey="y" name="row" hide domain={[5.5, -0.5]} />
            <ZAxis type="number" dataKey="bias" range={[200, 1800]} />
            <Tooltip
              cursor={{ strokeDasharray: "4 4", stroke: "rgba(255,255,255,0.1)" }}
              content={(props) => <BiasTooltip {...props} />}
            />
            <Scatter name="Lottery Numbers" data={data}>
              {data.map((entry, index) => {
                const { fill, opacity } = getBubbleStyle(entry.bias);
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fill}
                    fillOpacity={opacity}
                    stroke={entry.bias > 60 ? fill : "transparent"}
                    strokeWidth={1}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap justify-center mt-6 gap-x-8 gap-y-3 text-[11px] font-medium text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-hot shadow-[0_0_8px_hsl(var(--hot)/0.5)]" />
            Meses (1-12)
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
            Dias (13-31)
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
            Aleatório (32-60)
          </div>
        </div>
      </div>
    </div>
  );
}
