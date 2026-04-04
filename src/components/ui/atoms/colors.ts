/**
 * Atomic Design — Colors Atom
 *
 * Re-exports all color constants from the design system's runtime layer.
 * This is the import point for components that need typed color values
 * without pulling in the full THEME object.
 *
 * @example
 *   import { COLORS } from '@/components/ui/atoms/colors';
 *   style={{ background: COLORS.brand }}
 */
export { COLORS, THEME } from '../theme';
export type { Theme } from '../theme';
