'use client';

import type { StepsProps } from 'antd';
import { useSearchParams } from 'next/navigation';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

export enum Steps {
  FIRST = -1,
  POLICY_DETAILS = 0,
  SELECT_PLAN = 1,
  SELECT_ADD_ON = 2,
  PERSONAL_DETAIL = 3,
  COMPLETE_PURCHASE = 4,
}

export type StepsBarType = Steps;

interface StepsBarProps {
  currentStep: StepsBarType;
  onChange?: (current: number) => void;
  companyName?: string;
  isFinalized?: boolean;
  isLoading?: boolean;
  productType: string;
}

const getStepStatus = (step: StepsBarType, currentStep: StepsBarType) => {
  if (currentStep !== undefined && step < currentStep) return 'finish';
  if (step === currentStep) return 'process';
  return 'wait';
};

function splitText(text: string): [string, string] {
  const words = text.split(' ');
  if (words.length <= 1) {
    return [text, ''];
  }
  const firstWord = words[0];
  const remaining = words.slice(1).join(' ');
  return [firstWord, remaining];
}

export default function StepsCard({
  currentStep,
  onChange,
  companyName,
  isFinalized,
  isLoading,
  productType,
}: StepsBarProps) {
  const searchParams = useSearchParams();
  const { isMobile } = useDeviceDetection();
  const isManual = searchParams.get('manual') === 'true';

  const stepsData = [
    { step: StepsBarType.POLICY_DETAILS, title: 'Basic Information' },
    { step: StepsBarType.SELECT_PLAN, title: 'Select Plan' },
    { step: StepsBarType.SELECT_ADD_ON, title: 'Add-ons' },
    {
      step: StepsBarType.PERSONAL_DETAIL,
      title: productType === ProductType.MAID ? 'Helper’s Details' : 'Details',
    },
    { step: StepsBarType.COMPLETE_PURCHASE, title: 'Summary' },
  ];

  const stepsDataSingPass = [
    { step: StepsBarType.FIRST, title: '' },
    {
      step: StepsBarType.POLICY_DETAILS,
      title:
        productType === ProductType.MAID
          ? 'Helper’s Information'
          : 'Policy Details',
    },
    { step: StepsBarType.SELECT_PLAN, title: 'Select Plan' },
    { step: StepsBarType.SELECT_ADD_ON, title: 'Add-ons' },
    { step: StepsBarType.COMPLETE_PURCHASE, title: 'Summary' },
  ];

  const selectedStepsData = isManual ? stepsData : stepsDataSingPass;
  const currentStepIndex = selectedStepsData.findIndex(
    (item) => item.step === currentStep,
  );

  const steps: StepsProps['items'] = selectedStepsData.map(
    ({ title, step }, index) => {
      const stepStatus = getStepStatus(step, currentStep);
      const [firstWord, remaining] = splitText(title);
      return {
        title: stepStatus === 'process' && (
          <p className='inline-block text-xs leading-4'>
            {isMobile ? (
              <div className='mt-1'>
                <span className='block text-[#00ADEF]'>{firstWord}</span>
                <span className='block text-[#00ADEF]'>{remaining}</span>
              </div>
            ) : (
              <span className='block text-[#00ADEF]'>
                {firstWord} {remaining}
              </span>
            )}
          </p>
        ),
        status: stepStatus,
        disabled: stepStatus === 'wait' || isFinalized || isLoading,
        icon: (
          <div
            className={`custom-step-wait ${
              stepStatus === 'finish'
                ? 'border border-[#11CE00] bg-[#2ECC71] text-white'
                : stepStatus === 'process'
                  ? 'border border-[#3498DB] bg-[#3498DB] text-white'
                  : 'bg-[#F5F5F5] text-[#95A5A6]'
            }`}
          >
            {index + 1}
          </div>
        ),
      };
    },
  );

  const handleChange = (index: number) => {
    if (onChange) {
      const stepEnum = selectedStepsData[index]?.step;
      if (stepEnum !== undefined) {
        onChange(stepEnum);
      }
    }
  };

  return (
    <div className='w-full justify-center'>
      <Steps
        current={currentStepIndex}
        onChange={handleChange}
        labelPlacement='vertical'
        direction='horizontal'
        responsive={false}
        items={steps}
      />
    </div>
  );
}
