'use client';

import React from 'react';

import { PolicyDetails, RenewalInfo } from '@/libs/types/renewalQuote';
import {
  formatToDDMMYYYY,
  getCoverageDuration,
  parseCompactDate,
  parseDMYToDate,
} from '@/libs/utils/date-utils';
import dayjs from '@/libs/utils/dayjs';
import { capitalizeWords, formatCurrency } from '@/libs/utils/utils';

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
  MaritalCode,
} from '@/app/motor/insurance/basic-detail/options';
import InfoCard from '@/app/renewal/components/InfoCard';
import { GST_RATE } from '@/constants/general.constant';

interface RenewalReviewFormProps {
  renewalContent?: {
    renewal_notice?: string;
    declaration_acknowledgement?: string;
    declaration_declarations?: string;
    declarations_important_notice?: string;
  };
  policy?: PolicyDetails;
  renewal?: RenewalInfo;
}

const RenewalReviewForm = ({
  renewalContent,
  policy,
  renewal,
}: RenewalReviewFormProps) => {
  const PolicyDetailsContent = () => {
    const fields = [
      { label: 'Existing Policy No.', value: policy?.current_policy_no },
      { label: 'Plan Type', value: policy?.coverage },
      {
        label: 'Current Expiry Date',
        value: policy?.current_policy_expiry_date
          ? formatToDDMMYYYY(policy.current_policy_expiry_date)
          : '-',
      },
      {
        label: 'Renewal Notice Dated on',
        value: renewal?.date_extracted
          ? formatToDDMMYYYY(renewal.date_extracted)
          : '-',
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
    const startDate = renewal?.renewal_start_date
      ? formatToDDMMYYYY(renewal.renewal_start_date)
      : 'N/A';

    const endDate = renewal?.renewal_end_date
      ? formatToDDMMYYYY(renewal.renewal_end_date)
      : 'N/A';

    // Calculate duration
    const coverageDuration =
      renewal?.renewal_start_date && renewal?.renewal_end_date
        ? getCoverageDuration(
            dayjs(parseDMYToDate(renewal.renewal_start_date)),
            dayjs(parseDMYToDate(renewal.renewal_end_date)),
          )
        : 'N/A';

    const fields = [
      { label: 'Renewal Start Date', value: startDate },
      { label: 'Renewal Expiry Date', value: endDate },
      { label: 'Coverage Duration', value: coverageDuration },
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
          {
            label: 'Date of Birth',
            value: insured?.dob ? parseCompactDate(insured.dob) : '-',
          },
          {
            label: 'Gender',
            value: insured?.gender === 'M' ? 'Male' : 'Female',
          },
          {
            label: 'Marital Status',
            value: MARITAL_STATUS_MAP[
              insured?.marital_status as keyof typeof MARITAL_STATUS_MAP
            ]
              ? (MARITAL_STATUS_OPTIONS.find(
                  (opt) =>
                    opt.value ===
                    MARITAL_STATUS_MAP[
                      insured?.marital_status as keyof typeof MARITAL_STATUS_MAP
                    ],
                )?.text ?? 'N/A')
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
    const drivers = policy?.named_drivers.map((d, idx) => {
      const maritalCode =
        (d.martial_status?.toUpperCase() as MaritalCode) || undefined;
      const mappedValue = maritalCode
        ? MARITAL_STATUS_MAP[maritalCode]
        : undefined;

      const maritalStatusText = mappedValue
        ? MARITAL_STATUS_OPTIONS.find((opt: any) => opt.value === mappedValue)
            ?.text || '-'
        : '-';

      return {
        name: d.name,
        badge: idx === 0 ? 'Included' : 'SGD 60.00',
        details: [
          { label: 'NRIC', value: d.icno || '-' },
          { label: 'Date of Birth', value: d.dob || '-' },
          { label: 'Gender', value: d.gender === 'M' ? 'Male' : 'Female' },
          { label: 'Marital Status', value: maritalStatusText },
          { label: 'Driving Experience', value: d.driv_exp || '-' },
        ],
      };
    });

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
    return (
      <div className='space-y-4'>
        {/* Plan */}
        <div className='text-base font-semibold'>Plan</div>
        <div className='flex items-center justify-between text-sm font-normal'>
          <span>{capitalizeWords(policy?.coverage)}</span>
          <span>{formatCurrency(Number(renewal?.renewalplanprem))}</span>
        </div>

        {/* Add-ons */}
        <div>
          {renewal?.policy_optional_benefits?.length ? (
            <>
              <p className='mb-2 text-base font-semibold'>Add-ons</p>
              {renewal.policy_optional_benefits
                .filter((item) => item.isIncluded)
                .map((item) => (
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
                    <span className='text-sm'>
                      {formatCurrency(Number(item.prem ?? 0))}
                    </span>
                  </div>
                ))}

              {renewal.policy_optional_benefits
                .filter((item) => !item.isIncluded)
                .map((item) => (
                  <div
                    key={item.id}
                    className='mb-1 flex justify-between space-y-2'
                  >
                    <span className='text-sm'>{item.name}</span>
                    <span className='text-sm'>
                      {formatCurrency(Number(item.prem ?? 0))}
                    </span>
                  </div>
                ))}
            </>
          ) : null}
        </div>

        {/* Named Drivers */}
        {policy?.named_drivers?.length ? (
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
        ) : null}

        {/* Total */}
        <div className='space-y-1 border-t pt-3'>
          <div className='flex justify-between'>
            <span className='text-base font-semibold'>Subtotal</span>
            <span className='font-bold'>
              {formatCurrency(Number(renewal?.renewalpremb4gst))}
            </span>
          </div>
          <div className='flex justify-between pb-3 text-sm'>
            <span>GST (9%)</span>
            <span className='font-medium'>
              {formatCurrency(Number(renewal?.renewalgst))}
            </span>
          </div>
          <div className='flex justify-between border-t pt-3 text-lg font-bold'>
            <span>Net Premium (Total)</span>
            <span className='text-blue-600'>
              {formatCurrency(Number(renewal?.renewalpremwgst))}
            </span>
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
  const namedDrivers = policy?.named_drivers ?? [];

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

      {namedDrivers.length > 0 && (
        <InfoCard
          icon={<PolicyHolderIcon className='text-sky-500' size={20} />}
          title='Additional Named Drivers'
          subtitle={`${namedDrivers.length} additional driver${
            namedDrivers.length > 1 ? 's' : ''
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
