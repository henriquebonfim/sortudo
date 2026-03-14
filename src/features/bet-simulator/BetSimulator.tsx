import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { simulateLife, type SimulationResult } from "@/domain/simulation/engine";
import { StatCard } from "@/components/shared/StatCard";
import confetti from "canvas-confetti";

export default function BetSimulator() {
  const [years, setYears] = useState(20);
  const [betsPerWeek, setBetsPerWeek] = useState(2);
  const [ticketPrice, setTicketPrice] = useState(5);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);

  const runSim = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      const r = simulateLife({ years, betsPerWeek, ticketPrice });
      setResult(r);
      setRunning(false);
      if (r.senas > 0) {
        confetti({ particleCount: 200, spread: 100 });
      }
    }, 300);
  }, [years, betsPerWeek, ticketPrice]);

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.history.map((h) => ({
      draw: h.draw,
      saldo: Math.round(h.balance),
    }));
  }, [result]);

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  return (
    <div className="container py-20 md:py-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading mb-2">
          🎰 Jogue a vida toda
        </h1>
        <p className="section-subheading mb-10">
          Simule décadas de apostas na Mega-Sena e veja seu dinheiro evaporar em tempo real.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Controls */}
        <div className="glass-card p-6 space-y-6 h-fit">
          <div>
            <label className="stat-label mb-2 block">Anos de simulação</label>
            <input type="range" min={1} max={50} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-primary" />
            <span className="font-mono text-xl font-bold text-foreground">{years} anos</span>
          </div>

          <div>
            <label className="stat-label mb-2 block">Apostas/semana</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 5, 7].map((v) => (
                <button key={v} onClick={() => setBetsPerWeek(v)} className={`pill-btn ${betsPerWeek === v ? "pill-btn-active" : "pill-btn-inactive"}`}>
                  {v}x
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="stat-label mb-2 block">Valor/aposta</label>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 20, 50].map((v) => (
                <button key={v} onClick={() => setTicketPrice(v)} className={`pill-btn ${ticketPrice === v ? "pill-btn-active" : "pill-btn-inactive"}`}>
                  R${v}
                </button>
              ))}
            </div>
          </div>

          <button onClick={runSim} disabled={running} className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-display font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {running ? (
              "Simulando..."
            ) : result ? (
              <><RotateCcw className="inline mr-2 h-4 w-4" />Simular novamente</>
            ) : (
              <><Play className="inline mr-2 h-4 w-4" />Desperdiçar {years} anos agora</>
            )}
          </button>
        </div>

        {/* Chart + results */}
        <div className="lg:col-span-3 space-y-6">
          {result ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Chart */}
              <div className="glass-card p-4 md:p-6">
                <h2 className="font-display font-bold text-lg mb-4 text-foreground">Saldo acumulado</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gradLoss" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(0 84% 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="draw" tick={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                      tick={{ fill: "hsl(215 16% 47%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(240 25% 12%)",
                        border: "1px solid hsl(38 92% 50% / 0.3)",
                        borderRadius: 8,
                        backdropFilter: "blur(8px)",
                        fontFamily: "JetBrains Mono",
                        fontSize: 12,
                      }}
                      formatter={(value: number) => [fmt(value), "Saldo"]}
                      labelFormatter={(l: number) => `Sorteio #${l}`}
                    />
                    <ReferenceLine y={0} stroke="hsl(0 84% 60%)" strokeDasharray="4 4" strokeOpacity={0.5} />
                    <Area type="monotone" dataKey="saldo" stroke="hsl(0 84% 60%)" fill="url(#gradLoss)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total apostado" value={fmt(result.totalSpent)} variant="hot" />
                <StatCard label="Total ganho" value={fmt(result.totalWon)} variant="gold" />
                <StatCard label="Saldo final" value={fmt(result.finalBalance)} variant={result.finalBalance < 0 ? "hot" : "gold"} />
                <StatCard label="Sorteios" value={result.totalDraws.toLocaleString("pt-BR")} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <StatCard label="Quadras" value={String(result.quadras)} variant="cold" />
                <StatCard label="Quinas" value={String(result.quinas)} variant="gold" />
                <StatCard label="Senas" value={String(result.senas)} variant={result.senas > 0 ? "gold" : "hot"} />
              </div>

              {/* Message */}
              <div className="educational-box">
                <p className="terminal-text">
                  {result.senas > 0
                    ? `🎉 Parabéns! Você ganhou a Sena ${result.senas}x... depois de perder ${fmt(result.totalSpent)}. A Caixa agradece.`
                    : `Você jogou ${years} anos e nunca fez 6 pontos. A Caixa agradece seus ${fmt(result.totalSpent)}.`}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-16 flex items-center justify-center">
              <div className="text-center">
                <p className="font-mono text-muted-foreground text-sm">
                  awaiting_simulation_<span className="animate-pulse">▊</span>
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Configure os parâmetros e clique em simular
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
