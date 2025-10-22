'use client';

import { cn } from '@/libs/utils/utils';
import { Label } from '@/components/ui/label';
import { ReactNode } from 'react';

interface OptionSelectorOption {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode; // optional icon for each option
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
        {options.map((opt) => (
          <div
            key={opt.value}
            onClick={() => onChange?.(opt.value)}
            className={cn(
              'cursor-pointer rounded-xl border-2 px-6 py-4 text-center shadow-sm transition-all duration-300',
              'hover:scale-105 hover:shadow-md',
              selected === opt.value
                ? 'scale-105 border-[#02ADEF] bg-[#02ADEF] text-white shadow-lg'
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#02ADEF]/50',
            )}
          >
            <div className='flex flex-col items-center gap-1'>
              {opt.icon && <div className='mb-1'>{opt.icon}</div>}
              <span className='text-lg font-semibold'>{opt.label}</span>
              {opt.description && (
                <span
                  className={cn(
                    'text-sm',
                    selected === opt.value ? 'text-blue-100' : 'text-gray-500',
                  )}
                >
                  {opt.description}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
          <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
            !
          </span>
          {error}
        </p>
      )}
    </div>
  );
}
