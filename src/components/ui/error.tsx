import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/libs/utils/utils';

type Variant = 'box' | 'inline';

interface ErrorProps {
  variant?: Variant;
  message?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  errorRef?: React.RefObject<HTMLDivElement>;
}

export default function Error({
  variant = 'box',
  message,
  className,
  children,
  errorRef,
}: ErrorProps) {
  // compact inline variant (single-line, no panel)
  if (variant === 'inline') {
    return (
      <div ref={errorRef} className={cn('mt-2', className)}>
        <p className='m-0 flex items-center gap-2 text-sm text-red-600'>
          <span className='flex size-4 items-center justify-center rounded-full bg-red-600 text-xs text-white'>
            !
          </span>
          <span>{message || children}</span>
        </p>
      </div>
    );
  }

  // boxed panel variant (default) — now includes an icon like InlineNotice
  return (
    <div
      ref={errorRef}
      className={cn(
        'mt-2 rounded-lg border border-red-200 bg-red-50 p-3',
        className,
      )}
    >
      <p className='m-0 flex items-start gap-2 text-sm text-red-600'>
        <AlertCircle className='mt-0.5 size-5 flex-shrink-0 text-red-600' />
        <span className='mt-0.5'>{message || children}</span>
      </p>
    </div>
  );
}
