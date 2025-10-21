import { clsx } from 'clsx';
import { Calendar } from 'lucide-react';
import { forwardRef, memo, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  error?: boolean;
  onChange?: (value: string) => void;
}

export const DateInput = memo(
  forwardRef<HTMLInputElement, DateInputProps>(
    ({ className, error, disabled, onChange, value, ...props }, ref) => {
      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange?.(e.target.value);
        },
        [onChange],
      );

      return (
        <div className='relative'>
          <input
            type='date'
            disabled={disabled}
            value={value || ''}
            onChange={handleChange}
            ref={ref}
            className={twMerge(
              clsx(
                'h-14 w-full rounded-xl border-2 px-4 pr-12 text-base transition-all duration-200',
                'bg-white hover:border-[#02ADEF]/60 hover:shadow-sm focus:border-[#02ADEF] focus:outline-none focus:ring-4 focus:ring-[#02ADEF]/10',
                'placeholder:text-gray-500',
                disabled && 'pointer-events-none cursor-not-allowed opacity-50',
                error ? 'border-red-500' : 'border-gray-200',
                className,
              ),
            )}
            {...props}
          />
          <Calendar
            className={clsx(
              'pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2',
              'text-gray-400',
            )}
          />
        </div>
      );
    },
  ),
);

DateInput.displayName = 'DateInput';
