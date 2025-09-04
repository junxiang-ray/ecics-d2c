'use client';

import dayjs from 'dayjs';
import React from 'react';

import { formatToDDMMYYYY, parseCompactDate } from '@/libs/utils/date-utils';
import { capitalizeWords } from '@/libs/utils/utils';

import CheckCircle from '@/components/icons/CheckCircle';
import {
  ExcessIcon,
  PolicyDetailsIcon,
  PolicyHolderIcon,
  PremiumSummaryIcon,
  PrivateMotorCarIcon,
  RenewalPeriodIcon,
} from '@/components/icons/renewal-icons';
import WarningTriangleIcon from '@/components/icons/WarningTriangleIcon';

import {
  MARITAL_STATUS_MAP,
  MARITAL_STATUS_OPTIONS,
} from '@/app/motor/insurance/basic-detail/options';
import InfoCard from '@/app/renewal/components/InfoCard';
import { useAppSelector } from '@/redux/store';

interface RenewalReviewFormProps {
  renewalContent?: {
    renewal_notice?: string;
    declaration_acknowledgement?: string;
    declaration_declarations?: string;
    declarations_important_notice?: string;
  };
}

const RenewalReviewForm = ({ renewalContent }: RenewalReviewFormProps) => {
  const renewalQuote = useAppSelector(
    (state) => state.renewalQuote?.renewalQuote,
  );
  const policy = renewalQuote?.renewal_info?.policy_details;
  const renewal = renewalQuote?.renewal_info;

  const PolicyDetailsContent = () => {
    const fields = [
      { label: 'Existing Policy No.', value: policy?.current_policy_no },
      { label: 'Plan Type', value: policy?.coverage },
      {
        label: 'Current Expiry Date',
        value: formatToDDMMYYYY(policy?.current_policy_expiry_date),
      },
      {
        label: 'Renewal Notice Dated on',
        value: formatToDDMMYYYY(renewal?.date_extracted),
      },
      { label: 'Sum Insured', value: policy?.sum_insured },
      { label: 'Scheme', value: renewal?.scheme },
      { label: 'Intermediary Name', value: policy?.agency },
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
    const startDate = formatToDDMMYYYY(renewal?.renewal_start_date);
    const endDate = formatToDDMMYYYY(renewal?.renewal_end_date);

    // Calculate duration
    const durationInYears = dayjs(renewal?.renewal_end_date, 'DD-MM-YYYY').diff(
      dayjs(renewal?.renewal_start_date, 'DD-MM-YYYY'),
      'year',
    );

    const fields = [
      { label: 'Renewal Start Date', value: startDate },
      { label: 'Renewal Expiry Date', value: endDate },
      {
        label: 'Coverage Duration',
        value: durationInYears > 1 ? `${durationInYears} years` : '1 year',
      },
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
    const policyExcess =
      renewal?.renewal_excess?.policy_excess?.map((item) => ({
        label: item.title,
        value: item.value,
      })) ?? [];

    const additionalExcess =
      renewal?.renewal_excess?.additional_excess?.map((item) => ({
        label: item.title,
        value: item.value,
      })) ?? [];

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
        {policyExcess.length > 0 && (
          <div>
            <div className='mb-3 text-[14px] font-semibold'>Policy Excess</div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {renderFields(policyExcess)}
            </div>
          </div>
        )}

        {additionalExcess.length > 0 && (
          <div>
            <div className='mb-3 text-[14px] font-semibold'>
              Additional Excess
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {renderFields(additionalExcess)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const VehicleDetailsContent = () => {
    const sections = [
      {
        title: 'Vehicle Information',
        fields: [
          {
            label: 'Vehicle Registration No.',
            value: policy?.vehicle_details.reg_no,
          },
          { label: 'Vehicle Make', value: policy?.vehicle_details.make },
          { label: 'Vehicle Model', value: policy?.vehicle_details.model },
          { label: 'Model Type', value: policy?.vehicle_details.model_type },
          {
            label: 'First Registered Year',
            value: policy?.vehicle_details.first_reg_on,
          },
          {
            label: 'Hire Purchase Company',
            value: policy?.vehicle_details.hire_purchase,
          },
        ],
      },
      {
        title: 'Claims and NCD',
        fields: [
          {
            label: 'No. of Claims',
            value: policy?.claim_ncd_details.no_of_claims,
          },
          {
            label: 'Claim Amount',
            value: policy?.claim_ncd_details.claim_incurred,
          },
          {
            label: 'Current NCD',
            value: policy?.claim_ncd_details.current_ncd,
          },
          {
            label: 'Renewal NCD',
            value: policy?.claim_ncd_details.renewal_ncd,
          },
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
                    value={value || '-'}
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
    const insured = renewal?.insured_info;

    const sections = [
      {
        title: 'Personal Information',
        fields: [
          { label: 'Full Name', value: insured?.name },
          { label: 'NRIC', value: insured?.nric },
          { label: 'Date of Birth', value: parseCompactDate(insured?.dob) },
          {
            label: 'Gender',
            value: insured?.gender === 'M' ? 'Male' : 'Female',
          },
          {
            label: 'Marital Status',
            value: MARITAL_STATUS_MAP[insured?.marital_status]
              ? MARITAL_STATUS_OPTIONS.find(
                  (opt) =>
                    opt.value === MARITAL_STATUS_MAP[insured?.marital_status],
                )?.text
              : 'N/A',
          },
          { label: 'Driving Experience', value: insured?.driv_exp },
        ],
      },
      {
        title: 'Full Address',
        fields: [
          { label: 'Address Line 1', value: insured?.address.address_line1 },
          { label: 'Address Line 2', value: insured?.address.address_line2 },
          { label: 'Address Line 3', value: insured?.address.address_line3 },
          { label: 'Postal Code', value: insured?.address.postal },
        ],
      },
      {
        title: 'Contact Details',
        fields: [
          { label: 'Email', value: insured?.email },
          { label: 'Phone Number', value: insured?.contact_no },
        ],
      },
    ];

    const renderFields = (
      fields: { label: string; value: string | undefined }[],
    ) =>
      fields.map(({ label, value }, idx) => (
        <div key={idx} className='flex flex-col'>
          <label className='mb-1 text-xs font-medium text-gray-700'>
            {label}
          </label>
          <input
            type='text'
            value={value ?? '-'}
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
    const drivers = policy?.named_drivers.map((d, idx) => ({
      name: d.name,
      badge: idx === 0 ? 'Included' : 'SGD 65.40',
      details: [
        { label: 'NRIC', value: d.icno || '-' },
        { label: 'Date of Birth', value: d.dob || '-' },
        { label: 'Gender', value: d.gender === 'M' ? 'Male' : 'Female' },
        { label: 'Marital Status', value: d.martial_status || '-' },
        { label: 'Driving Experience', value: d.driv_exp || '-' },
      ],
    }));

    return (
      <div className='space-y-4'>
        <div className='rounded-lg border border-[#FFF085] bg-[#E8F0FE] p-4 text-sm'>
          First Driver is included within the plan at no additional cost,
          additional drivers cost SGD 65.40 each
        </div>

        {drivers?.map((driver, idx) => (
          <div
            key={idx}
            className='space-y-3 rounded-lg border-[2px] border-gray-200 p-4'
          >
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
                  <label className='block text-xs font-medium text-gray-700'>
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
    const subtotal = parseFloat(String(renewal?.renewalpremwgst ?? 0));
    const gst = parseFloat(String(renewal?.renewalgst ?? 0));
    const total = (subtotal + gst).toFixed(2);

    return (
      <div className='space-y-4'>
        {/* Plan */}
        <div className='text-base font-semibold'>Plan</div>
        <div className='flex items-center justify-between text-sm font-normal'>
          <span>{capitalizeWords(policy?.coverage)}</span>
          <span>SGD {renewal?.renewalpremb4gst}</span>
        </div>

        {/* Add-ons */}
        <div>
          <p className='mb-2 text-base font-semibold'>Add-ons</p>
          {renewal?.optional_benefits?.length > 0 ? (
            renewal.optional_benefits.map((item) => (
              <div
                key={item.id}
                className='mb-1 flex justify-between space-y-2'
              >
                <span className='text-sm'>
                  {item.name}{' '}
                  <span className='rounded-xl bg-green-100 px-2 py-1 text-xs text-green-700'>
                    Included
                  </span>
                </span>
                <span className='text-sm'>SGD 0.00</span>
              </div>
            ))
          ) : (
            <p className='text-sm text-gray-500'>No add-ons selected</p>
          )}
        </div>

        {/* Named Drivers */}
        {policy?.named_drivers?.length > 0 && (
          <div>
            <p className='mb-2 text-base font-semibold'>Named Drivers</p>
            {policy.named_drivers.map((driver, index) => (
              <div key={index} className='mb-1 flex justify-between space-y-2'>
                <span className='text-sm'>
                  {driver.name}{' '}
                  {index === 0 && (
                    <span className='rounded-xl bg-green-100 px-2 py-1 text-xs text-green-700'>
                      Included
                    </span>
                  )}
                </span>
                <span className='text-sm'>
                  {index === 0 ? 'SGD 0.00' : 'SGD 60.00'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className='space-y-1 border-t pt-3'>
          <div className='flex justify-between'>
            <span className='text-base font-semibold'>Subtotal</span>
            <span className='font-bold'>SGD {renewal?.renewalpremwgst}</span>
          </div>
          <div className='flex justify-between pb-3 text-sm'>
            <span>GST (9%)</span>
            <span className='font-medium'>SGD {renewal?.renewalgst}</span>
          </div>
          <div className='flex justify-between border-t pt-3 text-lg font-bold'>
            <span>Net Premium (Total)</span>
            <span className='text-blue-600'>SGD {total}</span>
          </div>
        </div>
      </div>
    );
  };

  const DeclarationContent = ({ renewalContent }: RenewalReviewFormProps) => {
    const parseList = (html: string, type: 'ul' | 'ol') => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const items = Array.from(doc.querySelectorAll('li'));
      return items.map((item, idx) =>
        type === 'ul' ? (
          <li key={idx} className='flex items-start gap-2'>
            <CheckCircle className='mt-0.5 text-green-500' size={16} />
            {item.textContent}
          </li>
        ) : (
          <li key={idx}>{item.textContent}</li>
        ),
      );
    };

    return (
      <div className='space-y-4'>
        {/* Acknowledgement */}
        {renewalContent?.declaration_acknowledgement && (
          <div className='rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-justify text-sm text-blue-800'>
            {renewalContent.declaration_acknowledgement}
          </div>
        )}
        {/* Declarations */}
        {renewalContent?.declaration_declarations && (
          <ul className='space-y-2 text-justify text-sm'>
            {parseList(renewalContent.declaration_declarations, 'ul')}
          </ul>
        )}
        {/* Important Notice */}
        {renewalContent?.declarations_important_notice && (
          <div className='rounded-lg border border-[#FFF085] bg-[#E8F0FE] p-4 text-sm'>
            <div className='mb-2 flex items-center text-[16px] font-semibold text-yellow-700'>
              <WarningTriangleIcon className='mr-1' size={16} /> IMPORTANT
              NOTICE
            </div>
            <ol className='list-inside list-decimal space-y-2 text-justify text-[#894B00]'>
              {parseList(renewalContent.declarations_important_notice, 'ol')}
            </ol>
          </div>
        )}
      </div>
    );
  };

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
        icon={<PrivateMotorCarIcon className='text-sky-500' size={20} />}
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

      {policy?.named_drivers.length > 0 && (
        <InfoCard
          icon={<PolicyHolderIcon className='text-sky-500' size={20} />}
          title='Additional Named Drivers'
          subtitle={`${policy.named_drivers.length} additional driver${
            policy.named_drivers.length > 1 ? 's' : ''
          } added`}
        >
          <AdditionalNamedDriversContent />
        </InfoCard>
      )}

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
        <DeclarationContent renewalContent={renewalContent} />
      </InfoCard>
    </div>
  );
};

export default RenewalReviewForm;
