export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

export const tooltipStyle = {
  background: "hsl(240 25% 12%)",
  border: "1px solid hsl(38 92% 50% / 0.3)",
  borderRadius: 8,
  backdropFilter: "blur(8px)",
  fontFamily: "JetBrains Mono",
  fontSize: 12,
};
