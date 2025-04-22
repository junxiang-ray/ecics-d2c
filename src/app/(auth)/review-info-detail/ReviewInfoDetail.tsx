'use client';

import { Input } from 'antd';
import { useState } from 'react';
import ConfirmInfoModalWrapper from '@/app/(auth)/review-info-detail/modal/ConfirmInfoModalWrapper';
import Image from 'next/image';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

const ReviewInfoDetail = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleContinue = () => {
    setShowConfirmModal(false);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(true);
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='relative z-10 flex-grow p-6'>
        <div className='flex items-center justify-between'>
          <Image src='/ecics.svg' alt='Logo' width={100} height={100} />
          <Image src='/singpass.svg' alt='Logo' width={170} height={170} />
        </div>
        <div className='mt-6 text-lg font-bold'>Review your Myinfo details</div>
        <div className='mt-4'>
          <div className='text-sm font-bold'>Email Address</div>
          <Input placeholder='abc@gmail.com' className='mt-2' />
        </div>
        <div className='mt-4'>
          <div className='text-sm font-bold'>Phone Number</div>
          <Input placeholder='+65 98888888' className='mt-2' />
        </div>
        <div className='mt-4'>
          <div className='text-base font-bold underline underline-offset-4'>
            Personal Info
          </div>

          <div className='mt-2 grid grid-cols-2 gap-4'>
            <div>
              <div className='text-sm font-bold'>Name as per NRIC</div>
              <div className='text-sm'>Sayan Chakraborty</div>
            </div>
            <div>
              <div className='text-sm font-bold'>NRIC</div>
              <div className='text-sm'>ABC1234</div>
            </div>
          </div>

          <div className='mt-2 grid grid-cols-2 gap-4'>
            <div>
              <div className='text-sm font-bold'>Gender</div>
              <div className='text-sm'>Male</div>
            </div>
            <div>
              <div className='text-sm font-bold'>Marital Status</div>
              <div className='text-sm'>Married</div>
            </div>
          </div>

          <div className='mt-2 grid grid-cols-2 gap-4'>
            <div>
              <div className='text-sm font-bold'>Date of Birth</div>
              <div className='text-sm'>29/12/1990</div>
            </div>
            <div>
              <div className='text-sm font-bold'>Address</div>
              <div className='text-sm'>10 Eunos Road Singapore 400087</div>
            </div>
          </div>
        </div>

        <div className='mt-4'>
          <div className='text-base font-bold underline underline-offset-4'>
            Vehicle Details
          </div>
          <div className='mt-2 grid grid-cols-2 gap-4'>
            <div>
              <div className='text-sm font-bold'>Vehicle Make</div>
              <div className='text-sm'>BMW i5 2.5</div>
            </div>
            <div>
              <div className='text-sm font-bold'>Year of Registration</div>
              <div className='text-sm'>2024</div>
            </div>
          </div>

          <div className='mt-2'>
            <div className='text-sm font-bold'>Chassis Number</div>
            <div className='text-sm'>SGT1818T</div>
          </div>
        </div>
      </div>
      <div className='flex justify-center gap-4 border-t bg-white p-4'>
        <SecondaryButton onClick={handleCloseModal}>Cancel</SecondaryButton>
        <PrimaryButton
          onClick={handleContinue}
          className='rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700'
        >
          Continue
        </PrimaryButton>
      </div>
      {showConfirmModal && <ConfirmInfoModalWrapper />}
    </div>
  );
};

export default ReviewInfoDetail;
