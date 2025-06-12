'use client';

import { Button } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserStep } from '@/libs/enums/processBarEnums';
import { Plan } from '@/libs/types/quote';
import { formatCurrency } from '@/libs/utils/utils';

import { useInsurance } from '@/components/contexts/InsuranceLayoutContext';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import { PrimaryButton } from '@/components/ui/buttons';

import { ROUTES } from '@/constants/routes';
import { useSaveQuote } from '@/hook/insurance/quote';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import SelfDeclarationConfirmModal from '@/app/motor/insurance/plan/components/SelfDeclarationConfirmModal';
import PlanMaid from './PlanMaid';
import { ProductType } from '@/app/motor/insurance/basic-detail/options';

export interface FormatPlan extends Plan {
  discount: number;
  currentPrice: number;
  promoCode: string;
}

function PlanDetail({
  onSaveRegister,
}: {
  onSaveRegister: (fn: () => any) => void;
}) {
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();
  const { handleBack } = useInsurance();

  const dispatch = useAppDispatch();
  const key = searchParams.get('key') || '';
  const { isMobile } = useDeviceDetection();
  const [showConfirmDeclaration, setShowConfirmDeclaration] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FormatPlan | null>(null);

  const maidQuoteInfo = useAppSelector((state) => state.maidQuote?.maidQuote);
  const {
    mutateAsync: saveQuote,
    isPending: isSaving,
    isSuccess,
  } = useSaveQuote();

  const plans = maidQuoteInfo?.data?.plans ?? [];

  useEffect(() => {
    onSaveRegister(() => {
      const data = {
        ...maidQuoteInfo?.data,
        current_step: UserStep.SELECT_PLAN,
        selected_plan: selectedPlan?.title,
        key: key,
      };
      return data;
    });
  }, [selectedPlan]);

  const plansFormatted: FormatPlan[] = plans.map((plan) => ({
    ...plan,
    discount: maidQuoteInfo?.promo_code?.discount ?? 0,
    currentPrice:
      plan.premium_with_gst /
      (1 - (maidQuoteInfo?.promo_code?.discount ?? 0) / 100),
    promoCode: maidQuoteInfo?.promo_code?.code ?? '',
  }));

  useEffect(() => {
    if (!plansFormatted.length) return;
    if (maidQuoteInfo?.data?.selected_plan) {
      const selectedPlan = plansFormatted.find(
        (plan) => plan.title === maidQuoteInfo?.data?.selected_plan,
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
      ...maidQuoteInfo?.data,
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
      <div className='flex flex-col items-center justify-center'>
        <div className='w-full max-w-[1280px]'>
          <div className='mx-4 pb-4 text-[16px] font-bold underline'>
            Select a plan
          </div>
          <div className='mx-4'>
            <PlanMaid
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
          <div className='flex w-full items-center justify-between border-t-2 bg-white p-4 py-2 md:max-w-7xl md:border-none md:py-4'>
            {isMobile ? (
              <div className='flex w-full flex-col items-center gap-3'>
                <div className='flex w-full justify-between px-2'>
                  <div>
                    <p className='text-base font-semibold text-[#080808]'>
                      {selectedPlan?.title} Plan
                    </p>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-row items-center gap-2'>
                      {!!selectedPlan?.discount && (
                        <span className='ps-4 text-sm font-normal text-[#FF0004] line-through decoration-1'>
                          {formatCurrency(selectedPlan?.currentPrice)}
                        </span>
                      )}
                      <p className='text-lg font-bold text-[#323743]'>
                        {formatCurrency(selectedPlan?.premium_with_gst)}
                      </p>
                    </div>
                    <p className='flex w-full justify-end text-xs font-semibold text-[#323743]'>
                      (inclusive of GST)
                    </p>
                  </div>
                </div>
                <div className='flex w-full items-center gap-4'>
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
                <div className='flex gap-20 px-2'>
                  <div>
                    <p className='text-2xl font-semibold text-[#080808]'>
                      {selectedPlan?.title} Plan
                    </p>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-row items-center gap-2'>
                      {!!selectedPlan?.discount && (
                        <span className='ps-4 text-sm font-normal text-[#FF0004] line-through decoration-1'>
                          {formatCurrency(selectedPlan?.currentPrice)}
                        </span>
                      )}
                      <p className='text-lg font-bold text-[#323743]'>
                        {formatCurrency(selectedPlan?.premium_with_gst)}
                      </p>
                    </div>
                    <p className='flex w-full justify-end text-xs font-semibold text-[#323743]'>
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
        product_type={ProductType.MAID}
      />
    </div>
  );
}

export default PlanDetail;
