'use client';

import { Button } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { formatToDDMMYYYY } from '@/libs/utils/date-utils';

import { BackIcon, WarningNoticeIcon } from '@/components/icons/renewal-icons';

import {
  MARITAL_STATUS_MAP,
  MARITAL_STATUS_OPTIONS,
} from '@/app/motor/insurance/basic-detail/options';
import { PricingSummaryRenewal } from '@/app/renewal/components/FeeBarRenewal';
import RenewalDetailForm from '@/app/renewal/detail/RenewalDetailForm';
import ModalPremiumRenewal from '@/app/renewal/modal/ModalPremiumRenewal';
import { ROUTES } from '@/constants/routes';
import { useGetRenewalContent } from '@/hook/cms/verify';
import { useAppSelector } from '@/redux/store';

const RenewalDetail = () => {
  const router = useRouter();
  const renewalQuote = useAppSelector(
    (state) => state.renewalQuote?.renewalQuote,
  );
  const policy = renewalQuote?.renewal_info?.policy_details;
  const renewal = renewalQuote?.renewal_info;

  const { data: renewalContent } = useGetRenewalContent();

  const [isShowPopupPremium, setIsShowPopupPremium] = useState(false);

  const initialValues: any = {
    // Policy details
    current_policy_no: policy?.current_policy_no ?? '',
    coverage: policy?.coverage ?? '',
    current_policy_expiry_date: policy?.current_policy_expiry_date
      ? formatToDDMMYYYY(policy.current_policy_expiry_date)
      : '',
    sum_insured: policy?.sum_insured ?? '',
    agency: policy?.agency ?? '',

    // Renewal
    date_extracted: renewal?.date_extracted
      ? formatToDDMMYYYY(renewal.date_extracted)
      : '',
    scheme: renewal?.scheme ?? '',
    renewal_start_date: renewal?.renewal_start_date
      ? dayjs(renewal.renewal_start_date, ['D-M-YYYY', 'DD-MM-YYYY'])
      : null,
    renewal_expiry_date: renewal?.renewal_end_date
      ? dayjs(renewal.renewal_end_date, ['D-M-YYYY', 'DD-MM-YYYY'])
      : null,

    // Renewal excess
    policy_excess_0: renewal?.renewal_excess?.policy_excess?.[0]?.value ?? '',
    policy_excess_1: renewal?.renewal_excess?.policy_excess?.[1]?.value ?? '',
    additional_excess_0:
      renewal?.renewal_excess?.additional_excess?.[0]?.value ?? '',
    additional_excess_1:
      renewal?.renewal_excess?.additional_excess?.[1]?.value ?? '',

    // Vehicle details
    reg_no: policy?.vehicle_details?.reg_no ?? '',
    make: policy?.vehicle_details?.make ?? '',
    model: policy?.vehicle_details?.model ?? '',
    first_reg_on: policy?.vehicle_details?.first_reg_on ?? '',
    hire_purchase: policy?.vehicle_details?.hire_purchase ?? '',
    model_type: policy?.vehicle_details?.model_type ?? '',

    // Claims / NCD
    no_of_claims: policy?.claim_ncd_details?.no_of_claims ?? 0,
    claim_incurred: policy?.claim_ncd_details?.claim_incurred ?? 0,
    current_ncd: policy?.claim_ncd_details?.current_ncd ?? '',
    renewal_ncd: policy?.claim_ncd_details?.renewal_ncd ?? '',

    // Insured info
    name: renewal?.insured_info?.name ?? '',
    nric: renewal?.insured_info?.nric ?? '',
    dob: renewal?.insured_info?.dob ?? '',
    gender: renewal?.insured_info?.gender === 'M' ? 'Male' : 'Female',
    marital_status: renewal?.insured_info?.marital_status
      ? (MARITAL_STATUS_OPTIONS.find(
          (opt) =>
            opt.value ===
            MARITAL_STATUS_MAP[renewal.insured_info.marital_status],
        )?.text ?? 'N/A')
      : 'N/A',
    address_line1: renewal?.insured_info?.address?.address_line1 ?? '',
    address_line2: renewal?.insured_info?.address?.address_line2 ?? '',
    address_line3: renewal?.insured_info?.address?.address_line3 ?? '',
    postal: renewal?.insured_info?.address?.postal ?? '',
    email: renewal?.insured_info?.email ?? '',
    contact_no: renewal?.insured_info?.contact_no ?? '',
    driv_exp: renewal?.insured_info?.driv_exp ?? 0,

    // Named drivers
    named_drivers: (policy?.named_drivers ?? []).map((driver) => ({
      name: driver?.name ?? '',
      nric: driver?.icno ?? '',
      dob: driver?.dob ? dayjs(driver.dob).format('YYYY-MM-DD') : '',
      marital_status: MARITAL_STATUS_MAP[driver?.martial_status] ?? '',
      driv_exp: driver?.driv_exp ?? '',
      gender: driver?.gender === 'M' ? 'Male' : 'Female',
    })),
  };

  const handleBackRenewalNotice = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_NOTICE);
  };

  const handleNext = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_REVIEW);
  };

  const onSubmit: SubmitHandler<FormData> = async (data: any) => {
    return;
  };

  const gst = parseFloat(String(renewal?.renewalgst ?? 0));
  const subtotal = parseFloat(String(renewal?.renewalpremwgst ?? 0));

  const planFee = Number(renewal?.renewalpremb4gst ?? 0);
  const subtotalFeeInitial = Number(renewal?.renewalpremwgst ?? 0);

  return (
    <>
      <div className='relative mb-[85px] flex min-h-screen w-full flex-col bg-gray-50'>
        <div className='flex items-center border-b border-gray-300 bg-white px-4 py-3'>
          <Button
            type='text'
            icon={<BackIcon size={20} className='mt-1' />}
            onClick={(e) => {
              e.stopPropagation();
              handleBackRenewalNotice?.();
            }}
            className='p-0'
          />
          <h1 className='flex-1 text-center text-lg font-semibold'>
            Policy Renewal
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
          <RenewalDetailForm
            initialValues={initialValues}
            renewalQuote={renewalQuote}
            policy={policy}
            renewal={renewal}
            onSubmit={onSubmit}
          />
        </div>
      </div>
      <div className='mt-32 w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-10'>
        <PricingSummaryRenewal
          textButton='Next'
          textButtonLeft='Back'
          onClickButtonLeft={handleBackRenewalNotice}
          onClick={handleNext}
          isPolicyRenewalScreen={true}
          setIsShowPopupPremium={setIsShowPopupPremium}
          planFee={planFee}
          addonFee={subtotalFeeInitial}
        />
      </div>
      <ModalPremiumRenewal
        isShowPopupPremium={isShowPopupPremium}
        setIsShowPopupPremium={setIsShowPopupPremium}
        gst={gst}
        subtotal={subtotal}
        renewalQuote={renewalQuote}
      />
    </>
  );
};

export default RenewalDetail;
