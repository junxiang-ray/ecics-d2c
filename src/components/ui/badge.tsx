import * as React from 'react';

import { cn } from '@/libs/utils/utils'; // your cn function for merging classes

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default:
    'border-transparent bg-primary text-primary-foreground hover:bg-primary/90',
  secondary:
    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90',
  destructive:
    'border-transparent bg-destructive text-white hover:bg-destructive/90',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
};

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  ...props
}) => {
  return (
    <span
      data-badge
      className={cn(
        'inline-flex w-fit items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium [&>svg]:pointer-events-none',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
};
