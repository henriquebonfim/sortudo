/**
 * Atomic Design — Typography Atom
 *
 * Re-exports font family, size, and weight constants from the primitive layer.
 * This is the import point for components that need typed typography values.
 *
 * @example
 *   import { FONTS } from '@/components/ui/atoms/typography';
 *   style={{ fontFamily: FONTS.family.display.join(', ') }}
 */
import { primitives } from '../primitives';

export const FONTS = primitives.font;
export const SPACING = primitives.spacing;
export const RADIUS = primitives.radius;

export type { Primitives } from '../primitives';
