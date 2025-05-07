'use client';

import { Select } from 'antd';
import { useState } from 'react';

import { SecondaryButton } from '@/components/ui/buttons';

import AddOnRow, { Status } from './AddOnRow';

export interface AddOnRowData {
  title: string;
  icon: React.ReactNode;
}

export default function AddOnRowDetail({
  title,
  icon,
  isRecommended = false,
}: {
  title: string;
  icon: React.ReactNode;
  isRecommended?: boolean;
}) {
  const [status, setStatus] = useState<Status>('new');
  return (
    <AddOnRow
      isRecommended={isRecommended}
      title={title}
      icon={icon}
      status={status}
    >
      {status === 'new' && (
        <>
          <p className='text-[13px] font-semibold leading-[19px] text-[#535353]'>
            Get reimbursed for replacing your car keys if they’re lost due to
            theft, robbery, or an accident.
          </p>
          <div className='my-2 border-t border-dashed border-[#00ADEFB2]' />
          <div className='flex items-center justify-between text-[14px]'>
            <p className='font-semibold leading-[20px] text-[#525252]'>
              Select Coverage Amount
            </p>
            <Select
              defaultValue='jack'
              style={{ width: 120 }}
              className='[&_.ant-select-selector]:border-0.5 w-28 [&_.ant-select-selector]:border-[#00ADEF]'
              options={[
                {
                  value: 'jack',
                  label: (
                    <span className='font-semibold text-[#1E1E1E]'>
                      SGD 500
                    </span>
                  ),
                },
                {
                  value: 'lucy',
                  label: (
                    <span className='font-semibold text-[#1E1E1E]'>
                      SGD 500
                    </span>
                  ),
                },
                {
                  value: 'Yiminghe',
                  label: (
                    <span className='font-semibold text-[#1E1E1E]'>
                      SGD 500
                    </span>
                  ),
                },
              ]}
            />
          </div>
          <div className='flex items-center justify-between pt-2 text-[14px] font-semibold leading-5'>
            <p className='text-[#525252]'>SGD 43</p>
            <SecondaryButton
              className='black h-8 w-28 rounded-md !border-[#00ADEF] border-[0.5] py-0 leading-4 text-[#1E1E1E]'
              onClick={() => setStatus('completed')}
            >
              Add
            </SecondaryButton>
          </div>
        </>
      )}
      {status === 'completed' && (
        <>
          <p className='font-semibold leading-5 text-[#333333]'>
            Get reimbursed for replacing your car keys if they’re lost due to
            theft, robbery, or an accident.
          </p>
          <div className=' my-2 border-t border-dashed border-[#00ADEFB2]' />
          <div className='flex items-center justify-between pt-2 text-[14px]'>
            <p className='font-semibold leading-[20px] text-[#333333]'>
              SGD 43
            </p>
            <SecondaryButton
              className='h-8 w-28 rounded-md py-0 leading-4 text-red-500'
              onClick={() => setStatus('new')}
            >
              Remove
            </SecondaryButton>
          </div>
        </>
      )}
    </AddOnRow>
  );
}
