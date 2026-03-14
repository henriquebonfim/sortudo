import { motion } from "framer-motion";

export function LoadingBalls() {
  return (
    <div className="flex items-center justify-center gap-3 py-16" role="status" aria-label="Carregando">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="lottery-ball w-8 h-8 text-xs"
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        >
          {i + 1}
        </motion.div>
      ))}
    </div>
  );
}
