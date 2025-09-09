import { Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { getCoverageDuration } from '@/libs/utils/date-utils';

import { ReloadIcon } from '@/components/icons/renewal-icons';
import { DatePickerField } from '@/components/ui/form/datepicker';

const RenewalPeriodContent = ({
  errors,
  renewalStartDate,
}: {
  errors: any;
  renewalStartDate: Dayjs | null;
}) => {
  const { setValue, watch } = useFormContext();
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
  };

  const handleReset = () => {
    if (!startDate) return;
    const newDate = startDate.add(1, 'year');
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
            onChange={handleExpiryChange}
            disabledDate={(current: Dayjs) => {
              if (!startDate) return true;
              return (
                current < startDate.add(1, 'year') ||
                current > startDate.add(2, 'year')
              );
            }}
          />
        </Form.Item>

        {/* Coverage Duration */}
        <div className='col-span-full flex flex-col'>
          <div className='mb-2 flex items-center justify-between'>
            <label className='mb-1 text-xs font-medium text-gray-700'>
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
            className='cursor-not-allowed rounded-md border border-[#BEDBFF] bg-[#EFF6FF] px-3 py-2 text-sm font-semibold text-gray-700'
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
