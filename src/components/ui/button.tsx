import { clsx } from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const buttonVariants = {
  variant: {
    default: 'bg-brand-blue hover:bg-brand-blue/90 text-white', // uses ecics blue
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
    outline: 'border bg-background text-foreground hover:bg-accent',
    secondary: 'bg-brand-green text-white hover:bg-brand-green/80', // uses green (can be used for calculate quote button)
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    default: 'text-base h-9 px-4 py-2',
    sm: 'text-sm h-8 px-3',
    lg: 'text-base h-10 px-6',
    md: 'text-xs h-10 px-6', // extra large for bottom navbar buttons
    icon: 'size-9 rounded-md',
  },
};

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
};

export function Button({
  variant = 'default',
  size = 'default',
  className,
  disabled,
  ...props
}: ButtonProps) {
  const classes = twMerge(
    clsx(
      // Base styles
      'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      // Variant and size
      buttonVariants.variant[variant],
      buttonVariants.size[size],
      // ← EXPLICIT DISABLED STYLES START (only applied when disabled=true)
      disabled && 'pointer-events-none cursor-not-allowed opacity-50',
      className,
    ),
  );
  return <button className={classes} disabled={disabled} {...props} />;
}
