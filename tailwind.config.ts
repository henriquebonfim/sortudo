/**
 * Tailwind CSS Configuration — Typed with Design System Primitives
 *
 * Updated to use primitives from the design system token layer.
 * Preserves the shadcn/Radix CSS variable pattern for color semantics.
 *
 * Strict typing enforced via `satisfies Config`.
 */

import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import { primitives } from "./src/components/ui/primitives";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: primitives.spacing.containerPadding,
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /**
       * Colors: shadcn CSS variable pattern preserved.
       * All values use `hsl(var(--token))` — CSS vars defined in src/index.css.
       * Do NOT add raw color values here — add them to primitives.ts first.
       */
      colors: {
        // ── Shadcn/Radix System Colors ───────────────────────────────────────
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // ── Semantic Feedback Colors ─────────────────────────────────────────
        success: {
          DEFAULT:    "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        info: {
          DEFAULT:    "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },

        // ── Hot/Cold Temperature Colors ──────────────────────────────────────
        hot:  "hsl(var(--hot))",
        cold: "hsl(var(--cold))",

        // ── Sidebar Colors ───────────────────────────────────────────────────
        sidebar: {
          DEFAULT:            "hsl(var(--sidebar-background))",
          foreground:         "hsl(var(--sidebar-foreground))",
          primary:            "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent:             "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border:             "hsl(var(--sidebar-border))",
          ring:               "hsl(var(--sidebar-ring))",
        },
      },

      /**
       * Border Radius: uses CSS var(--radius) base from shadcn.
       * Derived values from primitives.radius.
       */
      borderRadius: {
        lg:   "var(--radius)",
        md:   "calc(var(--radius) - 2px)",
        sm:   "calc(var(--radius) - 4px)",
        xl:   primitives.radius.xl,
        "2xl": primitives.radius["2xl"],
      },

      /**
       * Font Families: sourced from primitives.font.family.
       * Google Fonts imported in index.css.
       */
      fontFamily: {
        display: [...primitives.font.family.display],
        body:    [...primitives.font.family.body],
        mono:    [...primitives.font.family.mono],
      },

      /**
       * Letter Spacing: sourced from primitives.font.letterSpacing.
       */
      letterSpacing: {
        tight:  primitives.font.letterSpacing.tight,
        normal: primitives.font.letterSpacing.normal,
        wide:   primitives.font.letterSpacing.wide,
        widest: primitives.font.letterSpacing.widest,
      },

      /**
       * Line Height: sourced from primitives.font.lineHeight.
       */
      lineHeight: {
        none:    primitives.font.lineHeight.none,
        tight:   primitives.font.lineHeight.tight,
        snug:    primitives.font.lineHeight.snug,
        normal:  primitives.font.lineHeight.normal,
        relaxed: primitives.font.lineHeight.relaxed,
      },

      /**
       * Box Shadows: sourced from primitives.shadow.
       * Named to match semantic usage.
       */
      boxShadow: {
        sm:         primitives.shadow.sm,
        md:         primitives.shadow.md,
        lg:         primitives.shadow.lg,
        "gold-ring": primitives.shadow.gold,
        "gold-glow": primitives.shadow.glow,
        ball:       primitives.shadow.ball,
        xl:         primitives.shadow.xl,
      },

      /**
       * Blur: sourced from primitives.blur.
       */
      backdropBlur: {
        md:   primitives.blur.md,
        xl:   primitives.blur.xl,
        hero: primitives.blur.hero,
      },
      blur: {
        md:   primitives.blur.md,
        xl:   primitives.blur.xl,
        hero: primitives.blur.hero,
      },

      /**
       * Keyframes: lottery/domain-specific animations.
       * Generic animations (accordion, fade-in) should be CSS-variable driven.
       */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: `0 0 0 0 hsl(${primitives.color.gold["500"]} / 0.4)` },
          "50%":      { boxShadow: `0 0 0 12px hsl(${primitives.color.gold["500"]} / 0)` },
        },
        "counter-tick": {
          "0%":   { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "ball-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
      },

      /**
       * Named animations with typed durations and easings.
       * Values match motion.ts tailwindAnimations for consistency.
       */
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in":        "fade-in 0.5s ease-out forwards",
        "fade-in-up":     "fade-in-up 0.6s ease-out forwards",
        "pulse-gold":     "pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "counter-tick":   "counter-tick 0.3s ease-out",
        "ball-bounce":    "ball-bounce 0.6s ease-in-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
