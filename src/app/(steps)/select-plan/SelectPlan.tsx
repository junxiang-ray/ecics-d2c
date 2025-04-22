'use client';

import TickCircleIcon from '@/components/icons/TickCircleIcon';

const SelectPlan = () => {
  return (
    <div className='relative flex-grow p-6'>
      <div className='relative rounded-[4px] border bg-plan-blue p-6'>
        <div className='absolute -top-3 right-3 rounded-[20px] bg-brand-blue px-3 py-1 text-xs font-semibold text-white shadow-sm'>
          Recommended
        </div>

        <div className='text-lg font-bold'>{'Comprehensive Plan'}</div>
        <div className='mt-4 flex items-center'>
          <TickCircleIcon size={12} />
          <div className='ml-[4px] text-sm'>
            {'Third-Party liability coverage relating to vehicle charging'}
          </div>
        </div>
        <div className='mt-4 flex items-center'>
          <TickCircleIcon size={12} />
          <div className='ml-[4px] text-sm'>
            {'Free NCD Protector (from 10%) & Waiver of Excess'}
          </div>
        </div>
        <div className='mt-4 flex items-center'>
          <TickCircleIcon size={12} />
          <div className='ml-[4px] text-sm'>
            {'Up to $50,000 complimentary Personal Accident coverage'}
          </div>
        </div>
        <div className='mt-4 flex items-center'>
          <TickCircleIcon size={12} />
          <div className='ml-[4px] text-sm'>{'Complete Vehicle Coverage'}</div>
        </div>
        <div className='mt-4 flex items-center'>
          <TickCircleIcon size={12} />
          <div className='ml-[4px] text-sm'>
            {
              'Policy Excess: $750 for non-EV & BYD models & $ 1,500 for Tesla models'
            }
          </div>
        </div>
        <div className='relative mt-6'>
          <div className='relative z-0 overflow-hidden rounded-[12px] bg-[#F4FBFD]'>
            <div className='pointer-events-none absolute inset-0 z-0 rounded-[12px] border border-blue-700' />
            <div className='absolute left-[-8px] top-1/2 h-[1rem] w-5 -translate-y-1/2 rounded-[5px] border border-blue-700 bg-plan-blue' />
            <div className='absolute right-[-8px] top-1/2 h-[1rem] w-5 -translate-y-1/2 rounded-[5px] border border-blue-700 bg-plan-blue' />
            <div className='flex items-center p-4 pb-2'>
              <div className='text-center text-base font-semibold text-black'>
                S$ 2700
              </div>
              <div className='ml-[4px] text-center text-sm font-medium text-[#FD1212]'>
                S$ 3200
              </div>
            </div>
            <div className='mx-4 border-t border-dashed border-blue-700' />
            <div className='p-4 pt-2'>
              <div className='text-sm font-semibold text-black'>
                CARS 15 (15% off applied)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectPlan;
