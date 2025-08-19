'use client';

import React, { useState } from 'react';

import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';

interface InfoCardProps {
  icon?: React.ReactNode;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  isPolicyRenewalScreen?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  subtitle,
  children,
  defaultOpen = true,
  isPolicyRenewalScreen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    if (isPolicyRenewalScreen) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className='mt-4 overflow-hidden rounded-lg border border-gray-200 shadow-sm'>
      <div
        className={`flex items-center justify-between border-b bg-[linear-gradient(90deg,#02ADEF14_0%,#0EA5E933_5%,#EEF2FFCC_100%)] px-4 py-6 
                    ${isPolicyRenewalScreen ? 'cursor-pointer' : ''}`}
        onClick={handleToggle}
      >
        <div className='flex items-center gap-2'>
          {icon && (
            <div className='flex items-center justify-center rounded-[10px] bg-sky-500/10 p-2'>
              {icon}
            </div>
          )}
          <div className='ml-2 flex flex-col'>
            <span className='break-words text-[28px] font-bold leading-[1.0] text-gray-900'>
              {title}
            </span>
            {subtitle && (
              <span className='mt-[6px] text-[12px] font-normal text-gray-500'>
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {isPolicyRenewalScreen && (
          <div className='ml-4'>
            {isOpen ? <ArrowUpIcon size={18} /> : <ArrowDownIcon size={18} />}
          </div>
        )}
      </div>
      {(!isPolicyRenewalScreen || isOpen) && (
        <div className='p-4'>{children}</div>
      )}
    </div>
  );
};

export default InfoCard;
