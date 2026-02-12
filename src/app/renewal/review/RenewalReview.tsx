'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';

import { formatDateString } from '@/libs/utils/dayjs';

import { BackIcon } from '@/components/icons/renewal-icons';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { PricingSummaryRenewal } from '@/app/renewal/components/FeeBarRenewal';
import RenewalReviewForm from '@/app/renewal/review/RenewalReviewForm';
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
      address_line1: renewal?.insured_info?.address?.address_line1,
      address_line2: renewal?.insured_info?.address?.address_line2,
      postal: renewal?.insured_info?.address?.postal,
      marital_status_code: renewal?.insured_info?.marital_status,
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
    const totalPaid = parseFloat(String(renewal?.renewalpremwgst ?? 0));
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
