'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { SelectedAddon } from '@/libs/types/renewalQuote';

import {
  ExcessIcon,
  PlusSmallIcon,
  PolicyDetailsIcon,
  PolicyHolderIcon,
  PrivateMotorCarIcon,
  RenewalPeriodIcon,
} from '@/components/icons/renewal-icons';

import InfoCard from '@/app/renewal/components/InfoCard';
import AddOnsContent from '@/app/renewal/detail/card/AddOnsContent';
import ExcessContent from '@/app/renewal/detail/card/ExcessContent';
import PolicyDetailsContent from '@/app/renewal/detail/card/PolicyDetailsContent';
import PolicyHolderContent from '@/app/renewal/detail/card/PolicyHolderContent';
import RenewalPeriodContent from '@/app/renewal/detail/card/RenewalPeriodContent';
import VehicleDetailsContent from '@/app/renewal/detail/card/VehicleDetailsContent';
import { updateRenewalQuote } from '@/redux/slices/renewalQuote.slice';
import { useAppDispatch } from '@/redux/store';

import AdditionalNamedDriversContent from './card/AdditionalNamedDriversContent';

const schema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name is required',
    })
    .min(3, 'Name must be at least 3 characters')
    .max(60, 'Name must be at most 60 characters')
    .nonempty('Name is required'),
  renewal_start_date: z.date().nullable().optional(),
  renewal_expiry_date: z.date({
    required_error: 'Renewal expiry date is required',
  }),
  gender: z.string({
    required_error: 'Gender is required',
    invalid_type_error: 'Gender is required',
  }),
  marital_status: z
    .string({
      required_error: 'Marital status is required',
    })
    .nonempty('This field is required'),
  email: z.string().email('Invalid email'),
  contact_no: z.string().min(8, 'Contact number too short'),
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().optional(),
  address_line3: z.string().optional(),
  postal: z.string().min(4, 'Postal code required'),
});

export type RenewalFormData = z.infer<typeof schema>;

interface RenewalDetailProps {
  onSubmit: (value: RenewalFormData) => void;
  initialValues: RenewalFormData;
  renewalQuote: any;
  policy: any;
  renewal: any;
  selectedAddons: SelectedAddon[];
  setSelectedAddons: React.Dispatch<React.SetStateAction<SelectedAddon[]>>;
}

export interface RenewalFormRef {
  submit: () => void;
}

const RenewalDetailForm = forwardRef<RenewalFormRef, RenewalDetailProps>(
  (props, ref) => {
    const {
      onSubmit,
      initialValues,
      selectedAddons,
      setSelectedAddons,
      renewalQuote,
      policy,
      renewal,
    } = props;

    const dispatch = useAppDispatch();

    const methods = useForm<RenewalFormData>({
      resolver: zodResolver(schema),
      mode: 'onChange',
      values: initialValues,
      defaultValues: initialValues,
    });

    const {
      formState: { errors },
      handleSubmit,
    } = methods;

    // calculate selected count (add-ons card)
    const includedCount =
      renewalQuote?.renewal_info?.optional_benefits?.length ?? 0;
    const availableCount =
      includedCount + (renewalQuote?.add_on_optional_benefits?.length ?? 0);
    const selectedCount = includedCount + (selectedAddons?.length ?? 0);

    // Expose submit to parent via ref
    useImperativeHandle(ref, () => ({
      submit: () => handleSubmit(onSubmit)(),
    }));

    return (
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mb-2 flex w-full flex-col px-4 sm:px-4 md:mb-16 md:px-6 lg:px-0'
        >
          <div className='mx-auto mt-[12px]'>
            <InfoCard
              icon={<PolicyDetailsIcon className='text-sky-500' size={20} />}
              title='Policy Details'
              subtitle='Your current policy information'
              isPolicyRenewalScreen
            >
              <PolicyDetailsContent errors={errors} />
            </InfoCard>

            <InfoCard
              icon={<RenewalPeriodIcon className='text-sky-500' size={20} />}
              title='Renewal Period'
              subtitle='12-month renewal period (Standard)'
              isPolicyRenewalScreen
            >
              <RenewalPeriodContent
                errors={errors}
                renewalStartDate={
                  initialValues.renewal_start_date
                    ? dayjs(initialValues.renewal_start_date)
                    : null
                }
              />
            </InfoCard>

            <InfoCard
              icon={<ExcessIcon className='text-sky-500' size={20} />}
              title='Excess'
              subtitle='Excess amounts applicable to your policy'
              isPolicyRenewalScreen
            >
              <ExcessContent renewal={renewal} />
            </InfoCard>

            <InfoCard
              icon={<PrivateMotorCarIcon className='text-sky-500' size={20} />}
              title='Vehicle Details'
              subtitle='Information about your insured vehicle'
              isPolicyRenewalScreen
            >
              <VehicleDetailsContent />
            </InfoCard>

            <InfoCard
              icon={<PolicyHolderIcon className='text-sky-500' size={20} />}
              title='Policyholder'
              subtitle='Personal information and contact details'
              isPolicyRenewalScreen
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
                isPolicyRenewalScreen
              >
                <AdditionalNamedDriversContent />
              </InfoCard>
            )}

            <InfoCard
              icon={<PlusSmallIcon className='text-sky-500' size={20} />}
              title='Add-ons'
              subtitle={`${selectedCount}/${availableCount} add-ons selected`}
              isPolicyRenewalScreen
            >
              <AddOnsContent
                renewalQuote={renewalQuote}
                onChangeSelectedAddons={setSelectedAddons}
              />
            </InfoCard>
          </div>
        </form>
      </FormProvider>
    );
  },
);

RenewalDetailForm.displayName = 'RenewalDetailForm';

export default RenewalDetailForm;
