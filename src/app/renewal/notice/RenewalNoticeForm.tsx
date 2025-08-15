'use client';

import React from 'react';

import CheckCircle from '@/components/icons/CheckCircle';
import {
  ExcessIcon,
  PolicyDetailsIcon,
  PolicyHolderIcon,
  PremiumSummaryIcon,
  RenewalPeriodIcon,
  VehicleDetailsIcon,
} from '@/components/icons/renewal-icons';
import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';

import InfoCard from '@/app/renewal/components/InfoCard';

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

const RenewalPeriodContent = () => {
  const fields = [
    { label: 'Renewal Start Date', value: '23/05/2025' },
    { label: 'Renewal Expiry Date', value: '22/05/2026' },
    { label: 'Coverage Duration', value: '1 year' },
  ];

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {fields.map((field, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${field.label === 'Coverage Duration' ? 'col-span-full' : ''}`}
          >
            <label className='mb-1 text-xs font-medium text-gray-700'>
              {field.label}
            </label>
            <input
              type='text'
              value={field.value}
              disabled
              className={`cursor-not-allowed rounded-md border px-3 py-2 text-sm font-semibold text-gray-700 
                                ${
                                  field.label === 'Coverage Duration'
                                    ? 'border-[#BEDBFF] bg-[#EFF6FF]'
                                    : 'border-gray-300 bg-gray-100'
                                }`}
            />
          </div>
        ))}
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

const PremiumSummaryContent = () => {
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

const DeclarationContent = () => {
  return (
    <div className='space-y-4'>
      <div className='rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-justify text-sm text-blue-800'>
        By proceeding with this renewal, you acknowledge that you have read and
        understood all policy terms and conditions, and that all information
        provided is accurate and complete.
      </div>
      <ul className='space-y-2 text-justify text-sm'>
        <li className='flex items-start gap-2'>
          <CheckCircle className='mt-0.5 text-green-500' size={16} />I confirm
          that all information provided is true and accurate to the best of my
          knowledge.
        </li>
        <li className='flex items-start gap-2'>
          <CheckCircle className='mt-0.5 text-green-500' size={16} />I
          understand that providing false or misleading information may void my
          policy.
        </li>
        <li className='flex items-start gap-2'>
          <CheckCircle className='mt-0.5 text-green-500' size={16} />I agree to
          the policy terms and conditions as outlined in the policy document.
        </li>
      </ul>
      <div className='rounded-lg border border-[#FFF085] bg-[#E8F0FE] p-4 text-sm'>
        <div className='mb-2 flex items-center text-[16px] font-semibold text-yellow-700'>
          <WarningTriangleIcon className='mr-1' size={16} /> IMPORTANT NOTICE
        </div>
        <ol className='list-inside list-decimal space-y-2 text-justify text-[#894B00]'>
          <li>
            Any amendments/changes to the Policy after issuance of this renewal
            notice are not reflected. We reserve the right to review Policy
            terms in the event of any loss or claims before the expiry date.
          </li>
          <li>
            Please read the Policy terms carefully. Contact us before the expiry
            date for any clarification. You must fully disclose all relevant
            facts that may affect your risk.
          </li>
          <li>
            We reserve the right to revise or withdraw our renewal offer if
            further changes to the risk occur after this quote.
          </li>
        </ol>
      </div>
    </div>
  );
};

const RenewalNoticeForm = () => {
  return (
    <div className='mx-auto mt-[12px]'>
      <InfoCard
        icon={<PolicyDetailsIcon className='text-sky-500' size={20} />}
        title='Policy Details'
        subtitle='Your current policy information'
      >
        <PolicyDetailsContent />
      </InfoCard>

      <InfoCard
        icon={<RenewalPeriodIcon className='text-sky-500' size={20} />}
        title='Renewal Period'
        subtitle='12-month renewal period (Standard)'
      >
        <RenewalPeriodContent />
      </InfoCard>

      <InfoCard
        icon={<ExcessIcon className='text-sky-500' size={20} />}
        title='Excess'
        subtitle='Excess amounts applicable to your policy'
      >
        <ExcessContent />
      </InfoCard>

      <InfoCard
        icon={<VehicleDetailsIcon className='text-sky-500' size={20} />}
        title='Vehicle Details'
        subtitle='Information about your insured vehicle'
      >
        <VehicleDetailsContent />
      </InfoCard>

      <InfoCard
        icon={<PolicyHolderIcon className='text-sky-500' size={20} />}
        title='Policyholder'
        subtitle='Personal information and contact details'
      >
        <PolicyHolderContent />
      </InfoCard>

      <InfoCard
        icon={<PolicyHolderIcon className='text-sky-500' size={20} />}
        title='Additional Named Drivers'
        subtitle='2 additional drivers added'
      >
        <AdditionalNamedDriversContent />
      </InfoCard>

      <InfoCard
        icon={<PremiumSummaryIcon className='text-sky-500' size={20} />}
        title='Premium Summary'
        subtitle='Your renewal premium breakdown'
      >
        <PremiumSummaryContent />
      </InfoCard>

      <InfoCard
        icon={<CheckCircle className='text-sky-500' size={20} />}
        title='Declaration'
        subtitle='Policy terms and conditions acknowledgment'
      >
        <DeclarationContent />
      </InfoCard>
    </div>
  );
};

export default RenewalNoticeForm;
