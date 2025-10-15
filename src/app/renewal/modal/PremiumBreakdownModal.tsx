import { Button } from 'antd';
import React from 'react';

import { RenewalQuote, SelectedAddon } from '@/libs/types/renewalQuote';
import { capitalizeWords, formatCurrency } from '@/libs/utils/utils';

import { GST_RATE } from '@/constants/general.constant';

export interface PremiumBreakdownRenewalContentProps {
  gst: number;
  subtotalFeeAfter: number;
  subtotal: number;
  renewalQuote?: RenewalQuote | null;
  onClose?: () => void;
  total: number;
  selectedAddons?: SelectedAddon[];
}

const PremiumBreakdownRenewalContent = ({
  gst,
  subtotal,
  subtotalFeeAfter,
  renewalQuote,
  onClose,
  total,
  selectedAddons = [],
}: PremiumBreakdownRenewalContentProps) => {
  const policy = renewalQuote?.renewal_info?.policy_details;
  const renewal = renewalQuote?.renewal_info;
  const gstAmount = subtotalFeeAfter * GST_RATE;

  return (
    <div className='flex flex-col gap-4'>
      <div className='sticky top-0 z-10 bg-white pt-2'>
        <p className='font-semibold leading-[30px] text-[#171A1F]'>
          Premium Breakdown
        </p>
        <div className='pb-2 text-sm text-gray-600'>
          Detailed breakdown of your renewal premium
        </div>
      </div>
      <div className='flex flex-1 flex-col gap-4 overflow-y-auto'>
        {/* Plan */}
        <div className='flex flex-col gap-2'>
          <p className='text-base font-bold text-[#303030]'>Plan</p>
          <div className='flex flex-row justify-between text-sm font-normal text-[#303030]'>
            <span>{capitalizeWords(policy?.coverage)}</span>
            <span className='font-semibold'>
              {formatCurrency(Number(renewal?.renewalplanprem))}
            </span>
          </div>
        </div>
        {/* Add-ons */}
        <div>
          {renewal?.optional_benefits?.length ||
          (selectedAddons || []).length ? (
            <>
              <p className='text-base font-semibold'>Add-ons</p>
              {/* Optional benefits */}
              {renewal?.optional_benefits?.map((item) => (
                <div
                  key={`opt-${item.id}`}
                  className='mb-1 flex justify-between space-y-2'
                >
                  <span className='text-sm'>
                    {item.name}{' '}
                    <span className='rounded-xl bg-green-100 px-2 py-1 text-xs text-green-700'>
                      Included
                    </span>
                  </span>
                  <span className='text-sm'>
                    {formatCurrency(Number(item.prem))}
                  </span>
                </div>
              ))}

              {/* Selected add-ons */}
              {(selectedAddons || []).map((item) => {
                const subTotal =
                  item.sub_options?.reduce(
                    (sum, sub) => sum + Number(sub.prem ?? 0),
                    0,
                  ) || 0;
                const price = Number(item.prem ?? 0) + subTotal;

                return (
                  <div
                    key={item.id}
                    className='mb-1 flex items-center justify-between space-y-2'
                  >
                    <span className='text-sm'>{item.name}</span>
                    <span className='text-sm'>{formatCurrency(price)}</span>
                  </div>
                );
              })}
            </>
          ) : null}
        </div>

        {/* Named Drivers */}
        {policy?.named_drivers?.length ? (
          <div>
            <p className='mb-2 text-base font-semibold'>Named Drivers</p>
            {policy?.named_drivers.map((driver, index) => (
              <div key={index} className='mb-1 flex justify-between space-y-2'>
                <span className='text-sm'>
                  {driver.name}{' '}
                  {index === 0 && (
                    <span className='rounded-xl bg-green-100 px-2 py-1 text-xs text-green-700'>
                      Included
                    </span>
                  )}
                </span>
                <span className='text-sm'>
                  {index === 0 ? 'SGD 0.00' : 'SGD 60.00'}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {/* Summary */}
        <div className='flex flex-col gap-1 rounded-lg py-2'>
          <hr className='border-t border-gray-200' />
          <div className='mt-2 flex flex-row justify-between text-sm font-bold text-gray-700'>
            <p className='text-sm text-gray-700'>Subtotal</p>
            <p>{formatCurrency(subtotalFeeAfter)}</p>
          </div>
          <div className='flex flex-row justify-between text-sm font-normal text-gray-700'>
            <p>GST (9%)</p>
            <p className='font-semibold'>
              {' '}
              {formatCurrency(Number(gstAmount))}
            </p>
          </div>
          <hr className='mt-4 border-t border-gray-200' />
          <div className='mt-2 flex flex-row justify-between text-base font-bold text-[#303030]'>
            <p>Net Premium (Total)</p>
            <p className='text-base font-bold text-[#02ADEF]'>
              {formatCurrency(Number(total))}
            </p>
          </div>
        </div>
      </div>
      <div className='sticky bottom-0 z-10 border-t border-gray-200 bg-white pt-2'>
        <Button
          className='mt-[6px] w-full rounded-lg border border-gray-50 bg-gray-100 py-6 text-center text-base font-semibold text-gray-500'
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default PremiumBreakdownRenewalContent;
