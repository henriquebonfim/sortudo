import { cn } from '@/shared/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { buttonVariants } from './Button.variants';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Enhanced Button component — Design System Compliant (Atom)
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = 'flex items-center gap-1.5 px-3 py-1.5 sm:gap-2 sm:px-4 sm:py-2 rounded-full border flex-shrink-0 text-[11px] sm:text-xs font-semibold bg-primary/5 hover:bg-primary/10 text-primary border-primary/20 hover:text-primary',
      variant,
      size,
      asChild = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        type={type}
        {...props}
      >
        {loading && (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        <span className={cn(loading && 'opacity-0')}>{children}</span>
        {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
