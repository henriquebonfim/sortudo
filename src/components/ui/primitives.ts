/**
 * Primitive Tokens — Layer 1
 *
 * Raw, deduplicated values extracted strictly from existing codebase usage.
 * Do NOT reference semantic meaning here — these are atoms only.
 *
 * Color values use HSL channels (without `hsl()` wrapper) for CSS custom property
 * compatibility with Tailwind's `hsl(var(--token))` pattern.
 * Chart-specific colors retain hex for recharts/canvas library compatibility.
 *
 * @see src/design-system/semantic.ts for the semantic layer
 */

// ─── Color Primitives ────────────────────────────────────────────────────────

/**
 * Base surface colors — dark-mode palette (app is single-theme: dark-only).
 * HSL channel format: "H S% L%" (no hsl() wrapper)
 */
const colorBase = {
  /** Page background — near-black indigo. `hsl(240, 33%, 5%)` */
  "950": "240 33% 5%",
  /** Sidebar background — slightly lighter than page. `hsl(240, 25%, 8%)` */
  "900": "240 25% 8%",
  /** Card / popover surface. `hsl(240, 25%, 12%)` */
  "800": "240 25% 12%",
  /** Secondary / mild surface. `hsl(240, 20%, 15%)` */
  "700": "240 20% 15%",
  /** Muted surface. `hsl(240, 15%, 18%)` */
  "600": "240 15% 18%",
  /** Input background. `hsl(240, 20%, 18%)` */
  "550": "240 20% 18%",
} as const;

/**
 * Foreground / neutral text colors.
 * HSL channel format.
 */
const colorNeutral = {
  /** Primary text — near-white. `hsl(210, 40%, 96%)` */
  "50": "210 40% 96%",
  /** Body text (high contrast variant). `hsl(210, 40%, 98%)` */
  "30": "210 40% 98%",
  /** Muted foreground — slate-500 equivalent. `hsl(215, 16%, 47%)` */
  "500": "215 16% 47%",
} as const;

/**
 * Gold / amber scale — brand primary color.
 * HSL channel format.
 */
const colorGold = {
  /** Core brand gold. `hsl(38, 92%, 50%)` — #F59E0B ≈ amber-500 */
  "500": "38 92% 50%",
  /** Slightly darker gold. `hsl(38, 80%, 40%)` */
  "600": "38 80% 40%",
  /** Lighter gold highlight. `hsl(38, 92%, 65%)` */
  "300": "38 92% 65%",
} as const;

/**
 * Red scale — destructive / hot signals.
 */
const colorRed = {
  /** Primary red. `hsl(0, 84%, 60%)` — #EF4444 ≈ red-500 */
  "500": "0 84% 60%",
} as const;

/**
 * Green scale — success / positive values.
 */
const colorGreen = {
  /** Primary green. `hsl(142, 71%, 45%)` — #10B981 ≈ emerald-500 */
  "500": "142 71% 45%",
} as const;

/**
 * Blue scale — info / cold signals.
 */
const colorBlue = {
  /** Primary blue. `hsl(217, 91%, 60%)` — #3B82F6 ≈ blue-500 */
  "500": "217 91% 60%",
} as const;

/**
 * White/transparency utilities for borders and overlays.
 * These values include the alpha channel in CSS `/ alpha` syntax.
 */
const colorWhite = {
  /** Standard border: white 8% opacity. */
  border: "0 0% 100% / 0.08",
  /** Sidebar border: white 6% opacity. */
  borderSubtle: "0 0% 100% / 0.06",
  /** Grid line: white 3% opacity. */
  gridLine: "0 0% 100% / 0.03",
  /** Tooltip cursor: white 5% opacity. */
  cursor: "0 0% 100% / 0.05",
} as const;

/**
 * Chart-specific hex palette — recharts/canvas libraries require hex or rgb.
 * These MUST be kept in sync with their CSS variable equivalents.
 * ⚠️ Prefer CSS vars in HTML/JSX context; use these only in chart props.
 */
const colorChart = {
  /** Brand gold/amber — equals colorGold.500 in hex. */
  amber: "#F59E0B",
  /** Info blue — equals colorBlue.500 in hex. */
  blue: "#3B82F6",
  /** Success green (Tailwind green-500) — used in ball color gradient. */
  green: "#22C55E",
  /** Emerald — equals colorGreen.500 in hex. Note: distinct from green-500. */
  emerald: "#10B981",
  /** Muted text approximate — equals colorNeutral.500 in hex. */
  slate: "#94A3B8",
  /** Destructive red — equals colorRed.500 in hex. */
  red: "#EF4444",
  /** Accent violet — chart-only, no CSS var equivalent. */
  violet: "#8B5CF6",
  /** Dark surface for recharts tooltips — slate-800. */
  tooltipBg: "#1E293B",
  /** Border for recharts tooltips — slate-700. */
  tooltipBorder: "#334155",
  /** Grid stroke: near-transparent white. */
  gridStroke: "rgba(255,255,255,0.05)",
  /** Chart cursor fill. */
  cursorFill: "rgba(255,255,255,0.03)",
  /** Light foreground for chart labels. */
  label: "#CBD5E1",
  /** Foreground for chart tick labels. */
  tickLabel: "#94A3B8",
  /** Light-ish foreground. */
  foreground: "#E2E8F0",
  /** Near-white. */
  nearWhite: "#F8FAFC",
} as const;

