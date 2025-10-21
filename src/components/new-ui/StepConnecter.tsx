import React from 'react';

import { cn } from '@/libs/utils/utils';

interface StepConnectorProps {
  isCompleted: boolean;
  width?: string; // default to Tailwind width class
  height?: string; // default to Tailwind height class
  className?: string; // for extra custom styling
}

export const StepConnector: React.FC<StepConnectorProps> = ({
  isCompleted,
  width = 'w-16',
  height = 'h-0.5',
  className = '',
}) => {
  return (
    <div className={cn(`mx-6`, className)}>
      <div
        className={cn(
          `${width} ${height} relative overflow-hidden bg-gradient-to-r from-gray-300 to-gray-200`,
        )}
      >
        <div
          className={cn(
            `h-full bg-gradient-to-r from-[#02ADEF] to-[#52c41a] transition-all duration-700`,
            isCompleted ? 'w-full' : 'w-0',
          )}
        />
      </div>
    </div>
  );
};

export default StepConnector;
