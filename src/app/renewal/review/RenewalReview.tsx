'use client';

import { Button } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';

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
import { useAppDispatch, useAppSelector } from '@/redux/store/configureStore';

const RenewalReview = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: renewalContent } = useGetRenewalContent();
  const { mutate: postPayment } = usePostRenewalProcessPayment();
  const { mutate: savePolicy } = usePostSavePolicy();

  const renewalQuote = useAppSelector(
    (state) => state.renewalQuote?.renewalQuote,
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
    const coverageIncludes =
      renewal?.optional_benefits?.map((ob) => ob.name) ?? [];

    // Calculate totalPaid
    const gst = parseFloat(String(renewal?.renewalgst ?? 0));
    const subtotal = parseFloat(String(renewal?.renewalpremwgst ?? 0));
    const selectedAddonsFee = renewal?.selected_add_on_optional_benefits ?? [];
    const addonsTotal = selectedAddonsFee.reduce((sum, addon) => {
      return sum + Number(addon.prem ?? 0);
    }, 0);

    const subtotalFeeAfter = subtotal + addonsTotal;
    const totalPaid = (subtotalFeeAfter + gst).toFixed(2);
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
                coverage: renewal?.coverage,
                total_paid: totalPaid,
                poily_no: policy?.current_policy_no,
              },
              policy_summary: {
                policy_type: paymentData.data.product,
                policy_start_date: renewal?.renewal_start_date
                  ? dayjs(renewal.renewal_start_date).format('D-M-YYYY')
                  : undefined,
                policy_end_date: renewal?.renewal_end_date
                  ? dayjs(renewal.renewal_end_date).format('D-M-YYYY')
                  : undefined,
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
        />
      </div>
    </>
  );
};

export default RenewalReview;
