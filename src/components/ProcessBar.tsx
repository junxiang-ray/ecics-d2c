'use client';

import type { StepsProps } from 'antd';
import { Steps } from 'antd';
import { useSearchParams } from 'next/navigation';

import { StepProcessBar } from '@/libs/enums/processBarEnums';

import { ProcessBarType } from '@/components/layouts/InsuranceLayout';

import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';

interface ProcessBarProps {
  currentStep: ProcessBarType;
  onChange?: (current: number) => void;
  companyName?: string;
  isFinalized?: boolean;
  productType: string;
}

const stepsDataSingPass = [
  { step: StepProcessBar.POLICY_DETAILS, title: 'Policy Details' },
  { step: StepProcessBar.SELECT_PLAN, title: 'Select Plan' },
  { step: StepProcessBar.SELECT_ADD_ON, title: 'Add-ons' },
  { step: StepProcessBar.COMPLETE_PURCHASE, title: 'Summary' },
];

const getStepStatus = (step: StepProcessBar, currentStep: ProcessBarType) => {
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

export default function ProcessBar({
  currentStep,
  onChange,
  companyName,
  isFinalized,
  productType,
}: ProcessBarProps) {
  const searchParams = useSearchParams();
  const { isMobile } = useDeviceDetection();
  const isManual = searchParams.get('manual') === 'true';

  const stepsData = [
    { step: StepProcessBar.POLICY_DETAILS, title: 'Basic Information' },
    { step: StepProcessBar.SELECT_PLAN, title: 'Select Plan' },
    { step: StepProcessBar.SELECT_ADD_ON, title: 'Add-ons' },
    {
      step: StepProcessBar.PERSONAL_DETAIL,
      title: productType === ProductType.MAID ? 'Helper’s Details' : 'Details',
    },
    { step: StepProcessBar.COMPLETE_PURCHASE, title: 'Summary' },
  ];
  const selectedStepsData = isManual ? stepsData : stepsDataSingPass;

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
        disabled: stepStatus === 'wait' || isFinalized,
        icon: (
          <div
            className={`custom-step-wait bg-red-500${
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
  return (
    <div className='w-full justify-center'>
      <Steps
        current={currentStep}
        onChange={onChange}
        labelPlacement='vertical'
        direction='horizontal'
        responsive={false}
        items={steps}
      />
    </div>
  );
}
