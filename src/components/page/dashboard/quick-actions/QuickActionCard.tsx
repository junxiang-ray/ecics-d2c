import React from 'react';
import BoxIcon from '@/components/ui/BoxIcon';

interface Props {
  icon: JSX.Element;
  className: string;
  title: string | JSX.Element;
  subTitle: string | JSX.Element;
}

const QuickActionCard = ({
  icon,
  className,
  title,
  subTitle,
}: Props): React.ReactNode => {
  return (
    <div
      className={`group relative cursor-pointer rounded-xl border border-[#fff0] bg-white p-6 transition-all duration-200 hover:shadow-lg ${className ?? ''}`}
    >
      <div className='absolute inset-0 z-0 rounded-xl shadow-[0_0_0_1px_#e5e7eb] transition-all duration-200 hover:opacity-30 hover:shadow-[0_0_0_1px_currentColor] ' />
      <div className='z-2 pointer-events-none relative flex flex-col items-center space-y-4 text-center'>
        <BoxIcon icon={icon} size='lg' />
        <div className='text-sm'>
          <p className='mb-1 font-heading font-semibold text-gray-900'>
            {title}
          </p>
          <p className='font-body text-xs text-gray-600'>{subTitle}</p>
        </div>
      </div>
    </div>
  );
};
export default QuickActionCard;
