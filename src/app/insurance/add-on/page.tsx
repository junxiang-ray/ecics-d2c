'use client';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';
import { Select } from 'antd';
import { SecondaryButton } from '@/components/ui/buttons';
import AddOnRow, { Status } from './AddOnRow';
const mapIconToTypeAddOn = [
  {
    type: 'key',
    iconLink: '/icons/add-on/key.svg',
    isRecommended: true,
  },
  {
    type: 'repair',
    iconLink: '/icons/add-on/repair.svg',
  },
  {
    type: 'roadside',
    iconLink: '/icons/add-on/road-side.svg',
  },
];
function AddOnPage() {
  return (
    <div>
      <div className='text-xl font-bold'>Select Add On</div>
      <div className='mt-4 flex flex-col gap-4'>
        {mapIconToTypeAddOn.map((item) => (
          <AddOnRowDetail
            key={item.type}
            title='Get reimbursed for replacing your car keys if they’re lost due to theft, robbery, or an accident.'
            iconLink={item.iconLink}
            isRecommended={item.isRecommended}
          />
        ))}
      </div>
    </div>
  );
}

export default AddOnPage;

function AddOnRowDetail({
  title,
  iconLink,
  isRecommended = false,
}: {
  title: string;
  iconLink: string;
  isRecommended?: boolean;
}) {
  const [status, setStatus] = useState<Status>('new');
  return (
    <AddOnRow
      isRecommended={isRecommended}
      title='Add Additional Named Driver(s)'
      iconLink={iconLink}
      status={status}
    >
      {status === 'new' && (
        <>
          <p className='font-medium'>
            Get reimbursed for replacing your car keys if they’re lost due to
            theft, robbery, or an accident.
          </p>
          <hr className=' my-2 bg-sky-500' />
          <div className='flex items-center justify-between'>
            <p>Select Coverage Amount</p>
            <Select
              defaultValue='SGD 500'
              style={{ width: 120 }}
              className='w-28'
              options={[
                { value: 'jack', label: 'SGD 500' },
                { value: 'lucy', label: 'SGD 500' },
                { value: 'Yiminghe', label: 'SGD 500' },
              ]}
            />
          </div>
          <div className='flex items-center justify-between pt-2'>
            <p>SGD 43</p>
            <SecondaryButton
              className='h-8 w-28 rounded-md py-0 leading-4 text-black'
              onClick={() => setStatus('completed')}
            >
              Add
            </SecondaryButton>
          </div>
        </>
      )}
      {status === 'completed' && (
        <>
          <p className='font-medium'>
            Get reimbursed for replacing your car keys if they’re lost due to
            theft, robbery, or an accident.
          </p>
          <hr className=' my-2 bg-sky-500' />
          <div className='flex items-center justify-between'>
            <p>Select Coverage Amount</p>
            <SecondaryButton
              className='h-8 w-28 rounded-md py-0 leading-4 text-black'
              onClick={() => setStatus('completed')}
            >
              Edit Details
            </SecondaryButton>
          </div>
          <div className='flex items-center justify-between pt-2'>
            <p>SGD 43</p>
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
