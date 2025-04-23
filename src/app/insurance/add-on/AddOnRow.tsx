'use client';
import clsx from 'clsx';
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
        'relative rounded-xl border-[1px] bg-gray-100 px-4 py-4 shadow-md',
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
      <div className='flex justify-between'>
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

        {isOpen ? (
          <Image
            src='/icons/add-on/arrow-up.svg'
            alt='health'
            className={clsx({
              'rounded-full bg-white': status === 'completed',
            })}
            width={24}
            height={24}
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <Image
            src='/icons/add-on/arrow-down.svg'
            alt='health'
            className={clsx({
              'rounded-full bg-white': status === 'completed',
            })}
            width={24}
            height={24}
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>
      <div className='pt-2'>{isOpen && <>{children}</>}</div>
    </div>
  );
}
