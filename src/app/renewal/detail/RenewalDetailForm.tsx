'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { formatToDDMMYYYY } from '@/libs/utils/date-utils';

import {
  ExcessIcon,
  PlusSmallIcon,
  PolicyDetailsIcon,
  PolicyHolderIcon,
  PrivateMotorCarIcon,
  RenewalPeriodIcon,
} from '@/components/icons/renewal-icons';

import {
  MARITAL_STATUS_MAP,
  MARITAL_STATUS_OPTIONS,
} from '@/app/motor/insurance/basic-detail/options';
import InfoCard from '@/app/renewal/components/InfoCard';
import AddOnsContent from '@/app/renewal/detail/card/AddOnsContent';
import ExcessContent from '@/app/renewal/detail/card/ExcessContent';
import PolicyDetailsContent from '@/app/renewal/detail/card/PolicyDetailsContent';
import PolicyHolderContent from '@/app/renewal/detail/card/PolicyHolderContent';
import RenewalPeriodContent from '@/app/renewal/detail/card/RenewalPeriodContent';
import VehicleDetailsContent from '@/app/renewal/detail/card/VehicleDetailsContent';

import AdditionalNamedDriversContent from './card/AdditionalNamedDriversContent';

const renewalQuote = {
  policy_id: 'P000000039828',
  quote_id: 'Q000000039790',
  proposal_id: 'PR000000035292',
  edit_renewal: true,
  renewal_info: {
    policy_details: {
      current_policy_no: 'MPC24A00356201',
      current_policy_expiry_date: '2-10-2025',
      agency: 'INSUXXXXXXXXXXX',
      coverage: 'COMPREHENSIVE',
      sum_insured: 'Market Value at the time of loss',
      vehicle_details: {
        'reg. no.': 'SBU6818J',
        'make/model': 'HONDA FIT 1.3G SKYROOF A',
        make: 'HONDA',
        model: 'Honda Fit 1.3G A',
        'first reg on': '2008',
        hire_purchase: 'NIL',
        'model type': '',
      },
      claim_ncd_details: {
        no_of_claims: '0',
        claim_incurred: 'Not Applicable',
        current_ncd: '50%',
        renewal_ncd: '50%',
      },
      named_drivers: [
        {
          name: 'GIANXXXXXX',
          icno: 'G1234567X',
          dob: '1964-10-03',
          martial_status: 'M',
          driv_exp: '32',
          gender: 'F',
        },
      ],
    },
    renewal_start_date: '28-07-2025',
    renewal_end_date: '27-10-2026',
    // renewal_start_date: "3-10-2025",
    // renewal_end_date: "2-10-2026", #######bug with d-m-yyyy
    insured_info: {
      name: 'A L XXXXXXXXXXXXX',
      nric: 'S7790718A',
      dob: '29031983',
      gender: 'M',
      marital_status: 'M',
      driv_exp: '43',
      address: {
        address_line1: '129 XXXXXXXXXXXXX',
        address_line2: 'SINGXXXXXXXXXXXXX',
        address_line3: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
        postal: '357866',
      },
      email: 'may_lim@ecics.com.sg',
      contact_no: 'XXXXXX',
    },
    date_extracted: '20-8-2025',
    scheme: 'AUTHORISED WORKSHOPS',
    renewal_excess: {
      policy_excess: [
        { title: 'Windscreen', value: 'SGD 100.00' },
        { title: 'Section I - Standard Excess', value: 'SGD 1,000.00' },
      ],
      additional_excess: [
        { title: 'Section I - Unnamed Drivers', value: 'SGD 500.00' },
        {
          title: 'Section I – Young or Inexperienced Drivers Excess',
          value: 'SGD 3,000.00',
        },
      ],
    },
    optional_benefits: [
      {
        id: 1,
        name: 'Loss of Use',
        code: 'OB0010',
        sub_option: 'Transport Allowance',
      },
    ],
    renewalpremb4gst: '700',
    renewalgst: '63',
    renewalpremwgst: '763',
  },
  add_on_optional_benefits: [
    {
      id: 1,
      name: 'Medical Expenses',
      sub_options: [
        { id: 1, name: '[+$200]', prem: '27.25' },
        { id: 2, name: '[+$700]', prem: '54.50' },
        { id: 3, name: '[+$1,700]', prem: '109.00' },
      ],
    },
    {
      id: 2,
      name: 'Key Replacement Cover',
      sub_options: [
        { id: 1, name: '[$300]', prem: '27.25' },
        { id: 2, name: '[$500]', prem: '43.60' },
      ],
    },
    {
      id: 3,
      name: 'Personal Accident+',
      sub_options: [
        { id: 1, name: '[+$30,000]', prem: '32.70' },
        { id: 2, name: '[+$60,000]', prem: '65.40' },
        { id: 3, name: '[+$100,000]', prem: '109.00' },
      ],
    },
    { id: 4, name: '24x7 Roadside Assistance', prem: '43.60' },
  ],
};

