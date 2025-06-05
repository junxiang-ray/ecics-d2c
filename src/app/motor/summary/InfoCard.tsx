import React, { useState } from 'react';

import { AddOnIncludedInPlan } from '@/libs/types/quote';

import { ArrowDownCircleIcon } from '@/components/icons/add-on-icons';

type Props = {
  title: string;
  data: { label: string; value: string }[];
  extraTitle?: string;
  extraData?: { title: string; value?: string }[];
  addOnIncludedInPlan?: AddOnIncludedInPlan[];
  drivers?: any;
};

const InfoCard = (props: Props) => {
  const { title, data, extraTitle, extraData, drivers, addOnIncludedInPlan } =
    props;

  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className='w-full rounded-[10px] border border-[#EDEDED] shadow-[0px_4px_20px_0px_#00000014]'>
      <div
        onClick={toggleOpen}
        className={`flex cursor-pointer select-none items-center justify-between border border-[#00ADEF] bg-[#F4FBFD] px-4 py-3 text-base font-semibold ${isOpen ? 'rounded-t-[10px]' : 'rounded-[10px]'}`}
      >
        <p>{title}</p>
        <ArrowDownCircleIcon
          size={24}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </div>

      {isOpen && (
        <div className='flex flex-col gap-2 px-4 py-3'>
          {data.map((item, index) => (
            <div key={index} className='flex flex-row justify-between'>
              <p>{item.label}</p>
              <p
                className={`font-semibold ${item.label === 'Address' ? 'text-right' : ''}`}
              >
                {item.value}
              </p>
            </div>
          ))}
          {extraTitle && (
            <p className='text-sm font-semibold'>
              {extraTitle}
              {addOnIncludedInPlan && addOnIncludedInPlan.length > 0 && (
                <div className='mt-2 flex flex-col gap-2'>
                  {addOnIncludedInPlan.map((item, index) => (
                    <div
                      key={index}
                      className='flex flex-row items-center justify-between font-normal'
                    >
                      <span>{item.add_on_name}</span>
                      <span>INCLUDED</span>
                    </div>
                  ))}
                </div>
              )}
            </p>
          )}
          {drivers ? (
            <p className='text-sm font-semibold'>
              Add Additional Named Driver(s)
            </p>
          ) : (
            ''
          )}
          {extraData && (
            <div className='flex flex-col gap-2'>
              {extraData.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between text-sm font-normal'
                >
                  <span>{item.title}</span>
                  <span className='text-right'>{item.value || ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfoCard;
