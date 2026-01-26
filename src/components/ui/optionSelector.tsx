'use client';

import { CheckCircle2 } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/libs/utils/utils';

import Error from '@/components/ui/error';
import { Label } from '@/components/ui/label';

interface OptionSelectorOption {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode; // optional icon for each option
  color?: string; // optional icon color (used by compact variant)
}

interface OptionSelectorProps {
  /** Section label text */
  label?: string;
  /** Icon to appear before the label (e.g. <Building />) */
  labelIcon?: ReactNode;
  /** Whether the field is required */
  labelClassName?: string;
  /** Label Classnames */
  required?: boolean;
  /** List of options */
  options: OptionSelectorOption[];
  /** Currently selected value */
  selected?: string;
  /** Error message text */
  error?: string;
  /** Callback when an option is clicked */
  onChange?: (value: string) => void;
  /** Custom styling */
  className?: string;
  /** Grid column layout */
  columns?: 1 | 2 | 3;
  /** Visual style */
  variant?: 'card' | 'compact';
  /** When true, show the small selected check to the right for compact variants (except single-column) */
  requireSelectedCheck?: boolean;
  /** Selected color token for compact variants. 'blue' (default), 'green', or 'orange' */
  selectedColor?: 'blue' | 'green' | 'orange';
}

/** Map token to CSS utility classes (brand-* are project tokens) */
const COLOR_CLASSES: Record<
  NonNullable<OptionSelectorProps['selectedColor']>,
  { border: string; bg: string; iconBg: string; text: string }
> = {
  blue: {
    border: 'border-brand-blue',
    bg: 'bg-brand-blue/5',
    iconBg: 'bg-brand-blue/10',
    text: 'text-brand-blue',
  },
  green: {
    border: 'border-brand-green',
    bg: 'bg-brand-green/5',
    iconBg: 'bg-brand-green/10',
    text: 'text-brand-green',
  },
  orange: {
    border: 'border-brand-orange',
    bg: 'bg-brand-orange/5',
    iconBg: 'bg-brand-orange/10',
    text: 'text-brand-orange',
  },
};

export function OptionSelector({
  label,
  labelIcon,
  labelClassName,
  required = false,
  options,
  selected,
  error,
  onChange,
  className,
  columns = 3,
  variant = 'card',
  requireSelectedCheck = false,
  selectedColor = 'blue',
}: OptionSelectorProps) {
  const colorCls = COLOR_CLASSES[selectedColor];

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <Label className={cn('gap-3 text-lg', labelClassName)}>
          {labelIcon && <span className='text-brand-blue'>{labelIcon}</span>}
          {label}
          {required && <span className='text-red-500'>*</span>}
        </Label>
      )}

      <div
        className={cn(
          'grid gap-4',
          columns === 1 && 'grid-cols-1',
          columns === 2 && 'sm:grid-cols-2',
          columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {options.map((opt) => {
          const isSelected = selected === opt.value;

          const baseItem =
            variant === 'compact'
              ? cn(
                  'rounded-xl border-2 p-4 text-left transition-all duration-200',
                  'hover:shadow-md active:scale-[0.98]',
                  // compact selected state applies brand color classes, otherwise neutral border/bg
                  isSelected
                    ? cn(colorCls.border, colorCls.bg, 'shadow-md')
                    : 'border-gray-200 bg-white hover:border-gray-300',
                )
              : cn(
                  'cursor-pointer rounded-xl border-2 px-6 py-4 text-center shadow-sm transition-all duration-300',
                  'hover:scale-105 hover:shadow-md',
                  isSelected
                    ? 'scale-105 border-brand-blue bg-brand-blue text-white shadow-lg'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-brand-blue/50',
                );

          // choose alignment for the compact row: center for single-column (subcategory style), top for multi-column tiles
          const compactRowAlignment =
            variant === 'compact' && columns === 1
              ? 'flex items-center gap-3'
              : 'flex items-start gap-3';

          return (
            <div
              key={opt.value}
              onClick={() => onChange?.(opt.value)}
              className={cn('cursor-pointer', baseItem)}
            >
              {variant === 'compact' ? (
                <div className={compactRowAlignment}>
                  {/* compact + single column:
                      - when selected: render CHECK icon ONLY (no outer circle wrapper) using selectedColor text class
                      - when not selected: show empty grey circle */}
                  {columns === 1 ? (
                    isSelected ? (
                      <CheckCircle2
                        className={cn('size-5 flex-shrink-0', colorCls.text)}
                      />
                    ) : (
                      <div className='flex size-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white' />
                    )
                  ) : (
                    // default compact square icon behavior (for grid/tiles):
                    // icon is grey normally and inherits opt.color when selected; selected icon background uses colorCls.iconBg
                    opt.icon && (
                      <div
                        className={cn(
                          'flex-shrink-0 rounded-lg p-2.5',
                          isSelected ? colorCls.iconBg : 'bg-gray-100',
                        )}
                        style={{
                          color: isSelected ? opt.color : '#6B7280',
                        }}
                      >
                        {opt.icon}
                      </div>
                    )
                  )}

                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <p className='mt-0 text-sm font-semibold text-gray-800'>
                        {opt.label}
                      </p>

                      {/* Show the tiny right-side check only when:
                          - the option is selected
                          - variant is compact
                          - caller requested requireSelectedCheck
                          - not in single-column compact (we keep single-col left-check-only behavior) */}
                      {isSelected &&
                        variant === 'compact' &&
                        requireSelectedCheck &&
                        columns !== 1 && (
                          <CheckCircle2
                            className={cn(
                              'size-4 flex-shrink-0',
                              colorCls.text,
                            )}
                          />
                        )}
                    </div>

                    {/* Show description when provided, even in single-column compact variant */}
                    {opt.description && (
                      <p className='text-3xs m-0 mt-1 leading-normal text-gray-500'>
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                // Card variant rendered here (insurance)
                <div className='flex flex-col items-center gap-1'>
                  {opt.icon && <div className='mb-1'>{opt.icon}</div>}
                  <span className='text-lg font-semibold'>{opt.label}</span>
                  {opt.description && (
                    <span
                      className={cn(
                        'text-xs',
                        isSelected ? 'text-blue-100' : 'text-gray-500',
                      )}
                    >
                      {opt.description}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <Error variant='inline' message={error} />}
    </div>
  );
}
