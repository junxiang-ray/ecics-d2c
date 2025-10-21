import { clsx } from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
};

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot='label'
      className={twMerge(
        clsx(
          'flex select-none items-center gap-2 text-sm font-medium leading-none',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
          'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
          className,
        ),
      )}
      {...props}
    />
  );
}

export { Label };
