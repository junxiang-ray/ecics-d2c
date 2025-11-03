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
}

export function OptionSelector({
  label,
  labelIcon,
  required = false,
  options,
  selected,
  error,
  onChange,
  className,
  columns = 3,
  variant = 'card',
}: OptionSelectorProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <Label className='flex items-center gap-3 text-lg font-semibold text-gray-700'>
          {labelIcon && <span className='text-[#02ADEF]'>{labelIcon}</span>}
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
                  isSelected
                    ? 'border-[#02ADEF] bg-[#02ADEF]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300',
                )
              : cn(
                  'cursor-pointer rounded-xl border-2 px-6 py-4 text-center shadow-sm transition-all duration-300',
                  'hover:scale-105 hover:shadow-md',
                  isSelected
                    ? 'scale-105 border-[#02ADEF] bg-[#02ADEF] text-white shadow-lg'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#02ADEF]/50',
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
                  {/* If compact + single column, render circular left control like SubCategorySelector */}
                  {columns === 1 ? (
                    <div
                      className={cn(
                        'flex size-5 flex-shrink-0 items-center justify-center rounded-full border-2',
                        isSelected
                          ? 'border-[#02ADEF] bg-[#02ADEF]'
                          : 'border-gray-300 bg-white',
                      )}
                      // keep icon color explicit if an icon is provided
                      style={{
                        color: isSelected ? undefined : opt.color || undefined,
                      }}
                    >
                      {/* when selected show white check, otherwise show provided icon (if any) */}
                      {isSelected ? (
                        <CheckCircle2 className='size-3 text-white' />
                      ) : (
                        (opt.icon ?? null)
                      )}
                    </div>
                  ) : (
                    // default compact square icon behavior (for grid/tiles)
                    opt.icon && (
                      <div
                        className={cn(
                          'flex-shrink-0 rounded-lg p-2.5',
                          isSelected ? 'bg-[#02ADEF]/10' : 'bg-gray-100',
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
                      <p className='mt-0 font-semibold text-gray-800'>
                        {opt.label}
                      </p>
                      {isSelected && (
                        // keep this check for parity with category style (appears to the right of label)
                        <CheckCircle2 className='size-4 flex-shrink-0 text-[#02ADEF]' />
                      )}
                    </div>
                    {/* For single-column subcategory-style we typically don't show a description.
                        Keep description rendering for multi-column compact usage. */}
                    {columns !== 1 && opt.description && (
                      <p className='m-0 mt-1 text-xs text-gray-500'>
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className='flex flex-col items-center gap-1'>
                  {opt.icon && <div className='mb-1'>{opt.icon}</div>}
                  <span className='text-lg font-semibold'>{opt.label}</span>
                  {opt.description && (
                    <span
                      className={cn(
                        'text-sm',
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
