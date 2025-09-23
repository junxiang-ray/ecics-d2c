'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import { formatDateString } from '@/libs/utils/dayjs';
import { createPassphrase } from '@/libs/utils/utils';

import { BackIcon, WarningNoticeIcon } from '@/components/icons/renewal-icons';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { PricingSummaryRenewal } from '@/app/renewal/components/FeeBarRenewal';
import RenewalNoticeForm from '@/app/renewal/notice/RenewalNoticeForm';
import { ROUTES } from '@/constants/routes';
import { useGetRenewalContent } from '@/hook/cms/verify';
import {
  usePostEditRenewal,
  usePostRenewalProcessPayment,
  usePostSavePolicy,
} from '@/hook/renewal/renewalQuote';
import {
  setRenewalKey,
  updateRenewalQuote,
} from '@/redux/slices/renewalQuote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

const RenewalNotice = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: renewalContent } = useGetRenewalContent();
  const { mutate: postPayment } = usePostRenewalProcessPayment();
  const { mutate: savePolicy, isPending } = usePostSavePolicy();
  const { mutate: postEditRenewal } = usePostEditRenewal();
  const renewalQuote = useAppSelector(
    (state) => state.renewalQuote?.renewalQuote,
  );

  const productTypeState = useAppSelector(
    (state) => state.renewalQuote.productType,
  );
  const vehData = useAppSelector((state) => state.renewalQuote.vehData);

  const policy = renewalQuote?.renewal_info?.policy_details;
  const renewal = renewalQuote?.renewal_info;
  const isSingpassFlowRenewal = useAppSelector(
    (state) => state.general.isSingpassFlowRenewal,
  );

  useEffect(() => {
    const policyId = renewalQuote?.policy_id ?? '';
    const proposalId = renewalQuote?.proposal_id ?? '';
    const vehRegNo =
      renewalQuote?.renewal_info.policy_details.vehicle_details?.reg_no ?? '';
    const nric = renewalQuote?.renewal_info?.insured_info?.nric || '';
    const dob = renewalQuote?.renewal_info?.insured_info?.dob || '';
    const renewalEndDate = renewalQuote?.renewal_info?.renewal_end_date ?? '';
    const selectedAddons =
      renewalQuote?.selected_add_on_optional_benefits ?? [];
    const passphrase = createPassphrase(dob, nric);
    const payload = {
      policy_id: policyId,
      proposal_id: proposalId,
      veh_reg_no: vehRegNo,
      passphrase,
      renewal_end_date: renewalEndDate,
      email_address: '',
      contact_no: '',
      selected_add_on_optional_benefits: selectedAddons,
      finalize_renewal: false,
    };

    const productType = PRODUCT_NAME.MOTOR;
    postEditRenewal(
      { productType, payload },
      {
        onSuccess: (data) => {
          const apiData = data?.data ?? data ?? {};
          if (!renewalQuote) return;
          const updatedRenewalQuote = {
            ...renewalQuote,
            renewal_info: {
              ...renewalQuote.renewal_info,
              renewalplanprem:
                apiData.renewal_info?.renewalplanprem ??
                renewalQuote.renewal_info?.renewalplanprem,
              renewalpremb4gst:
                apiData.renewal_info?.renewalpremb4gst ??
                renewalQuote.renewal_info?.renewalpremb4gst,
              renewalgst:
                apiData.renewal_info?.renewalgst ??
                renewalQuote.renewal_info?.renewalgst,
              renewalpremwgst:
                apiData.renewal_info?.renewalpremwgst ??
                renewalQuote.renewal_info?.renewalpremwgst,
            },
          };
          dispatch(updateRenewalQuote(updatedRenewalQuote));
        },
        onError: (err) => {
          console.error('Failed to update renewal', err);
        },
      },
    );
  }, [dispatch]);

  const handleBackDashboard = () => {
    if (isSingpassFlowRenewal) {
      if (vehData?.policies?.length && vehData.policies.length > 1) {
        router.push(ROUTES.RENEWAL.RENEWAL_DASHBOARD);
      } else {
        router.push(ROUTES.RENEWAL.LOGIN);
      }
    } else {
      router.push(ROUTES.RENEWAL.LOGIN); // Manual flow
    }
  };

  const handleEditRenewal = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_DETAIL);
  };

  const handleMakePayment = () => {
    const payload = {
      email_address: renewal?.insured_info?.email,
      contact_no: renewal?.insured_info?.contact_no,
      proposal_id: renewalQuote?.proposal_id,
    };
    const productType = PRODUCT_NAME.MOTOR;
    const generatedKey = uuid();

    postPayment(
      { productType, payload },
      {
        onSuccess: (paymentData) => {
          // payload savePolicy
          const coverageIncludes =
            renewal?.optional_benefits?.map((ob) => ob.name) ?? [];

          const savePolicyPayload = {
            proposal_id: paymentData.data.proposal_id,
            policy_id: paymentData.data.policy_id,
            key: generatedKey,
            renewal_data: {
              renewal_summary: {
                coverage: policy?.coverage,
                total_paid:
                  Number(renewal?.renewalpremb4gst ?? 0) +
                  Number(renewal?.renewalgst ?? 0),
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
              handleBackDashboard?.();
            }}
            className='p-0'
          />
          <h1 className='flex-1 text-center text-lg font-semibold'>
            Renewal Notice
          </h1>
        </div>

        <div className='p-6'>
          <div className='rounded-lg border border-orange-200 bg-[#FFF7ED] p-5'>
            <div className='flex items-start gap-2'>
              <WarningNoticeIcon className='mt-1 text-[#F54900]' size={22} />
              <div
                className='prose prose-sm text-[#CA3500]'
                dangerouslySetInnerHTML={{
                  __html:
                    renewalContent?.data?.attributes?.renewal_notice || '',
                }}
              />
            </div>
          </div>
          <RenewalNoticeForm
            renewalContent={renewalContent?.data?.attributes}
            policy={policy}
            renewal={renewal}
          />
        </div>
      </div>
      <div className='w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-10'>
        <PricingSummaryRenewal
          onClickButtonLeft={handleEditRenewal}
          onClick={handleMakePayment}
          loading={isPending}
        />
      </div>
    </>
  );
};

export default RenewalNotice;
