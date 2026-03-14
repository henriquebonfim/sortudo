import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TOTAL_COMBINATIONS } from "@/core/constants/lottery";

export default function TimeCounter() {
  const [betsPerWeek, setBetsPerWeek] = useState(3);

  const expectedYears = useMemo(() => Math.round(TOTAL_COMBINATIONS / betsPerWeek / 52), [betsPerWeek]);
  const universeAge = 13_800_000_000;
  const dinosaurs = 66_000_000;
  const humans = 300_000;
  const lifespan = 80;

  const lifetimeChance = useMemo(() => {
    const totalBets = betsPerWeek * 52 * lifespan;
    return ((totalBets / TOTAL_COMBINATIONS) * 100).toFixed(4);
  }, [betsPerWeek]);

  const fmt = (n: number) => n.toLocaleString("pt-BR");

  return (
    <div className="container py-20 md:py-28 max-w-3xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading mb-2">⏱️ Tempo Esperado para Ganhar</h1>
        <p className="section-subheading mx-auto mb-12">
          Quanto tempo você precisaria jogar para ter uma chance razoável?
        </p>
      </motion.div>

      {/* Big number */}
      <motion.div
        className="glass-card p-10 md:p-16 gold-glow mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <p className="stat-label mb-4">Tempo esperado para ganhar a Sena</p>
        <p className="text-5xl md:text-7xl font-mono font-bold text-primary tabular-nums animate-ticker">
          {fmt(expectedYears)}
        </p>
        <p className="text-2xl font-display font-bold text-foreground mt-1">anos</p>
      </motion.div>

      {/* Slider */}
      <div className="glass-card p-6 mb-10 inline-block">
        <label className="stat-label mb-3 block">Apostas por semana</label>
        <input
          type="range"
          min={1}
          max={20}
          value={betsPerWeek}
          onChange={(e) => setBetsPerWeek(Number(e.target.value))}
          className="w-64 accent-primary"
        />
        <p className="font-mono text-lg font-bold text-foreground mt-1">{betsPerWeek}x/semana</p>
      </div>

      {/* Comparisons */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          { label: "Idade do Universo", value: `${(expectedYears / universeAge * 100).toFixed(1)}% da idade do universo`, sub: `${fmt(universeAge)} anos` },
          { label: "Extinção dos dinossauros", value: `${(expectedYears / dinosaurs).toFixed(1)}x desde a extinção`, sub: `${fmt(dinosaurs)} anos atrás` },
          { label: "Humanos modernos", value: `${(expectedYears / humans).toFixed(0)}x o surgimento humano`, sub: `${fmt(humans)} anos atrás` },
          { label: "Sua expectativa de vida", value: `Precisaria viver ${fmt(Math.round(expectedYears / lifespan))} vezes`, sub: `${lifespan} anos médios` },
        ].map((item) => (
          <div key={item.label} className="glass-card-hover p-5 text-left">
            <p className="stat-label mb-1">{item.label}</p>
            <p className="font-mono text-sm font-bold text-foreground">{item.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom line */}
      <div className="educational-box text-left">
        <p className="terminal-text">
          Jogando {betsPerWeek}x por semana, a chance acumulada em {lifespan} anos de vida é de{" "}
          <span className="text-primary font-bold">{lifetimeChance}%</span>.
          Ou seja: <span className="text-hot font-bold">{(100 - parseFloat(lifetimeChance)).toFixed(4)}%</span> de chance de nunca ganhar.
        </p>
      </div>
    </div>
  );
}
