/**
 * THEME — Runtime Color Constants
 *
 * Single source of truth for all runtime HSL color values.
 *
 * Design System layers:
 *   Layer 1: primitives.ts  — raw typed atoms (build-time)
 *   Layer 2: semantic.ts    — role mapping (build-time)
 *   Layer 3: tokens.css     — CSS custom properties (runtime via browser)
 *   Layer 4: theme.ts       — JS runtime constants (this file)
 *
 * When to use each layer:
 *   - HTML/JSX class:   `className="text-primary"` or `"text-[var(--color-brand)]"`
 *   - Chart props:      `CHART_COLORS.AMBER` (recharts/canvas cannot use CSS vars)
 *   - React context:    `useTheme().colors.brand` (typed, tree-shakeable)
 *   - Inline style:     `style={{ color: THEME.colors.brand }}`
 *
 * ⚠️ Never use raw hex or HSL strings directly in component code.
 *    Always reference a named constant from this file or CHART_COLORS.
 */

// ── Brand ──────────────────────────────────────────────────────────────────

const brand = {
  /** Primary gold. CSS: hsl(38, 92%, 50%)  ≈ amber-500 */
  DEFAULT:  'hsl(38, 92%, 50%)',
  /** Darker gold variant — active/hover states. */
  dark:     'hsl(38, 80%, 40%)',
  /** Lighter gold highlight. */
  light:    'hsl(38, 92%, 65%)',
} as const;

// ── Feedback ───────────────────────────────────────────────────────────────

const feedback = {
  /** Success green.  CSS: hsl(142, 71%, 45%)  ≈ emerald-500 */
  success:  'hsl(142, 71%, 45%)',
  /** Danger red.     CSS: hsl(0, 84%, 60%)    ≈ red-500 */
  danger:   'hsl(0, 84%, 60%)',
  /** Info blue.      CSS: hsl(217, 91%, 60%)  ≈ blue-500 */
  info:     'hsl(217, 91%, 60%)',
} as const;

// ── Temperature (lottery number heat signals) ──────────────────────────────

const temperature = {
  /** Hot number — same as danger red. */
  hot:   'hsl(0, 84%, 60%)',
  /** Cold number — same as info blue. */
  cold:  'hsl(217, 91%, 60%)',
} as const;

// ── Surfaces ───────────────────────────────────────────────────────────────

const surface = {
  /** Page background.   CSS: hsl(240, 33%, 5%) */
  page:       'hsl(240, 33%, 5%)',
  /** Card background.   CSS: hsl(240, 25%, 12%) */
  card:       'hsl(240, 25%, 12%)',
  /** Muted surface.     CSS: hsl(240, 15%, 18%) */
  muted:      'hsl(240, 15%, 18%)',
} as const;

// ── Text ───────────────────────────────────────────────────────────────────

const text = {
  /** Primary foreground. CSS: hsl(210, 40%, 96%) */
  primary:    'hsl(210, 40%, 96%)',
  /** Muted foreground.   CSS: hsl(215, 16%, 47%) */
  muted:      'hsl(215, 16%, 47%)',
} as const;

// ── Assembled THEME constant ───────────────────────────────────────────────

export const THEME = {
  colors: {
    brand,
    feedback,
    temperature,
    surface,
    text,
  },
} as const;

export type Theme = typeof THEME;

// ── Flat color aliases (for ergonomic destructuring) ──────────────────────

export const COLORS = {
  brand:    brand.DEFAULT,
  success:  feedback.success,
  danger:   feedback.danger,
  info:     feedback.info,
  hot:      temperature.hot,
  cold:     temperature.cold,
} as const;
