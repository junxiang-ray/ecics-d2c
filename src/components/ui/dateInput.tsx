import { clsx } from 'clsx';
import { forwardRef, memo, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  error?: boolean;
  flowstep: number;
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

      const today = new Date();
      const tempDay = today;

      //output date validation to the users to show from today's date
      const minDate =
        props.flowstep === 1
          ? today.toISOString().split('T')[0]
          : props.flowstep === 2
            ? ''
            : props.min;

      tempDay.setMonth(today.getMonth() + 3);
      const maxDate = tempDay.toISOString().split('T')[0];
      const safeValue = value && minDate && minDate < value ? minDate : value;

      return (
        <div className='relative'>
          <input
            type='date'
            disabled={disabled}
            min={minDate}
            max={maxDate}
            value={safeValue || ''}
            onChange={handleChange}
            ref={ref}
            style={{ WebkitAppearance: 'none' }} // hides native icon
            className={twMerge(
              clsx(
                'h-14 w-full rounded-xl border-2 px-4 text-base transition-all duration-200',
                'bg-white hover:border-brand-blue/60 hover:shadow-sm focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10',
                'placeholder:text-gray-500',
                disabled && 'pointer-events-none cursor-not-allowed opacity-50',
                error ? 'border-red-500' : 'border-gray-200',
                'appearance-none', // remove native styling
                className,
              ),
            )}
            {...props}
          />
          {/* <Calendar
            className={clsx(
              'pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2',
              'text-gray-400',
            )}
          /> */}
        </div>
      );
    },
  ),
);

DateInput.displayName = 'DateInput';
