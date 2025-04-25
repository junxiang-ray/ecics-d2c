'use client';

import { Input } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import ConfirmInfoModalWrapper from '@/app/(auth)/review-info-detail/modal/ConfirmInfoModalWrapper';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

import InfoSection from './InfoSection';

const ReviewInfoDetail = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isMobile } = useDeviceDetection();

  const handleContinue = () => {
    setShowConfirmModal(false);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(true);
  };

  const commonInfo = {
    email: 'abc@gmail.com',
    phone: '+65 98888888',
    personal: [
      { label: 'Name as per NRIC', value: 'Sayan Chakraborty' },
      { label: 'NRIC', value: 'ABC1234' },
      { label: 'Gender', value: 'Male' },
      { label: 'Marital Status', value: 'Married' },
      { label: 'Date of Birth', value: '29/12/1990' },
      { label: 'Address', value: '10 Eunos Road Singapore 400087' },
    ],
    vehicle: [
      { label: 'Vehicle Make', value: 'BMW i5 2.5' },
      { label: 'Vehicle First Registered in', value: '2024' },
      { label: 'Vehicle Registration Number', value: 'SGT1818T' },
      { label: 'Chassis Number', value: '234GH3' },
      { label: 'Engine Number', value: '2345HE3' },
      { label: 'Year of Registration', value: '2024' },
      {
        label: 'Driving Licence - Qualified Driving License Validity',
        value: '2024',
      },
    ],
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='relative z-10 flex-grow p-6'>
        <div className='flex items-center justify-between'>
          <Image
            src='/singpass.svg'
            alt='Singpass Logo'
            width={170}
            height={170}
          />
          <Image src='/ecics.svg' alt='ECICS Logo' width={100} height={100} />
        </div>

        <div className='mt-6 text-lg font-bold'>Review your Myinfo details</div>

        {isMobile ? (
          <div>
            <div className='mt-4'>
              <div className='text-sm font-bold'>Email Address</div>
              <Input placeholder={commonInfo.email} className='mt-2' />
            </div>
            <div className='mt-4'>
              <div className='text-sm font-bold'>Phone Number</div>
              <Input placeholder={commonInfo.phone} className='mt-2' />
            </div>
            <InfoSection title='Personal Info' data={commonInfo.personal} />
            <InfoSection title='Vehicle Details' data={commonInfo.vehicle} />
          </div>
        ) : (
          <div className='w-2/3 justify-self-center'>
            <div className='mt-6 flex items-center justify-between rounded-md border border-gray-300 bg-white p-4'>
              <div className='w-[calc(50%-10px)]'>
                <div className='text-sm font-bold'>Email Address</div>
                <Input placeholder={commonInfo.email} className='mt-2' />
              </div>
              <div className='w-[calc(50%-10px)]'>
                <div className='text-sm font-bold'>Phone Number</div>
                <Input placeholder={commonInfo.phone} className='mt-2' />
              </div>
            </div>

            <InfoSection
              title='Personal Details'
              data={commonInfo.personal}
              boxClass='mt-4'
            />
            <InfoSection
              title='Vehicle Details'
              data={commonInfo.vehicle}
              boxClass='mt-4'
            />
          </div>
        )}
      </div>

      <div className='flex justify-center gap-4 border-t bg-white p-4'>
        <SecondaryButton onClick={handleCloseModal}>Cancel</SecondaryButton>
        <PrimaryButton
          onClick={handleContinue}
          className='rounded-md px-4 py-2 text-white'
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

export default ReviewInfoDetail;
