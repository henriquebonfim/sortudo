import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Wallet, PiggyBank, BarChart3 } from "lucide-react";
import { calcularJurosCompostos } from "@/domain/math/compound-interest";
import {
  SELIC_RATE,
  POUPANCA_RATE,
  IBOVESPA_RATE,
  SALARIO_MINIMO,
  EQUIVALENCIAS,
} from "@/core/constants/lottery";

export default function LossCalculator() {
  const [anos, setAnos] = useState(10);
  const [vezes, setVezes] = useState(2);
  const [valor, setValor] = useState(5);
  const [calculated, setCalculated] = useState(false);

  const results = useMemo(() => {
    const totalApostado = anos * 52 * vezes * valor;
    const valorMensal = (vezes * valor * 52) / 12;
    const poupanca = calcularJurosCompostos(valorMensal, POUPANCA_RATE, anos);
    const tesouro = calcularJurosCompostos(valorMensal, SELIC_RATE, anos);
    const ibovespa = calcularJurosCompostos(valorMensal, IBOVESPA_RATE, anos);

    const equivs = EQUIVALENCIAS.map((e) => ({
      ...e,
      quantidade: Math.floor(totalApostado / e.valor),
    })).filter((e) => e.quantidade >= 1);

    const salarios = (totalApostado / SALARIO_MINIMO).toFixed(1);

    return { totalApostado, poupanca, tesouro, ibovespa, equivs, salarios };
  }, [anos, vezes, valor]);

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  const maxBar = Math.max(results.ibovespa, results.totalApostado);

  return (
    <div className="container py-20 md:py-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading mb-2">
          💸 Quanto eu já <span className="text-gradient-gold">perdi</span>?
        </h1>
        <p className="section-subheading mb-10">
          Descubra o custo real das suas apostas — e o que você poderia ter feito com esse dinheiro.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2 glass-card p-6 md:p-8 space-y-8 h-fit">
          <div>
            <label className="stat-label mb-3 block">Há quantos anos você joga?</label>
            <input
              type="range"
              min={1}
              max={40}
              value={anos}
              onChange={(e) => setAnos(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <span className="font-mono text-2xl font-bold text-foreground">{anos} anos</span>
          </div>

          <div>
            <label className="stat-label mb-3 block">Quantas vezes por semana?</label>
            <div className="flex gap-2">
              {[1, 2, 3, 5, 7].map((v) => (
                <button
                  key={v}
                  onClick={() => setVezes(v)}
                  className={`pill-btn ${vezes === v ? "pill-btn-active" : "pill-btn-inactive"}`}
                >
                  {v}x
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="stat-label mb-3 block">Valor médio por aposta</label>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 20, 50].map((v) => (
                <button
                  key={v}
                  onClick={() => setValor(v)}
                  className={`pill-btn ${valor === v ? "pill-btn-active" : "pill-btn-inactive"}`}
                >
                  R${v}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCalculated(true)}
            className="w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-display font-bold hover:bg-primary/90 transition-colors"
          >
            <TrendingDown className="inline mr-2 h-5 w-5" />
            Calcular minha perda
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {calculated ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Comparison bars */}
              <div className="glass-card p-6 md:p-8">
                <h2 className="font-display font-bold text-lg mb-6 text-foreground">
                  Se tivesse investido em vez de apostar:
                </h2>
                <div className="space-y-5">
                  {[
                    { label: "Mega-Sena", value: -results.totalApostado, icon: <Wallet className="h-4 w-4" />, negative: true },
                    { label: "Poupança (6,17% a.a.)", value: results.poupanca, icon: <PiggyBank className="h-4 w-4" />, negative: false },
                    { label: "Tesouro Selic (10,5% a.a.)", value: results.tesouro, icon: <BarChart3 className="h-4 w-4" />, negative: false },
                    { label: "IBOVESPA ETF (12% a.a.)", value: results.ibovespa, icon: <BarChart3 className="h-4 w-4" />, negative: false },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          {item.icon} {item.label}
                        </span>
                        <span className={`font-mono font-bold text-lg ${item.negative ? "text-hot" : "text-success"}`}>
                          {item.negative ? "−" : "+"} {fmt(Math.abs(item.value))}
                        </span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${item.negative ? "bg-hot" : "bg-success"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(Math.abs(item.value) / maxBar) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equivalencias */}
              <div className="glass-card p-6 md:p-8">
                <h2 className="font-display font-bold text-lg mb-4 text-foreground">
                  Você apostou o equivalente a:
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {results.equivs.map((e) => (
                    <div key={e.label} className="flex items-center gap-3 py-2">
                      <span className="text-2xl">{e.emoji}</span>
                      <div>
                        <span className="font-mono font-bold text-foreground">{e.quantidade}</span>
                        <span className="text-sm text-muted-foreground ml-1">{e.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Você jogou <span className="font-mono font-bold text-primary">{results.salarios}</span> salários mínimos
                    na Mega-Sena ao longo de {anos} anos.
                  </p>
                </div>
              </div>

              {/* Educational */}
              <div className="educational-box">
                <p className="text-sm text-muted-foreground">
                  "Não estamos dizendo pra parar. Só pra saber. Jogar pode ser divertido — desde que
                  você saiba que cada R$5 vira R$2,15 em expectativa de retorno. O resto é imposto disfarçado de sonho."
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-12 flex items-center justify-center">
              <div className="text-center">
                <p className="font-mono text-muted-foreground text-sm">
                  awaiting_input_<span className="animate-pulse">▊</span>
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Preencha os dados e clique em calcular
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
