import * as React from 'react';

import { cn } from '@/libs/utils/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'min-h-14 w-full rounded-xl border-2 bg-white px-4 py-3 text-sm transition-all duration-200',
        'hover:border-[#02ADEF]/60 hover:shadow-sm',
        'focus:border-[#02ADEF] focus:outline-none focus:ring-4 focus:ring-[#02ADEF]/10',
        'placeholder:text-gray-500',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'border-gray-200',
        'resize-none',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
