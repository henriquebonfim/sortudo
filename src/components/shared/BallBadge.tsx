import React from 'react';

interface BallBadgeProps {
  number: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  highlighted?: boolean;
  dimmed?: boolean;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

const BallBadge = React.memo(function BallBadge({
  number,
  color,
  size = 'md',
  highlighted = false,
  dimmed = false,
}: BallBadgeProps) {
  return (
    <div
      className={`ball-shadow inline-flex items-center justify-center rounded-full font-mono font-semibold tabular-nums transition-all duration-200 ${sizes[size]} ${
        dimmed ? 'opacity-40' : ''
      } ${highlighted ? 'ring-2 ring-primary' : ''}`}
      style={{
        background: color || 'hsl(var(--accent-cold))',
        color: '#fff',
      }}
    >
      {String(number).padStart(2, '0')}
    </div>
  );
});

export default BallBadge;
