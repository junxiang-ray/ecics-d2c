'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

import { StepProcessBar } from '@/libs/enums/processBarEnums';

import { InsuranceLayoutContext } from '@/components/contexts/InsuranceLayoutContext';
import ProcessBar from '@/components/ProcessBar';

import ModalImportant from '@/app/motor/insurance/complete-purchase/ModalImportant';
import { ROUTES } from '@/constants/routes';
import { useVerifyPartnerCode } from '@/hook/insurance/common';
import { useSaveQuote } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

export type ProcessBarType = StepProcessBar | undefined;

interface InsuranceLayoutProps {
  children:
    | ReactNode
    | ((props: { onSave: (fn: () => any) => void }) => ReactNode);
  stepToRoute: Record<StepProcessBar, string>;
  headerTitle: string;
  redirectToLoginPath?: string;
}

function InsuranceLayout({
  children,
  stepToRoute,
  headerTitle,
  redirectToLoginPath,
}: InsuranceLayoutProps) {
  const router = useRouterWithQuery();
  const pathName = usePathname();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const { isMobile } = useDeviceDetection();
  const partner_code = params.get('partner_code') || '';
  const childSaveRef = useRef<() => any>(() => null);
  const [currentStep, setCurrentStep] = useState<ProcessBarType>(undefined);
  const { mutateAsync: saveQuote } = useSaveQuote();
  const [isShowPopupImportant, setIsShowPopupImportant] = useState(false);

  const isFinalized = useAppSelector(
    (state) => state.quote.quote?.is_finalized,
  );
  const { data: partnerInfo } = useVerifyPartnerCode(partner_code);

  const getStepFromRoute = (route: string): ProcessBarType => {
    const entry = Object.entries(stepToRoute).find(
      ([_, value]) => value === route,
    );
    return entry ? (entry[0] as unknown as StepProcessBar) : undefined;
  };

  useLayoutEffect(() => {
    const currentStep = getStepFromRoute(pathName);
    if (currentStep) {
      setCurrentStep(+currentStep as StepProcessBar);
    }
  }, [pathName]);

  const handleChangeStep = (step: StepProcessBar) => {
    if (step === currentStep) return;
    if (step === StepProcessBar.POLICY_DETAILS) {
      setIsShowPopupImportant(true);
      return;
    }
    const path = stepToRoute[step];
    if (!path) return;
    setCurrentStep(step);
    router.push(path);
  };

  const handleBack = () => {
    if (currentStep === undefined) return;
    if (currentStep === StepProcessBar.SELECT_PLAN || isFinalized) {
      setIsShowPopupImportant(true);
      return;
    }
    if (currentStep === StepProcessBar.POLICY_DETAILS && redirectToLoginPath) {
      router.push(redirectToLoginPath, { preserveQuery: false });
      return;
    }
    const previousStep = currentStep - 1;
    const previousRouter = stepToRoute[previousStep as StepProcessBar];
    router.push(previousRouter);
  };

  const handleSave = () => {
    const childData = childSaveRef.current();
    const { key, ...data } = childData;
    if (!key) return;
    saveQuote({
      key,
      data,
      is_sending_email: true,
    }).then((res) => {
      dispatch(updateQuote(res));
    });
  };

  return (
    <InsuranceLayoutContext.Provider value={{ handleBack }}>
      <>
        <div className='relative z-10 w-full border-b-2 border-gray-300 shadow-md'>
          <div
            className={`mx-auto flex w-full items-center p-4 lg:max-w-[1280px] ${isMobile ? 'justify-center' : 'text-left'}`}
          >
            {partnerInfo?.partner_name && (
              <div className='flex items-center'>
                <span
                  className={`text-base font-bold ${isMobile ? 'text-center' : 'ml-4'}`}
                >
                  {partnerInfo.partner_name}
                </span>
                <span className='mx-2 h-8 w-px bg-gray-300' />
              </div>
            )}
            <img
              className={`${!isMobile && !partnerInfo?.partner_name ? 'ml-4' : ''}`}
              src='/ecics.svg'
              alt='ecics'
            />
          </div>
        </div>

        <div className='no-scroll-mobile mx-auto h-[135px] w-full items-center justify-center bg-white lg:max-w-[1280px]'>
          {/*{(partnerInfo?.partner_name || partnerInfo) && (*/}
          {/*  <div className='block h-16 md:hidden'>*/}
          {/*    <BusinessPartnerBar*/}
          {/*      businessName={partnerInfo ? 'Business Partner Name' : ''}*/}
          {/*      companyName={partnerInfo?.partner_name}*/}
          {/*      onBackClick={handleBack}*/}
          {/*      onSaveClick={handleSave}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*)}*/}
          <div className='relative flex w-full justify-center p-4 px-10 pb-0 lg:w-[1200px]'>
            {/* Reopen in Day 1.5 */}
            {/*<SecondaryButton*/}
            {/*    icon={<ArrowBackIcon size={11}/>}*/}
            {/*    // className='hidden w-32 rounded-sm md:block' //for save button exist*/}
            {/*    className='absolute left-10 top-4 hidden w-32 rounded-sm md:block'*/}
            {/*    onClick={handleBack}*/}
            {/*>*/}
            {/*    Back*/}
            {/*</SecondaryButton>*/}
            <div>
              <div className='mb-[20px] text-center text-[24px] font-bold'>
                {headerTitle}
              </div>
              <div className='md:w-[520px]'>
                <ProcessBar
                  currentStep={currentStep}
                  onChange={handleChangeStep}
                  companyName={partnerInfo?.partner_name}
                  isFinalized={isFinalized}
                />
              </div>
            </div>
            <div></div>
            {/* Reopen in Day 1.5 */}
            {/* <PrimaryButton
                        className='hidden w-32 rounded-sm md:block'
                        onClick={handleSave}
                      >
                        Save
                      </PrimaryButton> */}
          </div>
        </div>

        <div className='mx-auto flex h-[calc(100svh-265px)] w-full flex-col items-center justify-between overflow-y-auto md:h-[calc(100vh-240px)]'>
          {typeof children === 'function'
            ? children({
                onSave: (fn: () => any) => (childSaveRef.current = fn),
              })
            : children}
        </div>
        {isShowPopupImportant && (
          <ModalImportant
            isShowPopupImportant={isShowPopupImportant}
            handleRedirect={() => router.push(ROUTES.INSURANCE.BASIC_DETAIL)}
            setIsShowPopupImportant={setIsShowPopupImportant}
          />
        )}
      </>
    </InsuranceLayoutContext.Provider>
  );
}

export default InsuranceLayout;
