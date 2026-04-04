import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  decimals?: number;
}

export function AnimatedCounter({ target, duration = 2000, decimals = 0 }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, {
      duration: duration / 1000,
      ease: "easeOut",
    });
    
    const unsubscribe = count.on("change", (latest) => {
      setDisplayValue(Number(latest.toFixed(decimals)));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [target, duration, count, decimals]);

  return (
    <span className="font-mono tabular-nums">
      {displayValue.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}
