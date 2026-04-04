/**
 * Design System — Barrel Export
 *
 * Layer architecture:
 *   1. primitives.ts     — raw typed atoms (HSL channels, font stacks)
 *   2. semantic.ts       — role → primitive mapping
 *   3. tokens.css        — CSS custom properties (applied globally)
 *   4. theme.ts          — JS runtime constants (THEME, COLORS)
 *   4. ThemeProvider.tsx — React context (<ThemeProvider>, useTheme)
 *   atoms/               — Atomic Design exports (colors, typography)
 *
 * @example
 *   import { primitives, semantic, spring, variants } from "@/components/ui";
 *   import { ThemeProvider, useTheme, COLORS } from "@/components/ui";
 *   import type { ButtonProps, StatCardProps, BallBadgeProps } from "@/components/ui";
 */

// ── Primitive Token Layer ────────────────────────────────────────────────────
export { primitives } from "./primitives";
export type { Primitives } from "./primitives";

// ── Semantic Token Layer ─────────────────────────────────────────────────────
export { semantic } from "./semantic";
export type { SemanticTokens } from "./semantic";

// ── Token Utilities ──────────────────────────────────────────────────────────
export {
  resolveToken,
  resolveRef,
  toCSSVar,
  cssVar,
} from "./token-utils";
export type {
  PrimitiveTokenPath,
  SemanticTokenPath,
} from "./token-utils";

// ── Motion Tokens ────────────────────────────────────────────────────────────
export {
  spring,
  duration,
  delay,
  ease,
  stagger,
  variants,
  tailwindAnimations,
} from "./motion";

// ── Component Types ──────────────────────────────────────────────────────────

// Button
export {
  buttonVariants,
  isButtonVariant,
  isButtonSize,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
} from "./types";
export type {
  ButtonProps,
  ButtonVariant,
} from "./types";

// StatCard
export {
  STAT_CARD_VARIANTS,
  statCardVariantStyles,
} from "./types";
export type {
  StatCardVariant,
  StatCardProps,
} from "./types";

// BallBadge
export {
  BALL_SIZES,
  BALL_COLORS,
  ballSizeStyles,
  ballColorValues,
} from "./types";

// SectionHeader

// ── Theme Layer (Layer 4 — Runtime Constants) ─────────────────────────────
export { THEME, COLORS } from "./theme";
export type { Theme } from "./theme";

// ── ThemeProvider (React Context) ─────────────────────────────────────────
export { ThemeProvider, useTheme } from "./ThemeProvider";

// ── Atomic Design Atoms ───────────────────────────────────────────────────
export * from "./atoms";
