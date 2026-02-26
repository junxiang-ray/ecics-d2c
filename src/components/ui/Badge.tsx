import * as React from 'react';
import { cn } from '@/libs/utils/utils';

// Extended color palette from version 1 + flexibility
type BadgeColor =
  | 'blue'
  | 'purple'
  | 'cyan'
  | 'green'
  | 'lightgreen'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'gray'
  | 'primary'
  | 'secondary'
  | 'destructive';

type BadgeSize = 'sm' | 'md' | 'lg';
type BadgeVariant = 'default' | 'pill' | 'outline';
type BadgeFont =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  content?: string;
  color?: BadgeColor;
  size?: BadgeSize;
  variant?: BadgeVariant;
  bordered?: boolean;
  font?: BadgeFont;
}

const COLOR_STYLES: Record<
  BadgeColor,
  { text: string; bg: string; border: string }
> = {
  // Original colors from version 1
  lightgreen: {
    text: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  green: {
    text: 'text-green-800',
    bg: 'bg-green-100',
    border: 'border-green-200',
  },
  blue: {
    text: 'text-blue-800',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
  },
  cyan: {
    text: 'text-[#02ADEF]',
    bg: 'bg-[#02ADEF]/10',
    border: 'border-[#02ADEF]',
  },
  red: {
    text: 'text-red-800',
    bg: 'bg-red-100',
    border: 'border-red-200',
  },
  yellow: {
    text: 'text-yellow-800',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
  },
  orange: {
    text: 'text-orange-800',
    bg: 'bg-orange-100',
    border: 'border-orange-200',
  },
  gray: {
    text: 'text-gray-800',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
  },
  purple: {
    text: 'text-purple-800',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
  },
  // Semantic colors from version 2
  primary: {
    text: 'text-primary-foreground',
    bg: 'bg-primary',
    border: 'border-primary',
  },
  secondary: {
    text: 'text-secondary-foreground',
    bg: 'bg-secondary',
    border: 'border-secondary',
  },
  destructive: {
    text: 'text-white',
    bg: 'bg-destructive',
    border: 'border-destructive',
  },
};

const SIZE_STYLES: Record<BadgeSize, string> = {
  sm: 'h-[19.5px] px-[7px] text-[10.5px]',
  md: 'h-[21px] px-[7px] text-xs',
  lg: 'h-[26.5px] px-[10.5px] text-sm',
};

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  default: 'rounded-md',
  pill: 'rounded-full',
  outline: 'rounded-md border bg-transparent',
};

export const Badge: React.FC<BadgeProps> = ({
  content,
  children,
  color = 'gray',
  size = 'md',
  variant = 'pill',
  bordered = false,
  font = 'normal',
  className,
  ...props
}) => {
  const styles = COLOR_STYLES[color] || COLOR_STYLES.gray;

  // Support both content prop (v1) and children (v2)
  const displayContent = content ?? children;

  // If variant is outline, use outline styles
  const isOutline = variant === 'outline';

  return (
    <span
      data-badge
      className={cn(
        'inline-flex w-fit items-center justify-center gap-1 whitespace-nowrap font-medium [&>svg]:pointer-events-none',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        isOutline ? 'border-gray-300 text-gray-700' : styles.text,
        !isOutline && styles.bg,
        bordered && !isOutline && `border ${styles.border}`,
        font && `font-${font}`,
        className,
      )}
      {...props}
    >
      {displayContent}
    </span>
  );
};

// Legacy default export for backward compatibility
export default Badge;
export type { BadgeProps as Props };
