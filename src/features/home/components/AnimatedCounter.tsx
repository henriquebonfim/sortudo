import { useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
}

export function AnimatedCounter({ target, duration = 2000 }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Whenever target changes, animate the motion value
    const controls = animate(count, target, {
      duration: duration / 1000,
      ease: "easeOut",
    });
    
    // Subscribe to the motion value to update our state for rendering
    const unsubscribe = count.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [target, duration, count]);

  return (
    <span className="font-mono tabular-nums">
      {displayValue.toLocaleString("pt-BR")}
    </span>
  );
}
