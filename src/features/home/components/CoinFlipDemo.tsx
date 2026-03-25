import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { FlipHorizontal, User } from "lucide-react";
import { useCallback, useState } from "react";

const COIN_COUNT = 6;

export function CoinFlipDemo() {
  const [coins, setCoins] = useState<boolean[]>(Array(COIN_COUNT).fill(true));
  const [attempts, setAttempts] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [won, setWon] = useState(false);

  const flip = useCallback(() => {
    if (flipping) return;
    setFlipping(true);
    setWon(false);

    const newCoins = Array.from({ length: COIN_COUNT }, () => Math.random() < 0.5);

    setTimeout(() => {
      setCoins(newCoins);
      setAttempts((a) => a + 1);

      const allSame = newCoins.every((c) => c === newCoins[0]);
      if (allSame) {
        setWon(true);
        confetti({
          particleCount: 180,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#fcd34d", "#ffffff", "#10b981"],
        });
      }
    }, 400);

    setTimeout(() => {
      setFlipping(false);
    }, 850);
  }, [flipping]);

  const allSame = coins.every((c) => c === coins[0]);
  const prob = `1/${Math.pow(2, COIN_COUNT - 1).toLocaleString("pt-BR")}`;

  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlipHorizontal className="h-4 w-4 text-primary" />
          <span className="text-sm font-mono text-foreground font-bold">Analogia da moeda</span>
        </div>
        {attempts > 0 && (
          <span className="text-xs font-mono text-muted-foreground">
            tentativas: <span className="text-foreground font-bold">{attempts}</span>
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Lance <strong className="text-foreground">6 moedas</strong> e tente fazer todas
        cair no mesmo lado. Se conseguir — confetti! Mas a <em>próxima</em> jogada ainda
        tem <span className="font-mono text-primary">{prob}</span> de chance.
      </p>

      <div className="grid grid-cols-6 gap-2">
        {coins.map((isCara, i) => (
          <motion.div
            key={i}
            animate={{
              rotateY: flipping ? [0, 180, 360, 540, 720] : 0,
              y: flipping ? [0, -40, 0] : 0,
            }}
            transition={{
              duration: flipping ? 0.6 : 0,
              delay: flipping ? i * 0.05 : 0,
              ease: flipping ? "easeOut" : "linear",
            }}
            className="relative aspect-square rounded-full cursor-default"
          >
            <div className={`real-coin-outer transition-opacity duration-300 ${flipping ? "opacity-40" : "opacity-100"}`}>
              <div className="real-coin-inner">
                {isCara ? (
                  <>
                    <span className="real-coin-number text-lg md:text-xl">1</span>
                    <span className="real-coin-label text-[0.4rem] md:text-[0.5rem] -mt-1">REAL</span>
                    <div className="real-coin-stars" />
                  </>
                ) : (
                  <User className="h-[55%] w-[55%] text-[#444] opacity-70 drop-shadow-sm" />
                )}
              </div>
            </div>

            {allSame && attempts > 0 && (
              <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse shadow-[0_0_10px_hsl(38_92%_50%/0.5)]" />
            )}
          </motion.div>
        ))}
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-3 text-center border border-primary/50 bg-primary/10"
        >
          <p className="text-sm font-bold font-mono text-primary">
            🎉 Sortudo!
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Chance de acontecer de novo: <span className="text-primary font-mono">{prob}</span>
          </p>
        </motion.div>
      )}

      <div className="glass-card p-3 text-center border border-primary/30">
        <div className="text-xs text-muted-foreground font-mono mb-1">P(todas iguais) = 2 ÷ 2⁶</div>
        <div className="text-2xl font-bold font-mono text-primary">~3,1%</div>
        <div className="text-xs text-muted-foreground">Cada jogada é independente. O passado não conta.</div>
      </div>

      <button
        onClick={flip}
        disabled={flipping}
        className="w-full py-2.5 px-4 rounded-xl bg-base text-base-foreground font-display font-bold text-sm hover:bg-base/90 border border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {flipping ? "Lançando..." : attempts === 0 ? "🪙 Lançar moedas" : "🔄 Lançar novamente"}
      </button>
    </div>
  );
}
