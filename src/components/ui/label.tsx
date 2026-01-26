import { clsx } from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
  required?: boolean; // adds red asterisk, not forwarded to DOM
};

function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      data-slot='label'
      className={twMerge(
        clsx(
          'mb-2 font-semibold text-gray-700 sm:text-lg',
          'flex select-none items-center gap-2 text-sm leading-none',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
          className,
        ),
      )}
      {...props}
    >
      {children}
      {required && <span className='text-red-500'>*</span>}
    </label>
  );
}

export { Label };
