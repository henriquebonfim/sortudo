/**
 * Semantic Tokens — Layer 2
 *
 * Maps design intention (usage context) to primitive token paths.
 * Token references use dotted string paths: "{color.gold.500}"
 *
 * These tokens should be the ONLY source of truth for component styling.
 * Components must never reference primitive tokens directly.
 *
 * @see src/design-system/primitives.ts for raw values
 * @see src/design-system/token-utils.ts for TokenPath<T> and resolveToken()
 */

// ─── Color Semantic Tokens ────────────────────────────────────────────────────

const semanticColor = {
  /**
   * Surface / background hierarchy.
   * Usage: bg-background, bg-card, etc.
   */
  surface: {
    /** Page background — most behind. */
    page: "{color.base.950}",
    /** Sidebar background. */
    sidebar: "{color.base.900}",
    /** Card / popover surface. */
    card: "{color.base.800}",
    /** Secondary surface (hover states, mild backgrounds). */
    secondary: "{color.base.700}",
    /** Muted surface (dimmed areas). */
    muted: "{color.base.600}",
    /** Input / form field background. */
    input: "{color.base.550}",
  },

  /**
   * Text / foreground hierarchy.
   */
  text: {
    /** Primary body text. */
    primary: "{color.neutral.50}",
    /** High-contrast text (used in destructive-foreground). */
    strong: "{color.neutral.30}",
    /** Muted / secondary text. */
    muted: "{color.neutral.500}",
    /** Brand gold text (headings, icons, active states). */
    brand: "{color.gold.500}",
    /** Success / positive text. */
    success: "{color.green.500}",
    /** Warning / hot text. */
    danger: "{color.red.500}",
    /** Info / cold text. */
    info: "{color.blue.500}",
  },

  /**
   * Brand / accent colors (primary = gold).
   */
  brand: {
    /** Default interactive state. */
    default: "{color.gold.500}",
    /** Darker — gradient endings, secondary emphasis. */
    dark: "{color.gold.600}",
    /** Lighter — gradient highlights. */
    light: "{color.gold.300}",
    /** Overlay/bg tint for brand-colored panels. */
    surface: "{color.base.550}",
  },

  /**
   * Feedback / status colors.
   */
  feedback: {
    success: "{color.green.500}",
    danger: "{color.red.500}",
    info: "{color.blue.500}",
    /** Same as danger — used in temperature metaphors (hot numbers). */
    hot: "{color.red.500}",
    /** Same as info — used in temperature metaphors (cold numbers). */
    cold: "{color.blue.500}",
  },

  /**
   * Border / divider colors.
   */
  border: {
    /** Standard border. */
    default: "{color.white.border}",
    /** Sidebar border, more subtle. */
    subtle: "{color.white.borderSubtle}",
    /** Brand-colored border (ring, focus). */
    brand: "{color.gold.500}",
    /** Form input border (same as standard). */
    input: "{color.white.border}",
  },

  /**
   * Focus ring color (WCAG: must have sufficient contrast).
   */
  ring: "{color.gold.500}",

  /**
   * Chart-specific palette tokens.
   * Use ONLY in recharts/canvas props where CSS vars are not supported.
   * All values MUST match their corresponding CSS var color.
   */
  chart: {
    /** Brand gold (#F59E0B = hsl(38 92% 50%)) */
    gold: "{color.chart.amber}",
    /** Destructive red (#EF4444 = hsl(0 84% 60%)) */
    red: "{color.chart.red}",
    /** Success green (#10B981 = hsl(142 71% 45%)) */
    green: "{color.chart.emerald}",
    /** Info blue (#3B82F6 = hsl(217 91% 60%)) */
    blue: "{color.chart.blue}",
    /** Muted slate (#94A3B8 ≈ hsl(215 16% 47%)) */
    muted: "{color.chart.slate}",
    /** Chart-only violet (no CSS var) */
    violet: "{color.chart.violet}",
    /** Tooltip background */
    tooltipBg: "{color.chart.tooltipBg}",
    /** Tooltip border */
    tooltipBorder: "{color.chart.tooltipBorder}",
    /** Grid stroke */
    grid: "{color.chart.gridStroke}",
    /** Cursor */
    cursor: "{color.chart.cursorFill}",
    /** Tick/axis labels */
    tick: "{color.chart.tickLabel}",
    /** Chart legend / label text */
    label: "{color.chart.label}",
  },
} as const;

