import { Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { RenewalQuote } from '@/libs/types/renewalQuote';
import { getCoverageDuration } from '@/libs/utils/date-utils';
import { createPassphrase } from '@/libs/utils/utils';

import { ReloadIcon } from '@/components/icons/renewal-icons';
import { DatePickerField } from '@/components/ui/form/datepicker';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { usePostEditRenewal } from '@/hook/renewal/renewalQuote';
import { updateRenewalQuote } from '@/redux/slices/renewalQuote.slice';
import { useAppDispatch } from '@/redux/store';

const RenewalPeriodContent = ({
  errors,
  renewalStartDate,
  renewalQuote,
}: {
  errors: any;
  renewalStartDate: Dayjs | null;
  renewalQuote: RenewalQuote;
}) => {
  const { setValue, watch } = useFormContext();
  const dispatch = useAppDispatch();
  const { mutate: postEditRenewal } = usePostEditRenewal();

  const startDate = useMemo(
    () =>
      renewalStartDate && renewalStartDate.isValid() ? renewalStartDate : null,
    [renewalStartDate],
  );

  const expiryDate = watch('renewal_expiry_date')
    ? dayjs(watch('renewal_expiry_date'))
    : null;

  const handleExpiryChange = (value: Dayjs | null) => {
    if (!value) return;
    setValue('renewal_expiry_date', value.toDate());

    const policyId = renewalQuote?.policy_id ?? '';
    const proposalId = renewalQuote?.proposal_id ?? '';
    const vehRegNo =
      renewalQuote?.renewal_info?.policy_details?.vehicle_details?.reg_no ?? '';
    const nric = renewalQuote?.renewal_info?.insured_info?.nric || '';
    const dob = renewalQuote?.renewal_info?.insured_info?.dob || '';

    const passphrase = createPassphrase(dob, nric);

    const renewalEndDate = value ? value.format('DD-MM-YYYY') : '';
    const payload = {
      policy_id: policyId,
      proposal_id: proposalId,
      veh_reg_no: vehRegNo,
      passphrase,
      renewal_end_date: renewalEndDate,
      email_address: '',
      contact_no: '',
      selected_add_on_optional_benefits: [],
      finalize_renewal: false,
    };

    const productType = PRODUCT_NAME.MOTOR;

    postEditRenewal(
      { productType, payload },
      {
        onSuccess: (data) => {
          dispatch(
            updateRenewalQuote({
              ...renewalQuote,
              add_on_optional_benefits: data.data.add_on_optional_benefits,
            }),
          );
        },
        onError: (err) => {
          console.error('Failed to update renewal', err);
        },
      },
    );
  };

  const handleReset = () => {
    if (!startDate) return;
    const newDate = startDate.add(1, 'year').subtract(1, 'day');
    setValue('renewal_expiry_date', newDate.toDate());
  };

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Form.Item
          name='renewal_start_date'
          validateStatus={errors?.renewal_start_date ? 'error' : ''}
        >
          <DatePickerField
            name='renewal_start_date'
            label='Renewal Start Date'
            disabled
            isRenewalFlow={true}
          />
        </Form.Item>
        <Form.Item
          name='renewal_expiry_date'
          validateStatus={errors?.renewal_expiry_date ? 'error' : ''}
        >
          <DatePickerField
            name='renewal_expiry_date'
            label='Renewal Expiry Date'
            isRequired
            isRenewalFlow={true}
            onChange={handleExpiryChange}
            disabledDate={(current: Dayjs) => {
              if (!startDate) return true;
              return (
                current < startDate.add(1, 'year').subtract(1, 'day') ||
                current > startDate.add(18, 'month').subtract(1, 'day')
              );
            }}
          />
        </Form.Item>

        {/* Coverage Duration */}
        <div className='col-span-full flex flex-col'>
          <div className='mb-1 flex items-center justify-between'>
            <label className='text-xs font-medium text-gray-700'>
              Coverage Duration
            </label>
            <div
              className='ml-2 flex cursor-pointer items-center rounded-lg border border-[#02ADEF] bg-[#EFF6FF] px-2 py-2 text-xs font-normal text-[#02ADEF]'
              onClick={handleReset}
            >
              <ReloadIcon size={14} className='mr-1' /> Reset to 1 Year
            </div>
          </div>

          <input
            type='text'
            value={
              startDate && expiryDate
                ? getCoverageDuration(startDate, expiryDate)
                : ''
            }
            disabled
            className='mt-1 cursor-not-allowed rounded-md border border-[#BEDBFF] bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-gray-700'
          />

          <div className='text-[10px] font-normal'>
            Duration is calculated from renewal start date to expiry date. Use
            the reset button to quickly set coverage to exactly one year.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalPeriodContent;
