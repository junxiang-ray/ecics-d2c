import * as React from 'react';

import { cn } from '../../libs/utils/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card'
      className={cn(
        'mb-6 flex flex-col gap-6 overflow-hidden rounded-xl border border-0 shadow-xl',
        className,
      )}
      {...props}
    />
  );
}

// New Cardheader enhancement with structured props and gradient support

// Based on figma, these are the gradient styles i could identify
type GradientVariant = 'none' | 'blue' | 'green' | 'orange';

const gradientVariants: Record<Exclude<GradientVariant, 'none'>, string> = {
  blue: 'bg-gradient-to-r from-[rgba(2,173,239,0.08)] via-blue-50/80 to-indigo-50/50',
  green:
    'bg-gradient-to-r from-[rgba(82,196,26,0.08)] via-green-50/80 to-emerald-50/50',
  orange:
    'bg-gradient-to-r from-[rgba(244,157,0,0.08)] via-orange-50/80 to-amber-50/50',
};

// background for icon wrapper based on gradient variant
const iconBgByVariant: Record<Exclude<GradientVariant, 'none'>, string> = {
  blue: 'bg-brand-blue/10',
  green: 'bg-brand-green/10',
  orange: 'bg-brand-orange/10',
};

interface CardHeaderProps extends React.ComponentProps<'div'> {
  // Structured header props
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;

  // Gradient support
  gradientVariant?: GradientVariant;
  gradientClassName?: string; // custom gradient override
  withDivider?: boolean; // adds border-b

  // Icon wrapper customization
  iconWrapperClassName?: string;
}

function CardHeader({
  className,
  icon,
  title,
  description,
  action,
  children,
  gradientVariant = 'none',
  gradientClassName,
  withDivider,
  iconWrapperClassName,
  ...props
}: CardHeaderProps) {
  // checks for structured header usage
  const hasStructured = icon || title || description || action;

  // gradient and divider logic
  const hasGradient = !!gradientClassName || gradientVariant !== 'none';
  const showDivider =
    typeof withDivider === 'boolean' ? withDivider : hasGradient;

  // if it's structured, render the new header
  if (hasStructured) {
    return (
      <div
        data-slot='card-header'
        className={cn(
          // Base padding
          'p-8',
          // Gradient background
          hasGradient &&
            (gradientClassName ||
              gradientVariants[
                gradientVariant as Exclude<GradientVariant, 'none'>
              ]),
          // Divider
          showDivider && 'border-b border-gray-100',
          className,
        )}
        {...props}
      >
        <div className='flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            {icon && (
              <div
                className={cn(
                  'flex-shrink-0 rounded-xl p-3',
                  iconWrapperClassName ||
                    (hasGradient && gradientVariant !== 'none'
                      ? iconBgByVariant[
                          gradientVariant as Exclude<GradientVariant, 'none'>
                        ]
                      : 'bg-gray-100'),
                )}
              >
                {icon}
              </div>
            )}
            {(title || description) && (
              <div className='mb-3'>
                {title && (
                  <h2 className='m-0 mb-1 text-2.5xl font-bold leading-tight text-gray-800'>
                    {title}
                  </h2>
                )}
                {description && (
                  <p className='m-0 text-sm text-gray-600'>{description}</p>
                )}
              </div>
            )}
          </div>
          {action && <div data-slot='card-action'>{action}</div>}
        </div>

        {/* Optional additional content below structured header */}
        {children && <div className='mt-4'>{children}</div>}
      </div>
    );
  }

  // old header fallback
  return (
    <div
      data-slot='card-header'
      className={cn(
        '@container/card-header has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <h4
      data-slot='card-title'
      className={cn('leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <p
      data-slot='card-description'
      className={cn('text-zinc-600', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn('p-4 px-6 sm:p-6 lg:p-8 [&:last-child]:pb-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn('[.border-t]:pt-6 flex items-center px-6 pb-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
