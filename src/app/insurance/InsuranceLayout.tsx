'use client';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { StepProcessBar } from '@/libs/enums/processBarEnums';

import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import ProcessBar from '@/components/ProcessBar';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';

import { ROUTES } from '@/constants/routes';

import { useSaveQuote } from '@/hook/insurance/quote';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { usePathname } from 'next/navigation';
import BusinessPartnerBar from './components/BusinessPartnerBar';
export type ProcessBarType = StepProcessBar | undefined;
const stepToRoute: Record<StepProcessBar, string> = {
  [StepProcessBar.POLICY_DETAILS]: ROUTES.INSURANCE.BASIC_DETAIL,
  [StepProcessBar.SELECT_PLAN]: ROUTES.INSURANCE.PLAN,
  [StepProcessBar.SELECT_ADD_ON]: ROUTES.INSURANCE.ADD_ON,
  [StepProcessBar.COMPLETE_PURCHASE]: ROUTES.INSURANCE.COMPLETE_PURCHASE,
};
function getStepFromRoute(route: string): ProcessBarType {
  const entry = Object.entries(stepToRoute).find(
    ([_, value]) => value === route,
  );
  return entry ? (entry[0] as unknown as StepProcessBar) : undefined;
}
// Define props so that children can either be a node or a render function that accepts a registration callback.
interface InsuranceLayoutProps {
  children:
    | ReactNode
    | ((props: { onSave: (fn: () => any) => void }) => ReactNode);
}

function InsuranceLayout({ children }: InsuranceLayoutProps) {
  const router = useRouterWithQuery();
  const pathName = usePathname();
  const childSaveRef = useRef<() => any>(() => null);
  const [currentStep, setCurrentStep] = useState<ProcessBarType>(undefined);
  const { mutateAsync: saveQuote } = useSaveQuote();

  useLayoutEffect(() => {
    const currentStep = getStepFromRoute(pathName);
    if (currentStep) {
      setCurrentStep(+currentStep as StepProcessBar);
    }
  }, [pathName]);

  const handleChangeStep = (step: StepProcessBar) => {
    if (step === currentStep) return;
    const path = stepToRoute[step];
    if (!path) return;
    setCurrentStep(step);
    router.push(path);
  };

  const handleBack = () => {
    if (currentStep === undefined) return;
    if (currentStep === StepProcessBar.POLICY_DETAILS) {
      router.push(ROUTES.AUTH.REVIEW_INFO_DETAIL);
      return;
    }
    const previousStep = currentStep - 1;
    setCurrentStep(+previousStep as StepProcessBar);
    router.push(stepToRoute[previousStep as StepProcessBar]);
  };

  const handleSave = () => {
    const childData = childSaveRef.current();
    const { key, is_sending_email, ...data } = childData;
    if (!key) return;
    saveQuote({
      key,
      data,
      is_sending_email: true,
    });
  };
  return (
    <>
      <div className='sticky top-0 z-10 w-full bg-white'>
        <div className='block h-16 md:hidden'>
          <BusinessPartnerBar
            businessName='Business Partner Name'
            companyName='Leo Management Consultancy Pte Ltd'
            onBackClick={handleBack}
          />
        </div>
        <div className='flex w-full justify-between p-4 px-10 pb-0'>
          <SecondaryButton
            icon={<ArrowBackIcon size={11} />}
            className='hidden w-32 rounded-sm md:block'
            onClick={handleBack}
          >
            Back
          </SecondaryButton>
          <div className='md:w-[520px]'>
            <ProcessBar currentStep={currentStep} onChange={handleChangeStep} />
          </div>
          <PrimaryButton
            className='hidden w-32 rounded-sm md:block'
            onClick={handleSave}
          >
            Save
          </PrimaryButton>
        </div>
      </div>
      <div className='mx-auto w-full max-w-[1280px] px-2'>
        {typeof children === 'function'
          ? children({
              onSave: (fn: () => any) => (childSaveRef.current = fn),
            })
          : children}
      </div>
    </>
  );
}

export default InsuranceLayout;
