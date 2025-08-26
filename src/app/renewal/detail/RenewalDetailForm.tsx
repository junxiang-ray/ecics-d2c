'use client';

import { Form } from 'antd';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  ExcessIcon,
  PlusSmallIcon,
  PolicyDetailsIcon,
  PolicyHolderIcon,
  PrivateMotorCarIcon,
  ReloadIcon,
  RenewalPeriodIcon,
} from '@/components/icons/renewal-icons';
import { DatePickerField } from '@/components/ui/form/datepicker';

import InfoCard from '@/app/renewal/components/InfoCard';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MAID_QUOTE } from '@/constants';
import { finValidator } from '@/libs/utils/validation-utils';
import { passportRegex } from '@/constants/validation.constant';
import { HasHelperValue } from '@/app/motor/insurance/basic-detail/options';
import { VALUE_OPTION_COMPANY } from '@/constants/general.constant';
import { InputField } from '@/components/ui/form/inputfield';

interface Driver {
  name: string;
  badge: string;
  details: {
    label: string;
    value: string;
  }[];
}

const PolicyDetailsContent = () => {
  const fields = [
    { label: 'Existing Policy No.', value: 'MPC24B0087900' },
    { label: 'Plan Type', value: 'Comprehensive - Family NCD Builder' },
    { label: 'Current Expiry Date', value: '22/05/2025' },
    { label: 'Renewal Notice Dated on', value: '20/06/2025' },
    { label: 'Sum Insured', value: 'Market Value at the time of loss' },
    { label: 'Scheme', value: 'Authorized Workshop' },
    { label: 'Intermediary Name', value: 'AIG Insurance Singapore Pte Ltd' },
  ];

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {fields.map((field, idx) => (
          <div key={idx} className='flex flex-col'>
            <label className='mb-1 text-xs font-medium text-gray-700'>
              {field.label}
            </label>
            <input
              type='text'
              value={field.value}
              disabled
              className='cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const RenewalPeriodContent = ({
  errors,
  handleChangeRenewalStartDate,
}: {
  errors: any;
  handleChangeRenewalStartDate: (value: any) => void;
}) => {
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <Form.Item
          name='renewal_start_date'
          validateStatus={errors?.renewal_start_date ? 'error' : ''}
          help={errors?.renewal_start_date?.message}
        >
          <DatePickerField
            name='renewal_start_date'
            label='Renewal Start Date'
            disabled
            onChange={handleChangeRenewalStartDate}
          />
        </Form.Item>

        <Form.Item
          name='renewal_expiry_date'
          validateStatus={errors?.renewal_expiry_date ? 'error' : ''}
          help={errors?.renewal_expiry_date?.message}
        >
          <DatePickerField
            name='renewal_expiry_date'
            label='Renewal Expiry Date'
            isRequired
          />
        </Form.Item>

        {/* Coverage Duration (readonly) */}
        <div className='col-span-full flex flex-col'>
          <div className='mb-2 flex items-center justify-between'>
            <label className='mb-1 text-xs font-medium text-gray-700'>
              Coverage Duration
            </label>
            <div className='ml-2 flex cursor-pointer items-center rounded-lg border border-[#02ADEF] bg-[#EFF6FF] px-2 py-2 text-xs font-normal text-[#02ADEF]'>
              <ReloadIcon size={14} className='mr-1' /> Reset to 1 Year
            </div>
          </div>
          <input
            type='text'
            value='1 year'
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

const ExcessContent = () => {
  const policyExcess = [
    { label: 'Windscreen', value: 'Refer to schedule' },
    { label: 'Insured/Named Driver', value: 'SGD 600' },
  ];

  const additionalExcess = [
    { label: 'Unnamed Drivers', value: 'SGD 500' },
    {
      label: 'Age < 26 Years old or driving experience < 2 years',
      value: 'SGD 3,000',
    },
  ];

  const renderFields = (fields: { label: string; value: string }[]) =>
    fields.map((field, idx) => (
      <div key={idx} className='flex flex-col'>
        <label className='mb-1 text-xs font-medium text-gray-700'>
          {field.label}
        </label>
        <input
          type='text'
          value={field.value}
          disabled
          className='cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700'
        />
      </div>
    ));

  return (
    <div className='space-y-6'>
      <div>
        <div className='mb-3 text-[14px] font-semibold'>Policy Excess</div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {renderFields(policyExcess)}
        </div>
      </div>
      <div>
        <div className='mb-3 text-[14px] font-semibold'>Additional Excess</div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {renderFields(additionalExcess)}
        </div>
      </div>
    </div>
  );
};

const VehicleDetailsContent = () => {
  const sections = [
    {
      title: 'Vehicle Information',
      fields: [
        { label: 'Vehicle Registration No.', value: 'SJK1234A' },
        { label: 'Vehicle Make', value: 'Toyota' },
        { label: 'Vehicle Model', value: 'Camry' },
        { label: 'First Registered Year', value: '2020' },
        { label: 'Hire Purchase Company', value: 'OCBC Bank' },
      ],
    },
    {
      title: 'Claims and NCD',
      fields: [
        { label: 'No. of Claims', value: '0' },
        { label: 'Claim Amount', value: 'Not Applicable' },
        { label: 'Current NCD', value: '50%' },
        { label: 'Renewal NCD', value: '50%' },
      ],
    },
  ];

  return (
    <div className='space-y-6'>
      {sections.map(({ title, fields }, idx) => (
        <div key={idx}>
          <div className='mb-3 text-[14px] font-semibold'>{title}</div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {fields.map(({ label, value }, idx) => (
              <div key={idx} className='flex flex-col'>
                <label className='mb-1 text-xs font-medium text-gray-700'>
                  {label}
                </label>
                <input
                  type='text'
                  value={value}
                  disabled
                  className='cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700'
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PolicyHolderContent = () => {
  const sections = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', value: 'John Doe' },
        { label: 'NRIC', value: 'S1234567A' },
        { label: 'Date of Birth', value: '01/01/1985' },
        { label: 'Gender', value: 'Male' },
        { label: 'Marital Status', value: 'Married' },
        { label: 'Driving Experience', value: '15 years' },
      ],
    },
    {
      title: 'Full Address',
      fields: [
        { label: 'Address Line 1', value: '123 Marina Bay Road' },
        { label: 'Address Line 2', value: '#15-08 Oceania Tower' },
        { label: 'Address Line 3', value: 'Marina Bay Financial Centre' },
        { label: 'Postal Code', value: '018983' },
      ],
    },
    {
      title: 'Contact Details',
      fields: [
        { label: 'Email', value: 'john.doe@email.com' },
        { label: 'Phone Number', value: '+65 9123 4567' },
      ],
    },
  ];

  const renderFields = (fields: { label: string; value: string }[]) =>
    fields.map(({ label, value }, idx) => (
      <div key={idx} className='flex flex-col'>
        <label className='mb-1 text-xs font-medium text-gray-700'>
          {label}
        </label>
        <input
          type='text'
          value={value}
          disabled
          className='cursor-not-allowed rounded-md border bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700'
        />
      </div>
    ));

  return (
    <div className='space-y-6'>
      {sections.map(({ title, fields }, idx) => (
        <div key={idx}>
          <div className='mb-3 text-[14px] font-semibold'>{title}</div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {renderFields(fields)}
          </div>
        </div>
      ))}
    </div>
  );
};

const AdditionalNamedDriversContent = () => {
  const drivers: Driver[] = [
    {
      name: 'John Smith',
      badge: 'Included',
      details: [
        { label: 'NRIC', value: 'S1234567A' },
        { label: 'Date of Birth', value: '1990-01-01' },
        { label: 'Gender', value: 'Male' },
        { label: 'Marital Status', value: 'Single' },
        { label: 'Driving Experience', value: '10 years' },
      ],
    },
    {
      name: 'Sarah Johnson',
      badge: 'SGD 60.00',
      details: [
        { label: 'NRIC', value: 'S9876543B' },
        { label: 'Date of Birth', value: '1985-03-15' },
        { label: 'Gender', value: 'Female' },
        { label: 'Marital Status', value: 'Married' },
        { label: 'Driving Experience', value: '15 years' },
      ],
    },
  ];

  return (
    <div className='space-y-4'>
      <div className='rounded-lg border border-[#FFF085] bg-[#E8F0FE] p-4 text-sm'>
        First Driver is included within the plan at no additional cost,
        additional drivers cost SGD 65.40 each
      </div>

      {drivers.map((driver, idx) => (
        <div
          key={idx}
          className='space-y-3 rounded-lg border-[2px] border-gray-200 p-4'
        >
          {/* Header */}
          <div className='flex items-center justify-between font-bold'>
            {driver.name}
            <span
              className={`rounded-xl px-2 py-1 text-xs ${
                driver.badge === 'Included'
                  ? 'bg-green-100 text-green-700'
                  : 'text-[16px] font-normal'
              }`}
            >
              {driver.badge}
            </span>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {driver.details.map((detail, i) => (
              <div key={i}>
                <label className='block text-sm font-medium text-gray-700'>
                  {detail.label}
                </label>
                <input
                  type='text'
                  value={detail.value}
                  disabled
                  className='mt-1 block w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm'
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const AddOnsContent = () => {
  return (
    <div className='space-y-4'>
      {/* Plan */}
      <div className='text-base font-semibold'>Plan</div>
      <div className='flex items-center justify-between text-sm font-normal'>
        <span>Comprehensive - Family NCD Builder</span>
        <span>SGD 876.51</span>
      </div>

      {/* Add-ons */}
      <div>
        <p className='mb-2 text-base font-semibold'>Add-ons</p>
        {[
          'Loss of Use',
          '24/7 Roadside Assistance',
          'Key Replacement Cover',
          'Child Seat Cover',
        ].map((item) => (
          <div key={item} className='mb-1 flex justify-between space-y-2'>
            <span className='text-sm'>
              {item}{' '}
              <span className='rounded-xl bg-green-100 px-2 py-1 text-xs text-green-700'>
                Included
              </span>
            </span>
            <span className='text-sm'>SGD 0.00</span>
          </div>
        ))}
      </div>

      {/* Named Drivers */}
      <div>
        <p className='mb-2 text-base font-semibold'>Named Drivers</p>
        {[
          { name: 'John Smith', price: 'SGD 0.00' },
          { name: 'Sarah Johnson', price: 'SGD 60.00' },
        ].map((driver) => (
          <div
            key={driver.name}
            className='mb-1 flex justify-between space-y-2'
          >
            <span className='text-sm'>
              {driver.name}{' '}
              <span className='rounded-xl bg-green-100 px-2 py-1 text-xs text-green-700'>
                Included
              </span>
            </span>
            <span className='text-sm'>{driver.price}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className='space-y-1 border-t pt-3'>
        <div className='flex justify-between'>
          <span className='text-base font-semibold'>Subtotal</span>
          <span className='font-bold'>SGD 936.51</span>
        </div>
        <div className='flex justify-between pb-3 text-sm'>
          <span>GST (9%)</span>
          <span className='font-medium'>SGD 84.29</span>
        </div>
        <div className='flex justify-between border-t pt-3 text-lg font-bold'>
          <span>Net Premium (Total)</span>
          <span className='text-blue-600'>SGD 1020.80</span>
        </div>
      </div>
    </div>
  );
};

const schema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name is required',
    })
    .min(3, 'Name must be at least 3 characters')
    .max(60, 'Name must be at most 60 characters')
    .nonempty('Name is required'),
});

type FormData = z.infer<typeof schema>;

const RenewalDetailForm = () => {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    // values: initFormDate,
  });
  const {
    formState: { errors },
  } = methods;

  const handleChangeRenewalStartDate = (value: any) => {
    console.log('renewal start date changed:', value);
  };

  return (
    <FormProvider {...methods}>
      <Form>
        <div className='mx-auto mt-[12px]'>
          <InfoCard
            icon={<PolicyDetailsIcon className='text-sky-500' size={20} />}
            title='Policy Details'
            subtitle='Your current policy information'
            isPolicyRenewalScreen={true}
          >
            <PolicyDetailsContent />
          </InfoCard>

          <InfoCard
            icon={<RenewalPeriodIcon className='text-sky-500' size={20} />}
            title='Renewal Period'
            subtitle='12-month renewal period (Standard)'
            isPolicyRenewalScreen={true}
          >
            <RenewalPeriodContent
              errors={errors}
              handleChangeRenewalStartDate={handleChangeRenewalStartDate}
            />
          </InfoCard>

          <InfoCard
            icon={<ExcessIcon className='text-sky-500' size={20} />}
            title='Excess'
            subtitle='Excess amounts applicable to your policy'
            isPolicyRenewalScreen={true}
          >
            <ExcessContent />
          </InfoCard>

          <InfoCard
            icon={<PrivateMotorCarIcon className='text-sky-500' size={20} />}
            title='Vehicle Details'
            subtitle='Information about your insured vehicle'
            isPolicyRenewalScreen={true}
          >
            <VehicleDetailsContent />
          </InfoCard>

          <InfoCard
            icon={<PolicyHolderIcon className='text-sky-500' size={20} />}
            title='Policyholder'
            subtitle='Personal information and contact details'
            isPolicyRenewalScreen={true}
          >
            <PolicyHolderContent />
          </InfoCard>

          <InfoCard
            icon={<PolicyHolderIcon className='text-sky-500' size={20} />}
            title='Additional Named Drivers'
            subtitle='2 additional drivers added'
            isPolicyRenewalScreen={true}
          >
            <AdditionalNamedDriversContent />
          </InfoCard>

          <InfoCard
            icon={<PlusSmallIcon className='text-sky-500' size={20} />}
            title='Add-ons'
            subtitle='4/9 add-ons selected'
            isPolicyRenewalScreen={true}
          >
            <AddOnsContent />
          </InfoCard>
        </div>
      </Form>
    </FormProvider>
  );
};

export default RenewalDetailForm;
