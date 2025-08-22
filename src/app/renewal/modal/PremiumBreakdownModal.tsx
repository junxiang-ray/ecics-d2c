import { Button } from 'antd';
import React from 'react';

import { MaidQuote } from '@/libs/types/maidQuote';
import { Addon, AddOnIncludedInPlan, Quote } from '@/libs/types/quote';
import { formatCurrency } from '@/libs/utils/utils';

import { ProductType } from '@/app/motor/insurance/basic-detail/options';

export interface PremiumBreakdownRenewalContentProps {
  quoteInfo?: Quote;
  maidQuote?: MaidQuote;
  dataSelectedAddOn: any;
  drivers?: any[];
  addonAdditionalDriver?: Addon;
  pricePlanMain: number;
  couponDiscount: number;
  tax: number;
  gst: number;
  netPremium: number;
  addonsIncluded?: AddOnIncludedInPlan[];
  onClose?: () => void;
  isSummaryScreen?: boolean;
  productType?: ProductType;
}

const PremiumBreakdownRenewalContent = ({
  quoteInfo,
  dataSelectedAddOn,
  maidQuote,
  drivers,
  addonAdditionalDriver,
  pricePlanMain,
  couponDiscount,
  tax,
  gst,
  netPremium,
  addonsIncluded,
  onClose,
  isSummaryScreen,
}: PremiumBreakdownRenewalContentProps) => {
  const hasAddons = dataSelectedAddOn && dataSelectedAddOn.length > 0;
  const hasDrivers = drivers && drivers.length > 0;
  const hasIncludedAddOns = addonsIncluded && addonsIncluded.length > 0;
  const hasAnyContent = hasAddons || hasDrivers || hasIncludedAddOns;

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <p
          className={`sticky top-0 z-10 bg-white pt-2 font-semibold leading-[30px] text-[#171A1F] ${isSummaryScreen ? 'text-base underline' : 'text-xl'}`}
        >
          Premium Breakdown
        </p>
        <div className='pb-2 text-sm text-gray-600'>
          Detailed breakdown of your renewal premium
        </div>
      </div>
      <div className='flex max-h-[calc(100vh-100px)] flex-1 flex-col gap-4 overflow-y-auto'>
        {/* Plan */}
        <div className='flex flex-col gap-2'>
          <p className='text-base font-bold text-[#303030]'>Plan</p>
          <div className='flex flex-row justify-between text-sm font-normal text-[#303030]'>
            <span>Comprehensive - Family NCD Builder</span>
            <span className='font-semibold'>SGD 876.51</span>
          </div>
        </div>

        {hasAnyContent && (
          <div className='flex flex-col gap-2 rounded-lg py-2 text-sm font-semibold text-[#303030]'>
            {/* Add-ons */}
            <p className='text-base font-bold text-[#303030]'>Add-on:</p>
            <div>
              <div className='flex flex-col gap-3'>
                {dataSelectedAddOn?.map((addon: any) => (
                  <p
                    key={addon.title}
                    className='flex flex-row items-center justify-between gap-10 font-normal text-[#303030]'
                  >
                    <p className='flex flex-col'>
                      {addon.title}
                      {addon.optionLabel && addon.optionLabel !== 'YES' && (
                        <span className='ml-2 flex flex-row items-center gap-2'>
                          <p className='h-[4px] w-[4px] rounded-full bg-[#303030]'></p>
                          {addon.optionLabel} Coverage
                        </span>
                      )}
                    </p>
                    <span>{formatCurrency(addon.feeSelected / tax)}</span>
                  </p>
                ))}
              </div>

              {/* Drivers */}
              {hasDrivers && (
                <div className='mt-4'>
                  <p className='text-sm font-semibold text-[#303030]'>
                    Additional Named Driver(s)
                  </p>
                  {drivers.map((driver, index) => (
                    <div
                      key={index}
                      className='flex flex-row items-center justify-between font-normal text-[#303030]'
                    >
                      <div className='flex items-center gap-2'>
                        <div className='h-[4px] w-[4px] rounded-full bg-[#303030]'></div>
                        <p className='max-w-[220px] break-words text-justify'>
                          {driver.name}
                        </p>
                      </div>
                      <p>
                        {index === 0
                          ? 'FREE'
                          : addonAdditionalDriver?.options?.[0]
                                ?.premium_with_gst
                            ? formatCurrency(
                                addonAdditionalDriver.options[0]
                                  .premium_with_gst / 1.09,
                              )
                            : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add-ons included in plan */}
              {hasIncludedAddOns && (
                <div className='mt-4 flex flex-col gap-2'>
                  {addonsIncluded.map((item, index) => (
                    <div key={index} className='flex flex-row justify-between'>
                      <span>{item.add_on_name}</span>
                      <span>INCLUDED</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className='flex flex-col gap-1 rounded-lg py-2'>
          <hr className='border-t border-gray-200' />
          <div className='mt-2 flex flex-row justify-between text-sm font-bold text-gray-700'>
            <p className='text-sm text-gray-700'>Subtotal</p>
            {/*<p>{formatCurrency(netPremium)}</p>*/}
            <p>SGD 936.51</p>
          </div>
          <div className='flex flex-row justify-between text-sm font-normal text-gray-700'>
            <p>GST (9%)</p>
            <p className='font-semibold'>SGD 84.29</p>
          </div>
          <hr className='mt-4 border-t border-gray-200' />
          <div className='mt-2 flex flex-row justify-between text-base font-bold text-[#303030]'>
            <p>Net Premium (Total)</p>
            {/*<p>{formatCurrency(netPremium + gst)}</p>*/}
            <p className='text-base font-bold text-[#02ADEF]'>SGD 1020.80</p>
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
