'use client';
import ProcessBar from '@/components/ProcessBar';
import BusinessPartnerBar from './components/BusinessPartnerBar';
import { useState } from 'react';
import { StepProcessBar } from '@/enums/processBarEnums';
import { usePathname, useRouter } from 'next/navigation';

const mapStepToPath = {
  [StepProcessBar.POLICY_DETAILS]: 'basic-detail',
  [StepProcessBar.SELECT_PLAN]: 'plan',
  [StepProcessBar.SELECT_ADD_ON]: 'add-on',
  [StepProcessBar.COMPLETE_PURCHASE]: 'complete-purchase',
};

function InsuranceLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(StepProcessBar.POLICY_DETAILS);
  const handleChangeStep = (step: StepProcessBar) => {
    if (step === currentStep) return;
    const path = mapStepToPath[step];
    setCurrentStep(step);
    router.push(`/insurance/${path}`);
  };
  return (
    <div>
      <div className='sticky top-0 z-10 w-screen bg-white'>
        <BusinessPartnerBar
          businessName='Business Partner Name'
          companyName='Leo Management Consultancy Pte Ltd'
        />
        <div className='p-4 pb-0'>
          <ProcessBar currentStep={currentStep} onChange={handleChangeStep} />
        </div>
      </div>
      <div className=''>{children}</div>
    </div>
  );
}

export default InsuranceLayout;
