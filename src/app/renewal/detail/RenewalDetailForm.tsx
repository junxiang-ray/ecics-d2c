'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import { FormProps } from 'antd/es/form';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
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
  email: z.string().email('Invalid email'),
  contact_no: z.string().min(8, 'Contact number too short'),
  address_line1: z.string().min(1, 'Address is required'),
  address_line2: z.string().optional(),
  address_line3: z.string().optional(),
  postal: z.string().min(4, 'Postal code required'),
});

export type RenewalFormData = z.infer<typeof schema>;

interface RenewalDetailProps extends FormProps {
  form: any;
  onSubmit: (value: RenewalFormData) => void;
  isLoading?: boolean;
  initialValues: RenewalFormData;
  renewalQuote: any;
  policy: any;
  renewal: any;
  selectedAddons: SelectedAddon[];
  setSelectedAddons: React.Dispatch<React.SetStateAction<SelectedAddon[]>>;
}

const RenewalDetailForm = ({
  onSubmit,
  form,
  initialValues,
  selectedAddons,
  setSelectedAddons,
  renewalQuote,
  policy,
  renewal,
  isLoading = false,
  ...props
}: RenewalDetailProps) => {
  const dispatch = useAppDispatch();
  const methods = useForm<RenewalFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    values: initialValues,
  });
  const {
    formState: { errors },
  } = methods;

  const watchedValues = methods.watch();
  useEffect(() => {
    const updatedValues = { ...renewalQuote.renewal_info, ...watchedValues };
    const payload = {
      ...updatedValues,
      selected_add_on_optional_benefits: selectedAddons,
    };

    const isEqual =
      JSON.stringify(payload) === JSON.stringify(renewalQuote.renewal_info);
    // console.log("isEqual", isEqual);

    if (!isEqual) {
      dispatch(updateRenewalQuote({ renewal_info: payload }));
    }
  }, [watchedValues, selectedAddons, dispatch, renewalQuote.renewal_info]);

  return (
    <FormProvider {...methods}>
      <Form
        form={form}
        scrollToFirstError={{
          behavior: 'smooth',
          block: 'center',
        }}
        disabled={isLoading}
        onFinish={methods.handleSubmit(onSubmit)}
        className='mb-2 flex w-full flex-col px-4 sm:px-4 md:mb-16 md:px-6 lg:px-0'
        {...props}
      >
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

          {policy?.named_drivers.length > 0 && (
            <InfoCard
              icon={<PolicyHolderIcon className='text-sky-500' size={20} />}
              title='Additional Named Drivers'
              subtitle={`${policy.named_drivers.length} additional driver${policy.named_drivers.length > 1 ? 's' : ''} added`}
              isPolicyRenewalScreen={true}
            >
              <AdditionalNamedDriversContent />
            </InfoCard>
          )}

          <InfoCard
            icon={<PlusSmallIcon className='text-sky-500' size={20} />}
            title='Add-ons'
            subtitle='4/9 add-ons selected'
            isPolicyRenewalScreen={true}
          >
            <AddOnsContent
              renewalQuote={renewalQuote}
              onChangeSelectedAddons={setSelectedAddons}
            />
          </InfoCard>
        </div>
      </Form>
    </FormProvider>
  );
};

export default RenewalDetailForm;
