import { Form } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';

import { ReloadIcon } from '@/components/icons/renewal-icons';
import { DatePickerField } from '@/components/ui/form/datepicker';

const RenewalPeriodContent = ({
  errors,
  renewalStartDate,
}: {
  errors: any;
  renewalStartDate: Dayjs | null;
}) => {
  const startDate = useMemo(() => dayjs(renewalStartDate), [renewalStartDate]);

  const [expiryDate, setExpiryDate] = useState<Dayjs>(startDate.add(1, 'year'));

  // When start date changes -> reset expiry date = +1 year
  useEffect(() => {
    setExpiryDate(startDate.add(1, 'year'));
  }, [startDate]);

  // Coverage Duration
  const getCoverageDuration = () => {
    const years = expiryDate.diff(startDate, 'year');
    const months = expiryDate.diff(startDate.add(years, 'year'), 'month');
    const days = expiryDate.diff(
      startDate.add(years, 'year').add(months, 'month'),
      'day',
    );

    if (years && !months && !days)
      return `${years} year${years > 1 ? 's' : ''}`;
    if (years || months || days) {
      return [
        years ? `${years}y` : '',
        months ? `${months}m` : '',
        days ? `${days}d` : '',
      ]
        .filter(Boolean)
        .join(' ');
    }
    return '0 day';
  };

  const handleExpiryChange = (value: Dayjs | null) => {
    if (!value) return;
    setExpiryDate(value);
  };

  const handleReset = () => {
    setExpiryDate(startDate.add(1, 'year'));
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
            disabledDate={(current: Dayjs) =>
              current < startDate.add(1, 'year') ||
              current > startDate.add(2, 'year')
            }
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
            value={getCoverageDuration()}
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
