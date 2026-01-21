'use client';

import { Button } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { SelectedAddon } from '@/libs/types/renewalQuote';
import { formatToDDMMYYYY, parseDMYToDate } from '@/libs/utils/date-utils';
import {
  buildRenewalPayload,
  capitalizeWords,
  createPassphrase,
} from '@/libs/utils/utils';

import { BackIcon, WarningNoticeIcon } from '@/components/icons/renewal-icons';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import {
  MARITAL_STATUS_MAP,
  MARITAL_STATUS_OPTIONS,
  MaritalCode,
} from '@/app/motor/insurance/basic-detail/options';
import { PricingSummaryRenewal } from '@/app/renewal/components/FeeBarRenewal';
import RenewalDetailForm, {
  RenewalFormData,
} from '@/app/renewal/detail/RenewalDetailForm';
import ModalPremiumRenewal from '@/app/renewal/modal/ModalPremiumRenewal';
import { COUNTRY_SINGAPORE, GST_RATE } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { useGetRenewalContent } from '@/hook/cms/verify';
import { usePostEditRenewal } from '@/hook/renewal/renewalQuote';
import { updateRenewalQuote } from '@/redux/slices/renewalQuote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';

const RenewalDetail = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const formRef = useRef<{ submit: () => void }>(null);

  const renewalQuote = useAppSelector(
    (state) => state.renewalQuote?.renewalQuote,
  );

  const policy = renewalQuote?.renewal_info?.policy_details;
  const renewal = renewalQuote?.renewal_info;
  const dob = renewal?.insured_info?.dob || '';

  const { data: renewalContent } = useGetRenewalContent();
  const { mutate: postEditRenewal, isPending } =
    usePostEditRenewal('withOptionals');

  const [isShowPopupPremium, setIsShowPopupPremium] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

  useEffect(() => {
    const payload = buildRenewalPayload(renewalQuote);
    if (!payload) return;

    postEditRenewal({ productType: PRODUCT_NAME.MOTOR, payload });
  }, [postEditRenewal]);

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
    renewal_start_date: parseDMYToDate(renewal?.renewal_start_date),
    renewal_expiry_date: parseDMYToDate(renewal?.renewal_end_date),

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
            MARITAL_STATUS_MAP[
              renewal.insured_info.marital_status as MaritalCode
            ],
        )?.text ?? 'N/A')
      : 'N/A',
    address_line1: renewal?.insured_info?.address?.address_line1 ?? '',
    address_line2: renewal?.insured_info?.address?.address_line2 ?? '',
    address_line3: renewal?.insured_info?.address?.address_line3 ?? '',
    country: COUNTRY_SINGAPORE,
    postal: renewal?.insured_info?.address?.postal ?? '',
    email: renewal?.insured_info?.email ?? '',
    contact_no: renewal?.insured_info?.contact_no ?? '',
    driv_exp: renewal?.insured_info?.driv_exp ?? 0,

    // Named drivers
    named_drivers: (policy?.named_drivers ?? []).map((driver) => ({
      name: driver?.name ?? '',
      nric: driver?.icno ?? '',
      dob: driver?.dob,
      marital_status: capitalizeWords(
        MARITAL_STATUS_MAP[driver?.martial_status as MaritalCode] ?? '',
      ),
      driv_exp: driver?.driv_exp ?? '',
      gender: driver?.gender === 'M' ? 'Male' : 'Female',
    })),
  };

  const handleBackRenewalNotice = () => {
    router.push(ROUTES.RENEWAL.RENEWAL_NOTICE);
  };

  const handleNext = (value: RenewalFormData) => {
    const policyId = renewalQuote?.policy_id ?? '';
    const proposalId = renewalQuote?.proposal_id ?? '';
    const vehRegNo =
      renewalQuote?.renewal_info?.policy_details?.vehicle_details?.reg_no ?? '';
    const nric = renewalQuote?.renewal_info?.insured_info?.nric || '';

    const passphrase = createPassphrase(dob, nric);

    const renewalEndDate = value.renewal_expiry_date
      ? dayjs(value.renewal_expiry_date).format('DD-MM-YYYY')
      : '';

    const payload = {
      policy_id: policyId,
      proposal_id: proposalId,
      veh_reg_no: vehRegNo,
      passphrase,
      renewal_end_date: renewalEndDate,
      email_address: value.email,
      contact_no: value.contact_no,
      selected_add_on_optional_benefits: selectedAddons,
      finalize_renewal: false,
    };

    const productType = PRODUCT_NAME.MOTOR;

    postEditRenewal(
      { productType, payload },
      {
        onSuccess: (data) => {
          dispatch(
            updateRenewalQuote({
              ...data.data,
              renewal_info: {
                ...renewalQuote?.renewal_info,
                ...data.data.renewal_info, // Merge from API
                policy_details: {
                  ...data.data.renewal_info.policy_details,
                  current_policy_no:
                    renewalQuote?.renewal_info?.policy_details
                      ?.current_policy_no ?? '',
                },
                insured_info: {
                  ...data.data.renewal_info.insured_info,
                  ...value,
                  gender: value.gender?.toUpperCase().startsWith('M')
                    ? 'M'
                    : 'F',
                  marital_status: value.marital_status
                    ? value.marital_status.charAt(0).toUpperCase()
                    : '',
                  driv_exp:
                    renewalQuote?.renewal_info?.insured_info?.driv_exp ?? '',
                  address: {
                    ...data.data.renewal_info.insured_info.address,
                    address_line1: value.address_line1,
                    address_line2: value.address_line2,
                    address_line3: value.address_line3,
                    postal: value.postal,
                  },
                },
                optional_benefits:
                  renewalQuote?.renewal_info?.optional_benefits ?? [],
                policy_optional_benefits:
                  data.data.renewal_info?.policy_optional_benefits ?? [],
              },
              selected_add_on_optional_benefits: selectedAddons,
            }),
          );

          router.push(ROUTES.RENEWAL.RENEWAL_REVIEW);
        },
        onError: (err) => {
          console.error('Failed to update renewal', err);
        },
      },
    );
  };

  const gst = parseFloat(String(renewal?.renewalgst ?? 0));
  const subtotal = parseFloat(String(renewal?.renewalpremb4gst ?? 0));
  const planFee = parseFloat(String(renewal?.renewalplanprem ?? 0));

  const includedAddonsFee = renewal?.optional_benefits ?? [];
  const addonsIncludedTotal = includedAddonsFee.reduce((sum, addon) => {
    return sum + Number(addon.prem ?? 0);
  }, 0);

  const selectedAddonsFee = selectedAddons ?? [];
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

  const gstAmount = subtotalFeeAfter * GST_RATE;
  const total = subtotalFeeAfter + gstAmount;

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
            selectedAddons={selectedAddons}
            setSelectedAddons={setSelectedAddons}
            initialValues={initialValues}
            renewalQuote={renewalQuote}
            policy={policy}
            renewal={renewal}
            onSubmit={handleNext}
            ref={formRef}
          />
        </div>
      </div>
      <div className='mt-32 w-full border border-[#F7F7F9] bg-[#FFFEFF] md:mt-10'>
        <PricingSummaryRenewal
          textButton='Next'
          textButtonLeft='Back'
          onClickButtonLeft={handleBackRenewalNotice}
          onClick={() => formRef.current?.submit()}
          isPolicyRenewalScreen={true}
          setIsShowPopupPremium={setIsShowPopupPremium}
          total={total}
          loading={isPending}
        />
      </div>
      <ModalPremiumRenewal
        selectedAddons={selectedAddons}
        isShowPopupPremium={isShowPopupPremium}
        setIsShowPopupPremium={setIsShowPopupPremium}
        subtotalFeeAfter={subtotalFeeAfter}
        renewalQuote={renewalQuote}
        gst={gst}
        subtotal={subtotal}
        total={total}
      />
    </>
  );
};

export default RenewalDetail;
