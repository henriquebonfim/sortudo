import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";

const flowData = [
  { name: "Prêmios", value: 43, color: "hsl(142, 71%, 45%)" },
  { name: "Governo / Programas Sociais", value: 37, color: "hsl(38, 92%, 50%)" },
  { name: "Seguridade Social", value: 18, color: "hsl(217, 91%, 60%)" },
  { name: "Custos Operacionais", value: 2, color: "hsl(215, 16%, 47%)" },
];

const ANNUAL_REVENUE = 22_000_000_000;

export default function MoneyFlow() {
  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  return (
    <div className="container py-20 md:py-28 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading mb-2">📊 Para Onde Vai o Dinheiro</h1>
        <p className="section-subheading mb-12">
          Transparência total sobre a destinação dos R$22 bilhões anuais em loterias.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Donut */}
        <div className="glass-card p-6">
          <h2 className="font-display font-bold text-lg mb-4 text-foreground">Distribuição da arrecadação</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={flowData}
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {flowData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(240, 25%, 12%)",
                  border: "1px solid hsl(38 92% 50% / 0.3)",
                  borderRadius: 8,
                  backdropFilter: "blur(8px)",
                  fontFamily: "JetBrains Mono",
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => [
                  `${value}% (~${fmt(ANNUAL_REVENUE * value / 100)}/ano)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {flowData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Value breakdown */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-display font-bold text-lg mb-4 text-foreground">Valor esperado por aposta</h2>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Você aposta:</span>
                <span className="text-foreground font-bold">R$ 5,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prêmio esperado:</span>
                <span className="text-success font-bold">× R$ 2,15</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="text-muted-foreground">Perda esperada:</span>
                <span className="text-hot font-bold">= R$ 2,85 por aposta</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Retorno:</span>
                <span className="text-hot font-bold text-xl">-57% por aposta</span>
              </div>
            </div>
          </div>

          <div className="educational-box">
            <p className="text-sm text-muted-foreground">
              "A pior máquina de caça-níquel de Las Vegas devolve 75%. A Mega-Sena devolve 43%.
              É o pior 'investimento' que existe — mas com o melhor marketing."
            </p>
          </div>

          <div className="glass-card p-6">
            <p className="font-display font-bold text-foreground text-lg text-balance">
              "A Caixa Econômica Federal nunca perdeu dinheiro com loterias. O sistema é
              matematicamente perfeito — <span className="text-gradient-gold">para eles</span>."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
