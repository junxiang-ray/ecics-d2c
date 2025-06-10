'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { formatPromoCode, generateKeyAndAttachToUrl } from '@/libs/utils/utils';
import { MAID_QUOTE } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { setPromoCodeError, updateQuote } from '@/redux/slices/quote.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import PolicyDetailForm from './PolicyDetailForm';
import { useGenerateMaidQuote } from '@/hook/insurance/maidQuote';
import { updateMaidQuote } from '@/redux/slices/maidQuote.slice';

interface PolicyDetailProps {
  onSaveRegister: (fn: () => any) => void;
  isSingPassFlow: boolean;
}

export const PolicyDetail = ({
  isSingPassFlow = false,
  onSaveRegister,
}: PolicyDetailProps) => {
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const promo_code = formatPromoCode(searchParams.get('promo_code'));
  const initKey = searchParams.get('key') || '';

  const [key, setKey] = useState(initKey);

  const quoteInfo = useAppSelector((state) => state.maidQuote?.maidQuote);
  const { mutateAsync: generateMaidQuote, isPending } = useGenerateMaidQuote();
  const userInfo = quoteInfo?.data?.personal_info;
  // const maidInfo = quoteInfo.data.maid_info;
  // const insuranceInfo = quoteInfo?.data?.insurance_additional_info;
  // const selectedVehicle = quoteInfo?.data?.vehicle_info_selected;
  // const savedPromoCode = quoteInfo?.promo_code;

  console.log(quoteInfo, 'chinh888');
  // const dateOfBirth = userInfo?.date_of_birth
  //   ? dayjs(userInfo?.date_of_birth, 'DD/MM/YYYY').toDate()
  //   : undefined;
  // const startData = insuranceInfo?.start_date
  //   ? dayjs(insuranceInfo?.start_date, 'DD/MM/YYYY').toDate()
  //   : undefined;
  // const endDate = insuranceInfo?.end_date
  //   ? dayjs(insuranceInfo?.end_date, 'DD/MM/YYYY').toDate()
  //   : undefined;

  const initialValues = {
    // [MAID_QUOTE.promo_code]: savedPromoCode?.code ?? promo_code ?? '',
    // [MAID_QUOTE.start_date]: startData,
    // [MAID_QUOTE.end_date]: endDate,
    // [MAID_QUOTE.owner_ncd]: insuranceInfo?.no_claim_discount ?? undefined,
    // [MAID_QUOTE.owner_no_of_claims]: insuranceInfo?.no_of_claim ?? undefined,

    // [MAID_QUOTE.email]: userInfo?.email ?? '',
    // [MAID_QUOTE.mobile]: userInfo?.phone ?? '',
    // [MAID_QUOTE.owner_dob]: dateOfBirth,
    // [MAID_QUOTE.owner_drv_exp]: userInfo?.driving_experience ?? undefined,

    // [MAID_QUOTE.vehicle_make]: selectedVehicle?.vehicle_make ?? undefined,
    // [MAID_QUOTE.vehicle_model]: selectedVehicle?.vehicle_model ?? undefined,
    // [MAID_QUOTE.reg_yyyy]: selectedVehicle?.first_registered_year ?? undefined,
    // [MAID_QUOTE.hire_purchase]: quoteInfo?.company_id ?? undefined,
    // [MAID_QUOTE.other_hire_purchase]:
    //   quoteInfo?.company_name_other ?? undefined,
    [MAID_QUOTE.email]: userInfo?.email ?? '',
    [MAID_QUOTE.mobile]: userInfo?.phone ?? '',
    // [MAID_QUOTE.maid_type]:
  };

  // Options for Dropdown
  // const hirePurchaseListFormatted: DropdownOption[] = [
  //   ...(Array.isArray(hirePurchaseList)
  //     ? hirePurchaseList.map((item: any) => ({
  //         value: item.id,
  //         text: item.name,
  //       }))
  //     : []),
  // ];

  useEffect(() => {
    const keyQuote = generateKeyAndAttachToUrl(initKey);
    setKey(keyQuote);
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data: any) => {
    dispatch(setPromoCodeError(null));
    let payload: any;
    payload = { ...data, key: key };

    if (isSingPassFlow && userInfo) {
      // data from Singpass
      const personal_info = {
        name: userInfo?.name,
        gender: userInfo?.gender,
        marital_status: userInfo?.marital_status,
        date_of_birth: userInfo?.date_of_birth,
        nric: userInfo?.nric,
        address: userInfo?.address,
        driving_experience: userInfo?.driving_experience,
        phone: userInfo?.phone,
        email: userInfo?.email,
      };

      payload = {
        ...payload,
        personal_info: personal_info,
        // vehicle_info_selected: selectedVehicle,
      };
    }
    console.log(payload, '6666');
    generateMaidQuote(payload)
      .then((res) => {
        console.log(res, 'chinh777');
        if (res) {
          dispatch(updateMaidQuote(res));
          // router.push(ROUTES.INSURANCE_MAID.PLAN);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 422) {
          dispatch(setPromoCodeError(err.response.data));
        } else {
          console.error('Unexpected error:', err);
        }
      });
  };

  return (
    <>
      <div className='mt-4 w-full md:px-0'>
        {/* turn on Day 1.5 */}
        {/* {isSingPassFlow && (
          <>
            <div className='mb-8 hidden items-center justify-between md:flex md:flex-col md:gap-4'>
              <HeaderVehicleInfo
                vehicleInfo={quoteInfo?.data.vehicle_info_selected}
                insuranceAdditionalInfo={
                  quoteInfo?.data.insurance_additional_info
                }
              />
            </div>
            <div className='py-4 md:hidden'>
              <HeaderVehicleInfoMobile
                vehicleInfo={quoteInfo?.data.vehicle_info_selected}
              />
            </div>
          </>
        )} */}
        <PolicyDetailForm
          onSubmit={onSubmit}
          isSingpassFlow={isSingPassFlow}
          isLoading={isPending}
          initialValues={initialValues}
          onSaveRegister={onSaveRegister}
        />
      </div>
    </>
  );
};
