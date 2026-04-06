/**
 * Tailwind CSS Configuration
 *
 * Simplified to use direct values instead of complex design system imports.
 * Preserves the shadcn/Radix CSS variable pattern for color semantics.
 *
 * Strict typing enforced via `satisfies Config`.
 */

import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      /**
       * Colors: shadcn CSS variable pattern preserved.
       * All values use `hsl(var(--token))` — CSS vars defined in src/styles/globals.css.
       */
      colors: {
        // ── Shadcn/Radix System Colors ───────────────────────────────────────
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // ── Semantic Feedback Colors ─────────────────────────────────────────
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },

        // ── Hot/Cold Temperature Colors ──────────────────────────────────────
        hot: 'hsl(var(--hot))',
        cold: 'hsl(var(--cold))',

        // ── Sidebar Colors ───────────────────────────────────────────────────
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },

      /**
       * Border Radius: uses CSS var(--radius) base from shadcn.
       */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '0.75rem',
        '2xl': '1rem',
      },

      /**
       * Font Families: Google Fonts imported in globals.css.
       */
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      /**
       * Letter Spacing.
       */
      letterSpacing: {
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        widest: '0.1em',
      },

      /**
       * Line Height.
       */
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
      },

      /**
       * Box Shadows.
       */
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.6)',
        md: '0 4px 16px -2px rgba(0,0,0,0.7), 0 2px 6px -1px rgba(0,0,0,0.4)',
        lg: '0 12px 40px -8px rgba(0,0,0,0.85)',
        'gold-ring': '0 0 0 1px hsl(var(--primary) / 0.35), 0 0 16px hsl(var(--primary) / 0.1)',
        'gold-glow': '0 0 24px hsl(var(--primary) / 0.2), 0 0 48px hsl(var(--primary) / 0.08)',
        ball: '0 6px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
        xl: '0 20px 25px -5px rgba(0,0,0,0.5)',
      },

      /**
       * Blur.
       */
      backdropBlur: {
        md: '8px',
        xl: '24px',
        hero: '120px',
      },
      blur: {
        md: '8px',
        xl: '24px',
        hero: '120px',
      },

      /**
       * Keyframes: lottery/domain-specific animations.
       */
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-gold': {
          '0%, 100%': {
            boxShadow: '0 0 20px hsl(var(--primary) / 0.3), 0 0 40px hsl(var(--primary) / 0.1)',
          },
          '50%': {
            boxShadow: '0 0 32px hsl(var(--primary) / 0.55), 0 0 64px hsl(var(--primary) / 0.2)',
          },
        },
        'counter-tick': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'ball-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },

      /**
       * Named animations.
       */
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'counter-tick': 'counter-tick 0.3s ease-out',
        'ball-bounce': 'ball-bounce 0.6s ease-in-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
