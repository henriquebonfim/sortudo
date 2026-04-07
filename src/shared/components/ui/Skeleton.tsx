import { cn } from '@/shared/utils/cn';
import type { HTMLAttributes } from 'react';

function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-white/10 border border-white/5', className)}
      {...props}
    />
  );
}

export { Skeleton };