const policy = renewalQuote.renewal_info.policy_details;
const renewal = renewalQuote.renewal_info;

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
console.log('renewal.renewal_end_date', renewal.renewal_end_date);
type FormData = z.infer<typeof schema>;

const RenewalDetailForm = () => {
  const initForm = {
    // Policy details
    current_policy_no: policy.current_policy_no,
    coverage: policy.coverage,
    current_policy_expiry_date: formatToDDMMYYYY(
      policy.current_policy_expiry_date,
    ),
    sum_insured: policy.sum_insured,
    agency: policy.agency,

    // Renewal
    date_extracted: formatToDDMMYYYY(renewal.date_extracted),
    scheme: renewal.scheme,
    renewal_start_date: renewal.renewal_start_date
      ? dayjs(renewal.renewal_start_date, 'DD-MM-YYYY')
      : null,
    renewal_expiry_date: renewal.renewal_end_date
      ? dayjs(renewal.renewal_end_date, 'DD-MM-YYYY')
      : null,

    // Renewal excess
    policy_excess_0: renewal.renewal_excess.policy_excess[0]?.value || '',
    policy_excess_1: renewal.renewal_excess.policy_excess[1]?.value || '',
    additional_excess_0:
      renewal.renewal_excess.additional_excess[0]?.value || '',
    additional_excess_1:
      renewal.renewal_excess.additional_excess[1]?.value || '',

    // Vehicle details
    reg_no: policy.vehicle_details['reg. no.'],
    make: policy.vehicle_details.make,
    model: policy.vehicle_details.model,
    first_reg_on: policy.vehicle_details['first reg on'],
    hire_purchase: policy.vehicle_details.hire_purchase,
    model_type: policy.vehicle_details['model type'],

    // Claims / NCD
    no_of_claims: policy.claim_ncd_details.no_of_claims,
    claim_incurred: policy.claim_ncd_details.claim_incurred,
    current_ncd: policy.claim_ncd_details.current_ncd,
    renewal_ncd: policy.claim_ncd_details.renewal_ncd,

    // Insured info
    name: renewal.insured_info.name,
    nric: renewal.insured_info.nric,
    dob: renewal.insured_info.dob,
    gender: renewal.insured_info.gender === 'M' ? 'Male' : 'Female',
    marital_status: renewal.insured_info.marital_status
      ? MARITAL_STATUS_OPTIONS.find(
          (opt) =>
            opt.value ===
            MARITAL_STATUS_MAP[renewal.insured_info.marital_status],
        )?.text || 'N/A'
      : 'N/A',
    address_line1: renewal.insured_info.address.address_line1,
    address_line2: renewal.insured_info.address.address_line2,
    address_line3: renewal.insured_info.address.address_line3,
    postal: renewal.insured_info.address.postal,
    email: renewal.insured_info.email,
    contact_no: renewal.insured_info.contact_no,

    // Named drivers
    named_drivers: policy.named_drivers.map((driver) => ({
      name: driver.name || '',
      nric: driver.icno || '',
      dob: driver.dob ? dayjs(driver.dob).format('YYYY-MM-DD') : '',
      marital_status: driver.martial_status === 'M' ? 'Married' : 'Single',
      driv_exp: driver.driv_exp || '',
      gender: driver.gender === 'M' ? 'Male' : 'Female',
    })),
  };

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    values: initForm,
  });
  const {
    formState: { errors },
  } = methods;

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
            <PolicyDetailsContent errors={errors} />
          </InfoCard>

          <InfoCard
            icon={<RenewalPeriodIcon className='text-sky-500' size={20} />}
            title='Renewal Period'
            subtitle='12-month renewal period (Standard)'
            isPolicyRenewalScreen={true}
          >
            <RenewalPeriodContent
              errors={errors}
              renewalStartDate={initForm.renewal_start_date}
            />
          </InfoCard>

          <InfoCard
            icon={<ExcessIcon className='text-sky-500' size={20} />}
            title='Excess'
            subtitle='Excess amounts applicable to your policy'
            isPolicyRenewalScreen={true}
          >
            <ExcessContent renewal={renewal} />
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
            subtitle={`${policy.named_drivers.length} additional driver${policy.named_drivers.length > 1 ? 's' : ''} added`}
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
            <AddOnsContent renewalQuote={renewalQuote} />
          </InfoCard>
        </div>
      </Form>
    </FormProvider>
  );
};

export default RenewalDetailForm;
