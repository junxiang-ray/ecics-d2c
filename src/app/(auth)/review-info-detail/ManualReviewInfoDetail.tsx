'use client';

import { Input } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

import WarningIcon from '@/components/icons/WarningIcon';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import MInput from '@/components/ui/form/input/MInput';
import MTextArea from '@/components/ui/form/input/MTextArea';

import ConfirmInfoModalWrapper from '@/app/(auth)/review-info-detail/modal/ConfirmInfoModalWrapper';

const ManualReviewInfoDetail = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleContinue = () => {
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    setShowConfirmModal(true);
  };

  const boxWrapperClass =
    'mt-6 rounded-md border border-gray-300 bg-gray-100 p-4';

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='relative z-10 flex-grow p-6'>
        <div className='flex items-center justify-between'>
          <Image src='/ecics.svg' alt='Logo' width={100} height={100} />
          <Image src='/singpass.svg' alt='Logo' width={170} height={170} />
        </div>
        <div className='mt-6 text-lg font-bold'>Review your Myinfo details</div>
        <div className='w-full'>
          <div className={`${boxWrapperClass}`}>
            <div className='flex items-center justify-between'>
              <div className='text-base font-bold'>
                Enter a valid Email and Contact Number
              </div>
              <div className='flex items-center justify-between font-bold'>
                <WarningIcon size={14} />
                <div className='ml-[2px] text-[10px]'>Why do we need this?</div>
              </div>
            </div>
            <div className='mt-4 flex items-center justify-between'>
              <div className='w-[calc(50%-10px)]'>
                <div className='text-sm font-bold'>Email Address</div>
                <Input placeholder='abc@gmail.com' className='mt-2' />
              </div>
              <div className='w-[calc(50%-10px)]'>
                <div className='text-sm font-bold'>Phone Number</div>
                <Input placeholder='+65 98888888' className='mt-2' />
              </div>
            </div>
          </div>

          <div className={`${boxWrapperClass} mt-4`}>
            <div className='text-base font-bold underline-offset-4'>
              Personal Info
            </div>
            <div className='mt-2 flex flex-wrap gap-4'>
              <div className='min-w-[30%] flex-1'>
                <div className='text-sm font-bold'>Name as per NRIC</div>
                <MInput
                  type='text'
                  placeholder='Sayan Chakraborty'
                  className='mt-[4px] w-full rounded-md border px-2 py-1 text-sm'
                />
              </div>
              <div className='min-w-[30%] flex-1'>
                <div className='text-sm font-bold'>NRIC</div>
                <MInput
                  type='text'
                  placeholder='ABC1234'
                  className='mt-[4px] w-full rounded-md border px-2 py-1 text-sm'
                />
              </div>
              <div className='min-w-[30%] flex-1'>
                <div className='text-sm font-bold'>Gender</div>
                <MInput
                  type='text'
                  placeholder='Male'
                  className='mt-[4px] w-full rounded-md border px-2 py-1 text-sm'
                />
              </div>
              <div className='min-w-[30%] flex-1'>
                <div className='text-sm font-bold'>Marital Status</div>
                <MInput
                  type='text'
                  placeholder='Married'
                  className='mt-[4px] w-full rounded-md border px-2 py-1 text-sm'
                />
              </div>
              <div className='min-w-[30%] flex-1'>
                <div className='text-sm font-bold'>Date of Birth</div>
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <MInput
                  type='text'
                  placeholder='29/12/1990'
                  className='mt-[4px] w-full rounded-md border px-2 py-1 text-sm'
                />
              </div>
              <div className='min-w-[30%] flex-1'>
                <div className='text-sm font-bold'>Address</div>
                <MTextArea
                  placeholder='10 Eunos Road Singapore 400087'
                  className='mt-[4px] w-full rounded-md border px-2 py-1 text-sm'
                />
              </div>
            </div>
          </div>

          <div className={`${boxWrapperClass} mt-4`}>
            <div className='text-base font-bold underline-offset-4'>
              Vehicle Details
            </div>
            <div className='mt-2 flex flex-wrap gap-4'>
              <div className='min-w-[30%] flex-1'>
                <div className='text-sm font-bold'>Vehicle Make</div>
                <MInput
                  type='text'
                  placeholder='BMW i5 2.5'
                  className='mt-[4px] w-full rounded-md border px-2 py-1 text-sm'
                />
              </div>
              <div className='min-w-[30%] flex-1'>
                <div className='text-sm font-bold'>Year of Registration</div>
                <MInput
                  type='text'
                  placeholder='2024'
                  className='mt-[4px] w-full rounded-md border px-2 py-1 text-sm'
                />
              </div>
              <div className='min-w-[30%] flex-1'>
                <div className='text-sm font-bold'>Chassis Number</div>
                <MInput
                  type='text'
                  placeholder='234GH3'
                  className='mt-[4px] w-full rounded-md border px-2 py-1 text-sm'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center gap-4 border-t bg-white p-4'>
        <SecondaryButton
          onClick={handleCancel}
          className='w-[10vw] min-w-[150px] rounded-md px-4 py-2 transition sm:w-[50vw] md:w-[10vw]'
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={handleContinue}
          disabled
          className='w-[10vw] min-w-[150px] rounded-md px-4 py-2 transition sm:w-[50vw] md:w-[10vw]'
        >
          Continue
        </PrimaryButton>
      </div>
      {showConfirmModal && (
        <ConfirmInfoModalWrapper
          showConfirmModal={showConfirmModal}
          setShowConfirmModal={setShowConfirmModal}
        />
      )}
    </div>
  );
};

export default ManualReviewInfoDetail;
