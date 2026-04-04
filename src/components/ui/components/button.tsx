import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib";
import { buttonVariants, type ButtonProps } from "@/components/ui/types";

/**
 * Enhanced Button component — Design System Compliant
 *
 * Implements: variant switching, loading state, icon slots, and accessibility props.
 * Uses strict typing from button.types.ts.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
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
        <span className={cn(loading && "opacity-0")}>{children}</span>
        {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