// ─── Typography Semantic Tokens ───────────────────────────────────────────────

const semanticTypography = {
  /**
   * Font family roles.
   */
  family: {
    /** Used on h1–h6 globally, brand text, stat numbers. */
    display: "{font.family.display}",
    /** Used on body text, nav, UI elements. */
    body: "{font.family.body}",
    /** Used on stats, code, lottery numbers. */
    mono: "{font.family.mono}",
  },

  /**
   * Named text scale — maps role to size.
   */
  scale: {
    /** Chart source labels. */
    chartTick: "{font.size.11}",
    /** Tooltips, XS labels. */
    tooltip: "{font.size.12}",
    /** Stat label (UPPERCASE), nav items. */
    label: "{font.size.xs}",
    /** Body small, descriptions. */
    sm: "{font.size.sm}",
    /** Body text. */
    base: "{font.size.base}",
    /** Section subtitles. */
    lg: "{font.size.lg}",
    /** Lead text. */
    xl: "{font.size.xl}",
    /** Card titles. */
    "2xl": "{font.size.2xl}",
    /** Section headings (mobile). */
    heading: "{font.size.3xl}",
    /** Section headings (desktop). */
    headingLg: "{font.size.4xl}",
    /** Hero text small. */
    hero: "{font.size.5xl}",
    /** Hero text desktop. */
    heroLg: "{font.size.7xl}",
    /** Stat number display. */
    stat: "{font.size.3xl}",
  },
} as const;

// ─── Spacing Semantic Tokens ──────────────────────────────────────────────────

const semanticSpacing = {
  /** Component internal padding — tight (e.g. pill btn). */
  componentXs: "{spacing.1.5}",
  /** Component internal padding — standard (e.g. card). */
  componentSm: "{spacing.3}",
  /** Component internal padding — comfortable (e.g. larger card). */
  componentMd: "{spacing.4}",
  /** Component internal padding — loose (card with breathing room). */
  componentLg: "{spacing.6}",
  /** Component gap — sibling items. */
  gapXs: "{spacing.1}",
  gapSm: "{spacing.2}",
  gapMd: "{spacing.3}",
  gapLg: "{spacing.4}",
  /** Section vertical padding. */
  sectionY: "{spacing.20}",
  /** Container horizontal padding. */
  containerX: "{spacing.containerPadding}",
} as const;

// ─── Border Radius Semantic Tokens ────────────────────────────────────────────

const semanticRadius = {
  /** Tightest — used nowhere currently, reserved. */
  none: "{radius.none}",
  /** Input, small elements. */
  sm: "{radius.sm}",
  /** Buttons, badges. */
  md: "{radius.md}",
  /** Cards (shadcn default: var(--radius)). */
  card: "{radius.lg}",
  /** Larger cards, panels. */
  panel: "{radius.xl}",
  /** Hero buttons, prominent CTAs. */
  cta: "{radius.2xl}",
  /** Pills, lottery balls, coins. */
  full: "{radius.full}",
} as const;

// ─── Shadow Semantic Tokens ───────────────────────────────────────────────────

const semanticShadow = {
  /** Subtle card depth. */
  sm: "{shadow.sm}",
  /** Standard card elevation. */
  md: "{shadow.md}",
  /** Deep panel elevation. */
  lg: "{shadow.lg}",
  /** Hover/active state gold ring. */
  brandRing: "{shadow.gold}",
  /** Ambient gold glow. */
  brandGlow: "{shadow.glow}",
  /** Lottery ball 3D effect. */
  ball: "{shadow.ball}",
  /** Modal/dialog depth. */
  modal: "{shadow.xl}",
} as const;

// ─── Assembled Semantic Tokens ────────────────────────────────────────────────

export const semantic = {
  color: semanticColor,
  typography: semanticTypography,
  spacing: semanticSpacing,
  radius: semanticRadius,
  shadow: semanticShadow,
} as const;

export type SemanticTokens = typeof semantic;
