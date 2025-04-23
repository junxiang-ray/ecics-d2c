'use client';

import { useState } from 'react';
import BasicDetailsIcon from '@/components/icons/BasicDetailsIcon';
import VehicleDetailsIcon from '@/components/icons/VehicleDetailsIcon';
import ArrowDownIcon from '@/components/icons/ArrowDownIcon';
import ArrowUpIcon from '@/components/icons/ArrowUpIcon';
import PolicyPlanIcon from '@/components/icons/PolicyPlanIcon';
import AddOnsSelectedIcon from '@/components/icons/AddOnsSelectedIcon';
import AdditionalDriverDetailsIcon from '@/components/icons/AdditionalDriverDetailsIcon';
import MainDriverDetailsIcon from '@/components/icons/MainDriverDetailsIcon';

const ReviewYourDetail = () => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basic: false,
    vehicle: false,
    policy: false,
    add_ons_selected: false,
    additional_driver: false,
    main_driver: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className='relative flex-grow p-6'>
      <div className='mb-2 text-lg font-bold'>Review your details</div>

      {/* Basic Details */}
      {!expandedSections.basic ? (
        <div
          className='relative flex cursor-pointer items-start rounded-[4px] border bg-white p-2'
          onClick={() => toggleSection('basic')}
        >
          <div className='flex items-center self-center'>
            <div className='flex items-center justify-center rounded-[6px] bg-brand-blue p-[6px]'>
              <BasicDetailsIcon size={24} className='text-white' />
            </div>
          </div>
          <div className='ml-2 flex flex-grow flex-col justify-center'>
            <div className='flex items-center justify-between'>
              <div className='text-base font-semibold text-black'>
                Basic Details
              </div>
              <ArrowDownIcon size={12} className='mr-[10px] text-brand-blue' />
            </div>
            <div className='text-sm'>Policy Period</div>
          </div>
        </div>
      ) : (
        <div className='mb-4 overflow-hidden rounded-[8px] shadow-lg'>
          <div className='flex items-center justify-between rounded-t-[8px] border border-brand-blue bg-review-blue px-4 py-3'>
            <div className='text-base font-semibold'>Basic Details</div>
            <div className='flex items-center gap-3'>
              <button className='text-sm font-semibold'>Edit</button>
              <ArrowUpIcon
                size={12}
                className='cursor-pointer text-brand-blue'
                onClick={() => toggleSection('basic')}
              />
            </div>
          </div>
          <div className='space-y-2 rounded-b-[8px] border border-t-0 border-gray-300 bg-white px-4 py-3 text-sm'>
            <div className='flex justify-between'>
              <div>Policy Start Date:</div>
              <div>15/12/2024</div>
            </div>

            <div className='flex justify-between'>
              <div>Policy End Date</div>
              <div>15/12/2025</div>
            </div>

            <div className='flex justify-between'>
              <div>No Claim Discount</div>
              <div>50%</div>
            </div>

            <div className='flex justify-between'>
              <div>Number of claims in last 3 years</div>
              <div>0</div>
            </div>

            <div className='flex justify-between'>
              <div>Vehicle financed by</div>
              <div>DBS Bank</div>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Details */}
      {!expandedSections.vehicle ? (
        <div
          className='relative mt-4 flex cursor-pointer items-start rounded-[4px] border bg-white p-2'
          onClick={() => toggleSection('vehicle')}
        >
          <div className='flex items-center self-center'>
            <div className='flex items-center justify-center rounded-[6px] bg-brand-blue p-[6px]'>
              <VehicleDetailsIcon size={24} className='text-white' />
            </div>
          </div>
          <div className='ml-2 flex flex-grow flex-col justify-center'>
            <div className='flex items-center justify-between'>
              <div className='text-base font-semibold text-black'>
                Vehicle Details
              </div>
              <ArrowDownIcon size={12} className='mr-[10px] text-brand-blue' />
            </div>
            <div className='text-sm'>BMW i5 2.2 ST1234B</div>
          </div>
        </div>
      ) : (
        <div className='mb-4 mt-4 overflow-hidden rounded-[8px] shadow-lg'>
          <div className='flex items-center justify-between rounded-t-[8px] border border-brand-blue bg-review-blue px-4 py-3'>
            <div className='text-base font-semibold'>Vehicle Details</div>
            <div className='flex items-center gap-3'>
              <button className='text-sm font-semibold'>Edit</button>
              <ArrowUpIcon
                size={12}
                className='cursor-pointer text-brand-blue'
                onClick={() => toggleSection('vehicle')}
              />
            </div>
          </div>
          <div className='rounded-b-[8px] border border-t-0 border-gray-300 bg-white px-4 py-3 text-sm'>
            <div className=''>Plate No: ST1234B | Model: BMW i5 2.2</div>
          </div>
        </div>
      )}

      {/* Policy Plan */}
      {!expandedSections.policy ? (
        <div
          className='relative mt-4 flex cursor-pointer items-start rounded-[4px] border bg-white p-2'
          onClick={() => toggleSection('policy')}
        >
          <div className='flex items-center self-center'>
            <div className='flex items-center justify-center rounded-[6px] bg-brand-blue p-[6px]'>
              <PolicyPlanIcon size={24} className='text-white' />
            </div>
          </div>
          <div className='ml-2 flex flex-grow flex-col justify-center'>
            <div className='flex items-center justify-between'>
              <div className='text-base font-semibold text-black'>
                Policy Plan
              </div>
              <ArrowDownIcon size={12} className='mr-[10px] text-brand-blue' />
            </div>
            <div className='text-sm'>Comprehensive Plan</div>
          </div>
        </div>
      ) : (
        <div className='mb-4 mt-4 overflow-hidden rounded-[8px] shadow-lg'>
          <div className='flex items-center justify-between rounded-t-[8px] border border-brand-blue bg-review-blue px-4 py-3'>
            <div className='text-base font-semibold'>Policy Plan</div>
            <div className='flex items-center gap-3'>
              <button className='text-sm font-semibold'>Edit</button>
              <ArrowUpIcon
                size={12}
                className='cursor-pointer text-brand-blue'
                onClick={() => toggleSection('policy')}
              />
            </div>
          </div>
          <div className='rounded-b-[8px] border border-t-0 border-gray-300 bg-white px-4 py-3 text-sm'>
            <div className=''>Comprehensive Plan</div>
          </div>
        </div>
      )}

      {/* Add Ons Selected */}
      {!expandedSections.add_ons_selected ? (
        <div
          className='relative mt-4 flex cursor-pointer items-start rounded-[4px] border bg-white p-2'
          onClick={() => toggleSection('add_ons_selected')}
        >
          <div className='flex items-center self-center'>
            <div className='flex items-center justify-center rounded-[6px] bg-brand-blue p-[6px]'>
              <AddOnsSelectedIcon size={24} className='text-white' />
            </div>
          </div>
          <div className='ml-2 flex flex-grow flex-col justify-center'>
            <div className='flex items-center justify-between'>
              <div className='text-base font-semibold text-black'>
                Add Ons Selected
              </div>
              <ArrowDownIcon size={12} className='mr-[10px] text-brand-blue' />
            </div>
            <div className='text-sm'>Additional Named Driver</div>
          </div>
        </div>
      ) : (
        <div className='mb-4 mt-4 overflow-hidden rounded-[8px] shadow-lg'>
          <div className='flex items-center justify-between rounded-t-[8px] border border-brand-blue bg-review-blue px-4 py-3'>
            <div className='text-base font-semibold'>Add Ons Selected</div>
            <div className='flex items-center gap-3'>
              <button className='text-sm font-semibold'>Edit</button>
              <ArrowUpIcon
                size={12}
                className='cursor-pointer text-brand-blue'
                onClick={() => toggleSection('add_ons_selected')}
              />
            </div>
          </div>
          <div className='rounded-b-[8px] border border-t-0 border-gray-300 bg-white px-4 py-3 text-sm'>
            <div className=''>Additional Named Driver</div>
          </div>
        </div>
      )}

      {/* Additional Driver Details */}
      {!expandedSections.additional_driver ? (
        <div
          className='relative mt-4 flex cursor-pointer items-start rounded-[4px] border bg-white p-2'
          onClick={() => toggleSection('additional_driver')}
        >
          <div className='flex items-center self-center'>
            <div className='flex items-center justify-center rounded-[6px] bg-brand-blue p-[6px]'>
              <AdditionalDriverDetailsIcon size={24} className='text-white' />
            </div>
          </div>
          <div className='ml-2 flex flex-grow flex-col justify-center'>
            <div className='flex items-center justify-between'>
              <div className='text-base font-semibold text-black'>
                Additional Driver Details
              </div>
              <ArrowDownIcon size={12} className='mr-[10px] text-brand-blue' />
            </div>
            <div className='text-sm'>Steve Smith</div>
          </div>
        </div>
      ) : (
        <div className='mb-4 mt-4 overflow-hidden rounded-[8px] shadow-lg'>
          <div className='flex items-center justify-between rounded-t-[8px] border border-brand-blue bg-review-blue px-4 py-3'>
            <div className='text-base font-semibold'>
              Additional Driver Details
            </div>
            <div className='flex items-center gap-3'>
              <button className='text-sm font-semibold'>Edit</button>
              <ArrowUpIcon
                size={12}
                className='cursor-pointer text-brand-blue'
                onClick={() => toggleSection('additional_driver')}
              />
            </div>
          </div>
          <div className='rounded-b-[8px] border border-t-0 border-gray-300 bg-white px-4 py-3 text-sm'>
            <div className=''>Steve Smith</div>
          </div>
        </div>
      )}

      {/* Main Driver Details */}
      {!expandedSections.main_driver ? (
        <div
          className='relative mt-4 flex cursor-pointer items-start rounded-[4px] border bg-white p-2'
          onClick={() => toggleSection('main_driver')}
        >
          <div className='flex items-center self-center'>
            <div className='flex items-center justify-center rounded-[6px] bg-brand-blue p-[6px]'>
              <MainDriverDetailsIcon size={24} className='text-white' />
            </div>
          </div>
          <div className='ml-2 flex flex-grow flex-col justify-center'>
            <div className='flex items-center justify-between'>
              <div className='text-base font-semibold text-black'>
                Additional Driver Details
              </div>
              <ArrowDownIcon size={12} className='mr-[10px] text-brand-blue' />
            </div>
            <div className='text-sm'>John Doe</div>
          </div>
        </div>
      ) : (
        <div className='mb-4 mt-4 overflow-hidden rounded-[8px] shadow-lg'>
          <div className='flex items-center justify-between rounded-t-[8px] border border-brand-blue bg-review-blue px-4 py-3'>
            <div className='text-base font-semibold'>
              Additional Driver Details
            </div>
            <div className='flex items-center gap-3'>
              <button className='text-sm font-semibold'>Edit</button>
              <ArrowUpIcon
                size={12}
                className='cursor-pointer text-brand-blue'
                onClick={() => toggleSection('main_driver')}
              />
            </div>
          </div>
          <div className='rounded-b-[8px] border border-t-0 border-gray-300 bg-white px-4 py-3 text-sm'>
            <div className=''>John Doe</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewYourDetail;
