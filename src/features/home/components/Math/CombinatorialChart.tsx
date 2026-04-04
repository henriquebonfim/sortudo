import { TICKET_PRICE } from "@/domain/lottery/lottery.constants";
import { ComboEntry } from "@/domain/math/combinations.utils";
import { combinations } from "@/domain/math/combinations";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { fadeUp } from "../Common/shared-animations";

interface PayloadItem {
  payload: ComboEntry;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const { n, combos } = data;
    const cost = combos * TICKET_PRICE;

    const c60_k = combinations(60, n);
    const oddsSena = Math.round(c60_k / (combinations(6, 6) * combinations(54, n - 6)));
    const oddsQuina = Math.round(c60_k / (combinations(6, 5) * combinations(54, n - 5)));
    const oddsQuadra = Math.round(c60_k / (combinations(6, 4) * combinations(54, n - 4)));

    return (
      <div className="glass-card p-4 border border-border bg-background/95 backdrop-blur shadow-xl rounded-lg space-y-3">
        <p className="font-bold text-foreground">Escolhendo {label} de 20</p>
        
        <div className="space-y-0.5 border-b border-border/20 pb-3">
          <p className="text-sm text-primary">
            <span className="font-semibold">{combos.toLocaleString("pt-BR")}</span> Combinações
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            R$ {cost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="space-y-1.5 pt-1">
          <p className="text-xs text-muted-foreground flex justify-between gap-4">
            <span>Probabilidade Sena:</span> 
            <span className="font-semibold text-hot">1 em {oddsSena.toLocaleString("pt-BR")}</span>
          </p>
          <p className="text-xs text-muted-foreground flex justify-between gap-4">
            <span>Probabilidade Quina:</span> 
            <span className="font-semibold text-primary">1 em {oddsQuina.toLocaleString("pt-BR")}</span>
          </p>
          <p className="text-xs text-muted-foreground flex justify-between gap-4">
            <span>Probabilidade Quadra:</span> 
            <span className="font-semibold text-success">1 em {oddsQuadra.toLocaleString("pt-BR")}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function CombinatorialChart({ combosTable }: { combosTable: ComboEntry[] }) {
  return (
    <motion.div variants={fadeUp} className="glass-card p-5">
      <h3 className="font-display font-bold text-base text-foreground mb-1">
        C(n, 6): combinações por nº de dezenas escolhidas
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Mais números = mais combinações mas também mais custo
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={combosTable}>
          <defs>
            <linearGradient id="gradCombos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fill: "hsl(215 16% 47%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
            }
            tick={{ fill: "hsl(215 16% 47%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="combos"
            stroke="hsl(38 92% 50%)"
            fill="url(#gradCombos)"
            strokeWidth={2}
            dot={{ fill: "hsl(38 92% 50%)", r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
