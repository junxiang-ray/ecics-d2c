'use client';

// import HeaderVehicleInfo from './components/HeaderVehicleInfo';
// import HeaderVehicleInfoMobile from './components/HeaderVehicleInfoMobile';
import { Button } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';

import { UserStep } from '@/libs/enums/processBarEnums';
import { Plan } from '@/libs/types/quote';
import { formatCurrency } from '@/libs/utils/utils';

import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import { PrimaryButton } from '@/components/ui/buttons';

import { ROUTES } from '@/constants/routes';
import { useSaveQuote } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

import PlanCardMobile from './components/PlanCardMobile';
import SelfDeclarationConfirmModal from './components/SelfDeclarationConfirmModal';

export interface FormatPlan extends Plan {
  discount: number;
  currentPrice: number;
  promoCode: string;
}

function PlanDetail({
  onSaveRegister,
  handleBack,
}: {
  onSaveRegister: (fn: () => any) => void;
  handleBack: () => void;
}) {
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const key = searchParams.get('key') || '';
  const { isMobile } = useDeviceDetection();
  const [showConfirmDeclaration, setShowConfirmDeclaration] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FormatPlan | null>(null);

  const quoteInfo = useAppSelector((state) => state.quote?.quote);
  const {
    mutateAsync: saveQuote,
    isPending: isSaving,
    isSuccess,
  } = useSaveQuote();

  const plans = quoteInfo?.data?.plans ?? [];

  useEffect(() => {
    onSaveRegister(() => {
      const data = {
        ...quoteInfo?.data,
        current_step: UserStep.SELECT_PLAN,
        selected_plan: selectedPlan?.title,
        key: key,
      };
      return data;
    });
  }, [selectedPlan]);

  const plansFormatted: FormatPlan[] = plans.map((plan) => ({
    ...plan,
    discount: quoteInfo?.promo_code?.discount ?? 0,
    currentPrice:
      plan.premium_with_gst /
      (1 - (quoteInfo?.promo_code?.discount ?? 0) / 100),
    promoCode: quoteInfo?.promo_code?.code ?? '',
  }));

  useEffect(() => {
    if (!plansFormatted.length) return;
    if (quoteInfo?.data?.selected_plan) {
      const selectedPlan = plansFormatted.find(
        (plan) => plan.title === quoteInfo?.data?.selected_plan,
      );
      if (selectedPlan) {
        setSelectedPlan(selectedPlan);
        return;
      }
    }
    const recommendedPlan = plansFormatted.find((plan) => plan.is_recommended);
    if (recommendedPlan) {
      setSelectedPlan(recommendedPlan);
      return;
    }
  }, [plans]);

  const choicePlan = (plan: FormatPlan | null) => {
    const data = {
      ...quoteInfo?.data,
      selected_plan: plan?.title,
      key: key,
    };
    saveQuote({ key, data, is_sending_email: false }).then((res) => {
      if (res) {
        dispatch(updateQuote(res));
      }
      router.push(ROUTES.INSURANCE.ADD_ON);
    });
    setShowConfirmDeclaration(false);
  };

  return (
    <div className='flex w-full flex-col justify-center md:mb-16'>
      {/* hidden for now */}
      {/* <div className='py-4 md:hidden'>
                <HeaderVehicleInfoMobile
                  vehicleInfo={quoteInfo?.data.vehicle_info_selected}
                />
              </div> */}
      <div className='flex flex-col items-center justify-center'>
        <div className='w-full max-w-[1280px]'>
          <div className='mx-4 pb-4 text-[16px] font-bold underline'>
            Select a plan
          </div>
          {/* hidden for now */}
          {/* <div className='hidden items-center justify-between md:flex md:flex-col md:gap-4'>
                        <HeaderVehicleInfo
                          vehicleInfo={quoteInfo?.data.vehicle_info_selected}
                          insuranceAdditionalInfo={
                            quoteInfo?.data.insurance_additional_info
                          }
                        />
                      </div> */}
          {/* UI for Mobile and Desktop (updated*/}
          <div className='mx-4'>
            <PlanCardMobile
              plans={plansFormatted}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>

      <div className='mt-4 w-full md:flex md:flex-row md:justify-center'>
        <div className='fixed bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 transform justify-center border-[1px] border-gray-100 bg-white shadow-md shadow-gray-200'>
          <div className='flex w-full items-center justify-between border-t-2 bg-white p-4 py-2 md:max-w-5xl md:border-none md:py-4'>
            {isMobile ? (
              <div className='flex w-full flex-col items-center gap-3'>
                <div className='flex w-full items-center justify-between text-center'>
                  <p className='mr-[4px] max-w-[150px] text-start text-[16px] font-semibold text-[#323743]'>
                    {selectedPlan?.title}
                  </p>
                  {!!selectedPlan?.discount && (
                    <span className='text-[14px] font-normal text-[#FF0004] line-through decoration-1 md:text-2xl md:text-[#EF0000]'>
                      {formatCurrency(selectedPlan?.currentPrice)}
                    </span>
                  )}
                  <div className='ml-[4px]'>
                    <p className='text-[18px] font-bold text-[#1B223C]'>
                      {formatCurrency(selectedPlan?.premium_with_gst)}
                    </p>
                    <p className='text-[12px] font-semibold text-[#323743]'>
                      (inclusive of GST)
                    </p>
                  </div>
                </div>
                <div className='flex w-full items-center'>
                  <Button
                    color='cyan'
                    icon={<ArrowBackIcon size={16} />}
                    shape='circle'
                    className='mr-[6px] border-none bg-gray-200 pt-[6px]'
                    onClick={handleBack}
                  />
                  <PrimaryButton
                    onClick={() => setShowConfirmDeclaration(true)}
                    className='w-full bg-[#52C41A]'
                    disabled={!selectedPlan?.id}
                    loading={isSaving}
                  >
                    Next
                  </PrimaryButton>
                </div>
              </div>
            ) : (
              <div className='flex w-full items-center justify-between'>
                <Button
                  color='cyan'
                  icon={<ArrowBackIcon size={16} />}
                  shape='circle'
                  className='border-none bg-gray-200 pt-[6px]'
                  onClick={handleBack}
                />
                <div className='flex items-center gap-4 px-2'>
                  <p className='text-lg font-semibold text-[#323743]'>
                    {selectedPlan?.title}
                  </p>
                  {!!selectedPlan?.discount && (
                    <span className='ps-4 text-[18px] font-normal text-[#FF0004] line-through decoration-1'>
                      {formatCurrency(selectedPlan?.currentPrice)}
                    </span>
                  )}
                  <div className='flex flex-col gap-1'>
                    <p className='text-3xl font-bold text-[#1B223C]'>
                      {formatCurrency(selectedPlan?.premium_with_gst)}
                    </p>
                    <p className='font-semibold text-[#323743]'>
                      (inclusive of GST)
                    </p>
                  </div>
                </div>
                <PrimaryButton
                  onClick={() => setShowConfirmDeclaration(true)}
                  className='w-40 bg-[#52C41A]'
                  disabled={!selectedPlan?.id}
                  loading={isSaving}
                >
                  Next
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>
      </div>

      <SelfDeclarationConfirmModal
        visible={showConfirmDeclaration}
        onOk={() => choicePlan(selectedPlan)}
        onCancel={() => setShowConfirmDeclaration(false)}
      />
    </div>
  );
}

export default PlanDetail;
