import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode, MouseEventHandler } from "react";

// ─── Button Types ────────────────────────────────────────────────────────────

/**
 * Button variants using class-variance-authority.
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    "ring-offset-background transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "motion-safe:transition-colors",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm:      "h-9 rounded-md px-3",
        default: "h-10 px-4 py-2",
        lg:      "h-11 rounded-md px-8",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize    = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-pressed"?: boolean;
  "aria-controls"?: string;
  id?: string;
  type?: "button" | "submit" | "reset";
}

export interface ButtonLoaderProps {
  size?: number;
  "aria-label"?: string;
}

const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "danger",
  "link",
] as const satisfies readonly ButtonVariant[];

const BUTTON_SIZES = ["sm", "default", "lg", "icon"] as const satisfies readonly ButtonSize[];

export function isButtonVariant(value: string): value is ButtonVariant {
  return (BUTTON_VARIANTS as readonly string[]).includes(value);
}

export function isButtonSize(value: string): value is ButtonSize {
  return (BUTTON_SIZES as readonly string[]).includes(value);
}

export { BUTTON_VARIANTS, BUTTON_SIZES };

// ─── StatCard Types ──────────────────────────────────────────────────────────

export const STAT_CARD_VARIANTS = [
  "default",
  "hot",
  "cold",
  "brand",
  "gold",
] as const;

export type StatCardVariant = (typeof STAT_CARD_VARIANTS)[number];

export const statCardVariantStyles = {
  default: "text-foreground",
  hot:     "text-hot",
  cold:    "text-cold",
  brand:   "text-primary",
  gold:    "text-primary",
} as const satisfies Record<StatCardVariant, string>;

export interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  variant?: StatCardVariant;
  className?: string;
  "aria-label"?: string;
}

// ─── BallBadge Types ─────────────────────────────────────────────────────────

export const BALL_SIZES = ["sm", "md", "lg"] as const;
export type BallSize = (typeof BALL_SIZES)[number];

export const ballSizeStyles = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
} as const satisfies Record<BallSize, string>;

export const BALL_COLORS = ["cold", "hot", "gold", "muted", "success"] as const;
export type BallColor = (typeof BALL_COLORS)[number];

export const ballColorValues = {
  cold:    "hsl(var(--cold))",
  hot:     "hsl(var(--hot))",
  gold:    "hsl(var(--primary))",
  muted:   "hsl(var(--muted))",
  success: "hsl(var(--success))",
} as const satisfies Record<BallColor, string>;

export interface BallBadgeProps {
  number: number;
  color?: BallColor | (string & {});
  size?: BallSize;
  highlighted?: boolean;
  dimmed?: boolean;
  "aria-label"?: string;
}

// ─── SectionHeader Types ─────────────────────────────────────────────────────

export interface SectionHeaderProps {
  title: string | ReactNode;
  icon?: ReactNode;
  subtitle?: string;
  className?: string;
  headingLevel?: 1 | 2 | 3 | 4;
  headingId?: string;
}
