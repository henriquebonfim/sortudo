import { type BallBadgeProps, ballColorValues, ballSizeStyles } from '@/components/ui';
import React from 'react';

export const BallBadge = React.memo(function BallBadge({
  number,
  color,
  size = 'md',
  highlighted = false,
  dimmed = false,
  'aria-label': ariaLabel,
}: BallBadgeProps) {
  const resolvedColor =
    color && color in ballColorValues
      ? ballColorValues[color as keyof typeof ballColorValues]
      : color ?? ballColorValues.cold;

  return (
    <div
      role="img"
      aria-label={ariaLabel ?? `Número ${number}`}
      className={[
        'inline-flex items-center justify-center rounded-full',
        'font-mono font-semibold tabular-nums',
        'transition-all duration-200',
        ballSizeStyles[size],
        dimmed ? 'opacity-40' : '',
        highlighted ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        background: resolvedColor,
        color: 'hsl(var(--primary-foreground))',
      }}
    >
      {String(number).padStart(2, '0')}
    </div>
  );
});
