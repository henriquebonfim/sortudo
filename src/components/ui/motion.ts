/**
 * Motion Tokens
 *
 * Centralized animation configuration for framer-motion.
 * Extracted from codebase usage — all values are actual constants used across components.
 *
 * ✅ Use these in framer-motion `transition` and `animate` props.
 * ❌ Do NOT duplicate motion values inline in components.
 *
 * @example
 *   import { spring, duration, ease } from "@/components/ui";
 *   <motion.div transition={spring.standard} />
 */

// ─── Spring Physics ───────────────────────────────────────────────────────────

/**
 * Spring configurations for framer-motion.
 * Extracted from codebase — two distinct presets found.
 */
export const spring = {
  /**
   * Standard spring — used in StatCard, SharedAnimations fadeUp, MathSection.
   * Snappy with controlled overshoot.
   */
  standard: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },

  /**
   * Gentle spring — used in HeroSection, CombinatorialSection, MathSection headers.
   * Slightly slower entry with same damping.
   */
  gentle: {
    type: "spring" as const,
    stiffness: 200,
    damping: 30,
  },
} as const;


// ─── Duration Scale ───────────────────────────────────────────────────────────

/**
 * Duration values in seconds. Covers all usages found in the codebase.
 */
export const duration = {
  /** Microinteraction — state changes, hover. */
  xs: 0.15,
  /** Fast — button press, tab switch (tailwind: duration-200). */
  sm: 0.2,
  /** Standard transition (tailwind: duration-300). */
  md: 0.3,
  /** Ticker animation, accordion. */
  ticker: 0.3,
  /** Coin flip, ball bounce (tailwind: duration-600). */
  flip: 0.6,
  /** Default page transition, progress bar reveal. */
  lg: 0.8,
  /** Slow counter animations (AnimatedCounter base). */
  xl: 2.0,
  /** Hero counter 1 (AnimatedCounter target=totalBillions). */
  heroCounter1: 2.5,
  /** Hero counter 2 (AnimatedCounter target=fractionBillions). */
  heroCounter2: 2.8,
} as const;


// ─── Delay Scale ─────────────────────────────────────────────────────────────

/**
 * Delay values in seconds. Extracted from hero and section staggering.
 */
export const delay = {
  /** No delay. */
  none: 0,
  /** First stagger step (MoneyFunnel, CoinAnalogy). */
  stagger1: 0.05,
  /** Content after hero animation. */
  hero1: 0.4,
  /** Call-to-action after hero content. */
  hero2: 0.8,
  /** Scroll indicator, terminal text. */
  hero3: 1.2,
  /** Progress bar / chart reveal */
  chartReveal: 0.1,
  /** Post-entry embellishments. */
  embellishment: 0.3,
} as const;


// ─── Easing Presets ───────────────────────────────────────────────────────────

/**
 * Easing functions. Named presets match framer-motion named easings.
 * Custom cubic-bezier values extracted from ScrollSection.
 */
export const ease = {
  /** Standard easing for most transitions. */
  out: "easeOut" as const,
  /** In-out for bouncing elements (coin flip). */
  inOut: "easeInOut" as const,
  /** Linear — no easing (used as a reset). */
  linear: "linear" as const,
  /**
   * Scroll section entrance — cubic bezier for springy feel.
   * From ScrollSection.tsx: [0.21, 1.11, 0.81, 0.99]
   */
  scrollEntry: [0.21, 1.11, 0.81, 0.99] as [number, number, number, number],
  /**
   * Ticker/animate-ticker: cubic-bezier(0.16, 1, 0.3, 1).
   * The "snappy" ease from Radix UI / animate-ticker class.
   */
  snappy: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const;

// ─── Stagger Configuration ────────────────────────────────────────────────────

/**
 * Stagger children configurations for framer-motion parent variants.
 */
export const stagger = {
  /**
   * Standard stagger (0.12s) — used in shared-animations.ts.
   */
  standard: {
    staggerChildren: 0.12,
  },
  /**
   * Slow stagger — MoneyFunnel sections (0.2s delay per item).
   */
  slow: {
    staggerChildren: 0.2,
  },
  /**
   * Fast stagger — coin flip cells (0.05s).
   */
  fast: {
    staggerChildren: 0.05,
  },
} as const;

// ─── Standard Variant Presets ─────────────────────────────────────────────────

/**
 * Reusable framer-motion variant objects.
 * Import these instead of defining inline variants per component.
 */
export const variants = {
  /**
   * Fade up entrance — used in MoneyFlowChart, shared-animations.ts.
   * Pair with spring.standard transition.
   */
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: spring.standard,
    },
  },

  /**
   * Fade in from slightly below — used in HeroSection heading.
   * Pair with spring.gentle transition.
   */
  heroEnter: {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: spring.gentle,
    },
  },

  /**
   * Scroll section entrance — scales up and fades in.
   * Used in ScrollSection.tsx.
   */
  scrollEntry: {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: duration.lg,
        ease: ease.scrollEntry,
      },
    },
  },

  /**
   * Stagger container — wraps fadeUp children.
   */
  staggerContainer: {
    hidden: {},
    show: { transition: stagger.standard },
  },

  /**
   * Mobile nav open/close — used in Header.tsx.
   */
  mobileNav: {
    closed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  },
} as const;

// ─── Tailwind Animation Reference ─────────────────────────────────────────────

/**
 * Maps tailwind animation names to their configuration.
 * Defined in tailwind.config.ts — documented here for reference.
 * These are CSS animations; do NOT use framer-motion for these.
 */
export const tailwindAnimations = {
  "fade-in": "fade-in 0.5s ease-out forwards",
  "fade-in-up": "fade-in-up 0.6s ease-out forwards",
  "pulse-gold": "pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  "counter-tick": "counter-tick 0.3s ease-out",
  "ball-bounce": "ball-bounce 0.6s ease-in-out",
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
} as const;

