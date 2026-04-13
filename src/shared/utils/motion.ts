/**
 * Motion System constants and presets for Framer Motion.
 */

// ─── Spring & Physics ─────────────────────────────────────────────────────────

export const spring = {
  /** Snappy but controlled - good for stats, buttons. */
  standard: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  /** Gentle and fluid - good for section reveals and text. */
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 30,
  },
} as const;

export const duration = {
  sm: 0.2,
  md: 0.3,
  lg: 0.5,
  xl: 0.8,
} as const;

// ─── Shared Variants ─────────────────────────────────────────────────────────

/** Fade and slide up entrance - universal reveal. */
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: spring.standard,
  },
};

/** Container layout to stagger children reveals. */
export const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// ─── Shared Canvas/Recharts Styles ───────────────────────────────────────────

/** Shared Recharts Tooltip styling - uses CSS variables. */
export const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--primary) / 0.3)',
  borderRadius: 8,
  backdropFilter: 'blur(8px)',
  fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
  fontSize: 12,
} as const;
