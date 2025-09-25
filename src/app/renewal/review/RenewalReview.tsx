'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';

import { formatDateString } from '@/libs/utils/dayjs';

import { BackIcon } from '@/components/icons/renewal-icons';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { PricingSummaryRenewal } from '@/app/renewal/components/FeeBarRenewal';
import RenewalReviewForm from '@/app/renewal/review/RenewalReviewForm';
import { GST_RATE } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { useGetRenewalContent } from '@/hook/cms/verify';
import {
  usePostRenewalProcessPayment,
  usePostSavePolicy,
} from '@/hook/renewal/renewalQuote';
import { setRenewalKey } from '@/redux/slices/renewalQuote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

const RenewalReview = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: renewalContent } = useGetRenewalContent();
  const { mutate: postPayment } = usePostRenewalProcessPayment();
  const { mutate: savePolicy, isPending } = usePostSavePolicy();

  const renewalQuote = useAppSelector(
    (state) => state.renewalQuote?.renewalQuote,
  );
  const productTypeState = useAppSelector(
    (state) => state.renewalQuote.productType,
  );

  const policy = renewalQuote?.renewal_info?.policy_details;
  const renewal = renewalQuote?.renewal_info;

  const handleBackPolicyRenewal = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_DETAIL);
  };

  const handleMakePayment = () => {
    const payload = {
      email_address: renewal?.insured_info?.email,
      contact_no: renewal?.insured_info?.contact_no,
      proposal_id: renewalQuote?.proposal_id,
    };
    const productType = PRODUCT_NAME.MOTOR;
    // Coverage Includes
    const coverageIncludes = [
      ...(renewal?.optional_benefits?.map((ob) => ob.name) ?? []),
      ...(renewal?.selected_add_on_optional_benefits?.map(
        (addon) => addon.name,
      ) ?? []),
    ];

    // Calculate totalPaid
    const gst = parseFloat(String(renewal?.renewalgst ?? 0));
    const subtotal = parseFloat(String(renewal?.renewalpremwgst ?? 0));
    const planFee = parseFloat(String(renewal?.renewalplanprem ?? 0));

    const includedAddonsFee = renewal?.optional_benefits ?? [];
    const addonsIncludedTotal = includedAddonsFee.reduce((sum, addon) => {
      return sum + Number(addon.prem ?? 0);
    }, 0);
    const selectedAddonsFee = renewal?.selected_add_on_optional_benefits ?? [];
    const addonsSelectedTotal = selectedAddonsFee.reduce((sum, addon) => {
      const subOptionsTotal =
        addon.sub_options?.reduce(
          (subSum, sub) => subSum + Number(sub.prem ?? 0),
          0,
        ) ?? 0;

      const premValue = Number(addon.prem ?? 0) + subOptionsTotal;
      return sum + premValue;
    }, 0);

    const namedDriversCount = policy?.named_drivers?.length ?? 0;
    const nameDriversTotalFee =
      namedDriversCount > 1 ? (namedDriversCount - 1) * 60 : 0;

    const subtotalFeeAfter =
      planFee + addonsIncludedTotal + addonsSelectedTotal + nameDriversTotalFee;

    const hasAddonsPlus = addonsSelectedTotal > 0;
    const gstAmount = subtotalFeeAfter * GST_RATE;
    const totalPaid = hasAddonsPlus
      ? subtotalFeeAfter + gstAmount
      : subtotal + gst;
    const generatedKey = uuid();

    postPayment(
      { productType, payload },
      {
        onSuccess: (paymentData) => {
          const savePolicyPayload = {
            proposal_id: paymentData.data.proposal_id,
            policy_id: paymentData.data.policy_id,
            key: generatedKey,
            renewal_data: {
              renewal_summary: {
                coverage: policy?.coverage,
                total_paid: totalPaid,
                poily_no: policy?.current_policy_no,
              },
              policy_summary: {
                policy_type: productTypeState,
                policy_start_date: formatDateString(
                  renewal?.renewal_start_date,
                ),
                policy_end_date: formatDateString(renewal?.renewal_end_date),
                veh_reg_no: policy?.vehicle_details?.reg_no,
              },
              coverage_includes: coverageIncludes,
              documents:
                paymentData.data.documents?.map(
                  (doc: { name: string; url: string }) => ({
                    name: doc.name,
                    url: doc.url,
                  }),
                ) ?? [],
            },
          };
          dispatch(setRenewalKey(generatedKey));

          // Call api savePolicy
          savePolicy(
            { productType, payload: savePolicyPayload },
            {
              onSuccess: (data) => {
                // redirect to payment_url
                window.location.href = paymentData.data.payment_url;
              },
              onError: (error) => {
                console.error('Save policy failed:', error);
              },
            },
          );
        },
        onError: (error) => {
          console.error('Payment failed:', error);
        },
      },
    );
  };

  return (
    <>
      <div className='relative mb-[80px] flex min-h-screen w-full flex-col bg-gray-50'>
        <div className='flex items-center border-b border-gray-300 bg-white px-4 py-3'>
          <Button
            type='text'
            icon={<BackIcon size={20} className='mt-1' />}
            onClick={(e) => {
              e.stopPropagation();
              handleBackPolicyRenewal?.();
            }}
            className='p-0'
          />
          <h1 className='flex-1 text-center text-lg font-semibold'>
            Review & Confirm
          </h1>
        </div>

        <div className='p-6'>
          <RenewalReviewForm
            renewalContent={renewalContent?.data?.attributes}
            policy={policy}
            renewal={renewal}
          />
        </div>
      </div>
      <div className='w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-10'>
        <PricingSummaryRenewal
          textButtonLeft='Back'
          onClickButtonLeft={handleBackPolicyRenewal}
          onClick={handleMakePayment}
          loading={isPending}
        />
      </div>
    </>
  );
};

export default RenewalReview;
