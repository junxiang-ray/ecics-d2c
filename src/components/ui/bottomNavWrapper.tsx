import React from 'react';
import { cn } from '@/libs/utils/utils';

interface BottomNavWrapperProps {
  children: React.ReactNode;
  className?: string;
  // if you want to override the max width of the container
  maxWidthClass?: string;
  innerContainerClassName?: string;
}

// wrapper component for bottom navbars
export const BottomNavWrapper: React.FC<BottomNavWrapperProps> = ({
  children,
  className,
  maxWidthClass = 'max-w-4xl',
  innerContainerClassName,
}) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'border-t-2 border-gray-200 bg-white',
        'shadow-[0_-4px_12px_rgba(0,0,0,0.08)]',
        className,
      )}
    >
      <div className={cn('mx-auto px-3 sm:px-4 lg:px-6', maxWidthClass)}>
        <div className={cn('sm:py-4', innerContainerClassName)}>{children}</div>
      </div>
    </div>
  );
};

export default BottomNavWrapper;
