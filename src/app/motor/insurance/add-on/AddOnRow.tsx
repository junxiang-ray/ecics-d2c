'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import {
  ArrowDownCircleIcon,
  FinishIcon,
} from '@/components/icons/add-on-icons';

import { useDeviceDetection } from '@/hook/useDeviceDetection';

export type Status = 'new' | 'completed';
export default function AddOnRow({
  title,
  icon,
  status,
  isRecommended = false,
  isRequired = false,
  isIncluded = false,
  children,
}: {
  title: string | null;
  icon: React.ReactNode;
  status: Status;
  isRecommended?: boolean;
  isRequired?: boolean;
  isIncluded?: boolean;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={clsx(
        'relative rounded-xl border-[1px] p-4 md:min-h-[100px] md:border-[1.25px]',
        {
          'pt-6': isRecommended && status === 'new',
          'border-[#11CE00] !bg-white shadow-md': status === 'completed',
          'border-sky-600 md:border-sky-200': status === 'new',
        },
      )}
    >
      {isRecommended && status === 'new' && (
        <div className='absolute -top-4 right-3 rounded-full bg-sky-500 px-3 py-1'>
          <span className='text-white'>Recommended</span>
        </div>
      )}
      {isRequired && (
        <div className='absolute -top-4 right-3 rounded-full bg-[#FF9500] px-3 py-1'>
          <span className='text-white'>Required</span>
        </div>
      )}
      {isIncluded && (
        <div className='absolute -top-4 right-3 rounded-full bg-[#11CE00] px-3 py-1'>
          <span className='text-white'>Included</span>
        </div>
      )}
      <div className='flex w-full items-center justify-between gap-4'>
        <div className='bg- flex items-center gap-4'>
          {!isRequired && !isIncluded ? (
            <div className='flex h-9 w-9 justify-center rounded-[20px] border border-[#00ADEF] bg-[#00ADEF1A]'>
              {icon}
            </div>
          ) : (
            <FinishIcon
              className='rounded-full bg-white text-[#11CE00]'
              size={28}
            />
          )}
          <p className='font-bold'>{title}</p>
        </div>
      </div>
      {isOpen && <div className='pt-2'>{children}</div>}
    </div>
  );
}
