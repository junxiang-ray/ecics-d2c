'use client';
import clsx from 'clsx';
import { stat } from 'fs';
import Image from 'next/image';
import { useState } from 'react';

export type Status = 'new' | 'completed';
export default function AddOnRow({
  title,
  iconLink,
  status,
  isRecommended = false,
  children,
}: {
  title: string;
  iconLink: string;
  status: Status;
  isRecommended?: boolean;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={clsx(
        'relative rounded-xl border-[1px] bg-gray-100 p-4 shadow-md',
        {
          'pt-6': isRecommended,
          'bg-sky-200': status === 'completed',
          'border-sky-600': status === 'new',
        },
      )}
    >
      {isRecommended && status === 'new' && (
        <div className='absolute -top-4 right-3 rounded-full bg-sky-500 px-3 py-1'>
          <span className='text-white'>Recommended</span>
        </div>
      )}
      <div className='flex w-full items-center justify-between gap-4'>
        {status === 'new' ? (
          <div className='flex items-center gap-4'>
            <Image src={iconLink} alt='health' width={20} height={20} />
            <p className='font-bold'>{title}</p>
          </div>
        ) : (
          <div className='flex items-center gap-4 rounded-full'>
            <div className='rounded-full bg-white p-1'>
              <Image
                src='/icons/add-on/finish.svg'
                alt='health'
                width={16}
                height={16}
                className='rounded-full bg-white'
              />
            </div>
            <p className='font-bold'>{title}</p>
          </div>
        )}
        <Image
          src='/icons/add-on/arrow-down.svg'
          alt='health'
          className={clsx({
            'rotate-180': isOpen,
            'rounded-full bg-white': status === 'completed',
          })}
          width={24}
          height={24}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && <div className='pt-2'>{children}</div>}
    </div>
  );
}
