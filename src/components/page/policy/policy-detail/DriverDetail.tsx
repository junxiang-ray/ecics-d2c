'use client';

import { useState } from 'react';
import { DriverInfo } from '@/libs/types/policy';

import Card from './PolicyCard';
import UserOutlined from '@/assets/icons/renewal/policy-holder.svg';
import DownOutlined from '@/assets/icons/add-on/down-outlined.svg';

interface Props {
  data?: DriverInfo[];
}

const DriverDetail = ({ data }: Props): JSX.Element | null => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const toggleExpand = (idx: number) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  const row = (
    label: string,
    content?: JSX.Element | string | number,
    className?: string,
  ): JSX.Element => (
    <div>
      <label className='font-body mb-1.5 block text-sm font-medium text-gray-700'>
        {label}
      </label>
      <p
        className={`font-body text-base font-semibold text-gray-900 opacity-80 ${className ?? ''}`}
      >
        {content || '-'}
      </p>
    </div>
  );

  return (
    <Card
      title='Named Driver'
      subTitle={`Additional drivers covered under this policy (${data.length})`}
      icon={<UserOutlined width='21' height='21' />}
    >
      <div className='space-y-4'>
        {data.map((driver, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className='overflow-hidden rounded-lg border border-gray-200 bg-white'
            >
              {/* Header */}
              <div className='flex items-center justify-between bg-gray-50 px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <span className='font-body text-sm font-medium text-gray-700'>
                    {driver.name ?? '-'}
                  </span>
                  {driver.is_main_driver && (
                    <span className='inline-flex items-center rounded-full bg-[#02ADEF] px-2 py-1 text-xs font-medium text-white'>
                      Main Driver
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleExpand(idx)}
                  className='rounded p-1 transition hover:bg-gray-200'
                  aria-expanded={isExpanded}
                >
                  <DownOutlined
                    className={`h-4 w-4 text-gray-600 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className='px-6 py-6'>
                  <div className='font-heading mb-4 font-semibold text-gray-900'>
                    Driver Details
                  </div>

                  <div className='grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2'>
                    {row('Full Name', driver.name)}
                    {row('NRIC / FIN', driver.nric_or_fin)}
                    {row('Date of Birth', driver.date_of_birth)}
                    {row('Gender', driver.gender, 'capitalize')}
                    {row('Marital Status', driver.marital_status, 'capitalize')}
                    {row(
                      'Driving Experience',
                      driver.driving_experience != null
                        ? `${driver.driving_experience} years`
                        : '-',
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default DriverDetail;
