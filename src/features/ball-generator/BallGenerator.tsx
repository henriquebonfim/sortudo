import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Flame, Snowflake, Hash } from "lucide-react";
import { TOTAL_COMBINATIONS } from "@/core/constants/lottery";

function generateRandom(min: number, max: number, count: number): number[] {
  const set = new Set<number>();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(set).sort((a, b) => a - b);
}

const MODES = [
  { id: "random", label: "Aleatório", icon: <Shuffle className="h-4 w-4" /> },
  { id: "hot", label: "Só quentes", icon: <Flame className="h-4 w-4" /> },
  { id: "cold", label: "Só frios", icon: <Snowflake className="h-4 w-4" /> },
  { id: "sequence", label: "1,2,3,4,5,6", icon: <Hash className="h-4 w-4" /> },
  { id: "birthday", label: "Aniversário", icon: <span className="text-sm">🎂</span> },
] as const;

const HOT_NUMBERS = [10, 53, 5, 33, 42, 23, 4, 37, 34, 51, 30, 17, 24, 41, 44, 2, 43, 36, 28, 52];
const COLD_NUMBERS = [26, 55, 9, 22, 21, 39, 48, 57, 60, 15, 19, 6, 7, 14, 47, 58, 3, 20, 59, 31];

export default function BallGenerator() {
  const [balls, setBalls] = useState<number[]>([]);
  const [mode, setMode] = useState<string>("random");
  const [spinning, setSpinning] = useState(false);
  const [genCount, setGenCount] = useState(() => {
    const saved = localStorage.getItem("ball-gen-count");
    return saved ? parseInt(saved, 10) : 0;
  });

  const generate = useCallback((m: string) => {
    setSpinning(true);
    setMode(m);

    setTimeout(() => {
      let nums: number[];
      switch (m) {
        case "hot":
          nums = generateRandom(0, HOT_NUMBERS.length - 1, 6).map((i) => HOT_NUMBERS[i]).sort((a, b) => a - b);
          break;
        case "cold":
          nums = generateRandom(0, COLD_NUMBERS.length - 1, 6).map((i) => COLD_NUMBERS[i]).sort((a, b) => a - b);
          break;
        case "sequence":
          nums = [1, 2, 3, 4, 5, 6];
          break;
        case "birthday":
          nums = generateRandom(1, 31, 6);
          break;
        default:
          nums = generateRandom(1, 60, 6);
      }
      setBalls(nums);
      setSpinning(false);
      const newCount = genCount + 1;
      setGenCount(newCount);
      localStorage.setItem("ball-gen-count", String(newCount));
    }, 800);
  }, [genCount]);

  const message = useMemo(() => {
    if (mode === "sequence") {
      return '"Essa sequência já saiu! E quando saiu, 52 pessoas dividiram o prêmio. Pior dos dois mundos: improvável E com prêmio diluído."';
    }
    return `"Esta combinação tem exatamente 1 chance em ${TOTAL_COMBINATIONS.toLocaleString("pt-BR")} de ganhar a sena. Igual a qualquer outra."`;
  }, [mode]);

  return (
    <div className="container py-20 md:py-28 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-heading mb-2">🎲 Gerador de Apostas</h1>
        <p className="section-subheading mb-10">
          Tão válida quanto a sua. Todas as combinações têm a mesma chance.
        </p>
      </motion.div>

      {/* Mode buttons */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => generate(m.id)}
            disabled={spinning}
            className={`pill-btn flex items-center gap-2 ${mode === m.id && balls.length > 0 ? "pill-btn-active" : "pill-btn-inactive"} disabled:opacity-50`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Balls */}
      <div className="glass-card p-8 md:p-12 text-center">
        <div className="flex justify-center gap-4 mb-8 min-h-[80px] items-center">
          <AnimatePresence mode="wait">
            {spinning ? (
              <motion.div key="spin" className="flex gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="lottery-ball w-14 h-14 text-lg"
                    animate={{ rotate: 360, scale: [1, 0.8, 1] }}
                    transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                  >
                    ?
                  </motion.div>
                ))}
              </motion.div>
            ) : balls.length > 0 ? (
              <motion.div key="result" className="flex flex-wrap justify-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {balls.map((n, i) => (
                  <motion.div
                    key={`${n}-${i}`}
                    className="lottery-ball w-16 h-16 text-xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.1 }}
                  >
                    {String(n).padStart(2, "0")}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="font-mono text-muted-foreground text-sm">
                Clique em um modo para gerar<span className="animate-pulse">▊</span>
              </p>
            )}
          </AnimatePresence>
        </div>

        {balls.length > 0 && !spinning && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <p className="text-sm text-muted-foreground italic max-w-lg mx-auto">{message}</p>
          </motion.div>
        )}
      </div>

      {genCount > 0 && (
        <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
          Você gerou a combinação #{genCount.toLocaleString("pt-BR")} de {TOTAL_COMBINATIONS.toLocaleString("pt-BR")} possíveis
        </p>
      )}
    </div>
  );
}
