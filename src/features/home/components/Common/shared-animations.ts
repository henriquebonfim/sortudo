import { spring } from "@/components/ui";

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: spring.standard,
  },
};

/**
 * Shared recharts Tooltip contentStyle.
 * Uses CSS variables so values remain in sync with the design system.
 */
export const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--primary) / 0.3)",
  borderRadius: 8,
  backdropFilter: "blur(8px)",
  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
  fontSize: 12,
} as const;