// ─── Typography Primitives ────────────────────────────────────────────────────

const fontFamily = {
  /** Headings and display text. Loaded from Google Fonts. */
  display: ["Space Grotesk", "system-ui", "sans-serif"] as const,
  /** Body / UI text. Loaded from Google Fonts. */
  body: ["Inter", "system-ui", "sans-serif"] as const,
  /** Monospace — numbers, code, stats. Loaded from Google Fonts. */
  mono: ["JetBrains Mono", "monospace"] as const,
} as const;

const fontSize = {
  /** 10px — chart ticks */
  "10": "10px",
  /** 11px — chart axis labels */
  "11": "11px",
  /** 12px — chart font, tooltip base (JetBrains Mono) */
  "12": "12px",
  /** 0.75rem — xs */
  xs: "0.75rem",
  /** 0.875rem — sm (nav, buttons, badge) */
  sm: "0.875rem",
  /** 1rem — base */
  base: "1rem",
  /** 1.125rem — lg */
  lg: "1.125rem",
  /** 1.25rem — xl */
  xl: "1.25rem",
  /** 1.5rem — 2xl (e.g. card title) */
  "2xl": "1.5rem",
  /** 1.875rem — 3xl (stat number, section heading) */
  "3xl": "1.875rem",
  /** 2.25rem — 4xl (section heading md) */
  "4xl": "2.25rem",
  /** 3rem — 5xl */
  "5xl": "3rem",
  /** 4.5rem — 7xl (hero heading) */
  "7xl": "4.5rem",
} as const;

const fontWeight = {
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  black: "900",
} as const;

const letterSpacing = {
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  /** Used on pill-btn and stat-label */
  widest: "0.1em",
} as const;

const lineHeight = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
} as const;

// ─── Spacing Primitives ───────────────────────────────────────────────────────

/**
 * Spacing values in rem. Matches Tailwind's default scale.
 * Only values actively used in the codebase are listed.
 */
const spacing = {
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "14": "3.5rem",
  "16": "4rem",
  "20": "5rem",
  "32": "8rem",
  /** Container padding */
  containerPadding: "2rem",
} as const;

// ─── Border Radius Primitives ─────────────────────────────────────────────────

/**
 * Border radius scale.
 * Note: `--radius` CSS var = 0.75rem; shadcn derives lg/md/sm from it.
 */
const radius = {
  /** None */
  none: "0px",
  /** Small — 4px (calc(var(--radius) - 4px)) */
  sm: "0.5rem",
  /** Medium — (calc(var(--radius) - 2px)) */
  md: "0.625rem",
  /** Large — var(--radius) */
  lg: "0.75rem",
  /** Extra large — used on cards, sections */
  xl: "0.75rem",
  /** 2xl — used on hero button, feature cards */
  "2xl": "1rem",
  /** Full — pill buttons, lottery balls, coins */
  full: "9999px",
} as const;

// ─── Shadow Primitives ────────────────────────────────────────────────────────

const shadow = {
  /** Subtle elevation */
  sm: "0 1px 2px rgba(0,0,0,0.5)",
  /** Card elevation */
  md: "0 4px 6px -1px rgba(0,0,0,0.7), 0 2px 4px -1px rgba(0,0,0,0.06)",
  /** Deep elevation */
  lg: "0 10px 30px -10px rgba(0,0,0,0.8)",
  /** Gold ring — card hover, active states */
  gold: "0 0 0 1px hsl(38 92% 50% / 0.3)",
  /** Gold ambient glow — glass-card gold-glow */
  glow: "0 0 20px hsl(38 92% 50% / 0.15)",
  /** Lottery ball shadow */
  ball: "0 4px 12px hsl(38 92% 50% / 0.3), inset 0 1px 0 hsl(38 92% 70% / 0.4)",
  /** Coin outer shadow */
  coin: "inset 0 0 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
  /** Shadow-xl used on hero button */
  xl: "0 20px 25px -5px rgba(0,0,0,0.5)",
} as const;

// ─── Z-Index Primitives ───────────────────────────────────────────────────────

const zIndex = {
  /** Base content */
  base: 0,
  /** Raised content within section */
  raised: 10,
  /** Sticky header, tooltips within page */
  sticky: 20,
  /** Fixed header / nav */
  fixed: 50,
} as const;

// ─── Blur Primitives ─────────────────────────────────────────────────────────

const blur = {
  /** Backdrop blur for header */
  xl: "24px",
  /** Backdrop blur for chart tooltips */
  md: "8px",
  /** Hero background glow blur */
  hero: "120px",
} as const;

// ─── Assembled Primitives ─────────────────────────────────────────────────────

export const primitives = {
  color: {
    base: colorBase,
    neutral: colorNeutral,
    gold: colorGold,
    red: colorRed,
    green: colorGreen,
    blue: colorBlue,
    white: colorWhite,
    chart: colorChart,
  },
  font: {
    family: fontFamily,
    size: fontSize,
    weight: fontWeight,
    letterSpacing,
    lineHeight,
  },
  spacing,
  radius,
  shadow,
  zIndex,
  blur,
} as const;

export type Primitives = typeof primitives;
