import { clsx } from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

const buttonVariants = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
    outline: 'border bg-background text-foreground hover:bg-accent',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3',
    lg: 'h-10 px-6',
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
  ...props
}: ButtonProps) {
  const classes = twMerge(
    clsx(buttonVariants.variant[variant], buttonVariants.size[size], className),
  );
  return <button className={classes} {...props} />;
}
