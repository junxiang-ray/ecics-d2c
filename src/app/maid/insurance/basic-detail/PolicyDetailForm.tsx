'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from 'antd';
import { FormProps } from 'antd/es/form';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { adjustDateInDayjs, dateToDayjs } from '@/libs/utils/date-utils';
import { formatPromoCode } from '@/libs/utils/utils';

import { DatePickerField } from '@/components/ui//form/datepicker';
import {
  DropdownOption,
  LongOptionDropdownField,
} from '@/components/ui//form/dropdownfield';
import { PrimaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';

import { MAID_QUOTE } from '@/constants';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import { useGetNationality } from '@/hook/insurance/common';

import RadioField from '@/components/ui/form/radiofield';
import {
  HELPER_TYPE_OPTIONS,
  NumberClaim,
  NumberDriverExperience,
  POLICY_DURATION_OPTIONS,
} from '@/app/motor/insurance/basic-detail/options';
import ArrowBackIcon from '@/components/icons/ArrowBackIcon';
import { PromoCodeField } from '@/app/motor/insurance/components/PromoCode';
import { UnableQuote } from '@/app/motor/insurance/basic-detail/modal/UnableQuote';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const singpassFlowFields = {
  [MAID_QUOTE.start_date]: z
    .date({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    })
    .refine((date) => dayjs(date).isSameOrAfter(dayjs(), 'day'), {
      message: 'Start date cannot be earlier than today',
    })
    .refine(
      (date) => dayjs(date).isSameOrBefore(dayjs().add(90, 'days'), 'day'),
      { message: 'Start date cannot be later than 90 days from today' },
    ),
  [MAID_QUOTE.end_date]: z.date({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required',
  }),
  [MAID_QUOTE.promo_code]: z.string().optional(),
};

const nonSingpassFlowFields = {
  ...singpassFlowFields,
  [MAID_QUOTE.email]: z
    .string({
      required_error: 'This field is required',
    })
    .regex(emailRegex, 'Please enter a valid email address.'),
  [MAID_QUOTE.mobile]: z
    .string({
      required_error: 'This field is required',
    })
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  [MAID_QUOTE.maid_dob]: z.date({
    required_error: 'This field is required',
  }),
  [MAID_QUOTE.maid_type]: z.string({
    required_error: 'This field is required',
  }),
  [MAID_QUOTE.plan_period]: z.string({
    required_error: 'This field is required',
  }),
  [MAID_QUOTE.nationality]: z.string({
    required_error: 'This field is required',
  }),
};

const createSchema = (isSingpassFlow: boolean) => {
  const baseSchema = z.object(
    isSingpassFlow ? singpassFlowFields : nonSingpassFlowFields,
  );

  return baseSchema;
};

const nonSingpassSchema = z.object(nonSingpassFlowFields);
const singpassSchema = z.object(singpassFlowFields);
type NonSingpassFlowFields = z.infer<typeof nonSingpassSchema>;
type SingpassFlowFields = z.infer<typeof singpassSchema>;
type FormData = NonSingpassFlowFields | SingpassFlowFields;

interface PolicyDetailProps extends FormProps {
  onSubmit: (value: any) => void;
  onSaveRegister: (fn: () => any) => void;
  isSingpassFlow: boolean;
  isLoading?: boolean;
}

const PolicyDetailForm = ({
  onSubmit,
  onSaveRegister,
  isSingpassFlow = false,
  initialValues,
  isLoading = false,
  ...props
}: PolicyDetailProps) => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const promoDefault = formatPromoCode(searchParams.get('promo_code'));
  const partnerCode = searchParams.get('partner_code') || '';
  const key = searchParams.get('key') || '';
  console.log(initialValues, 'chinh123333');
  const initPromoCode = initialValues?.[MAID_QUOTE.promo_code] ?? promoDefault;

  const schema = useMemo(() => createSchema(isSingpassFlow), [isSingpassFlow]);
  const [showCSModal, setShowCSModal] = useState(false);
  const [applyPromoCode, setApplyPromoCode] = useState(initPromoCode);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    values: initialValues,
  });

  const {
    watch,
    formState: { errors },
  } = methods;

  // input field change
  const start_date = watch(MAID_QUOTE.start_date) as Date;
  const maid_dob = watch(MAID_QUOTE.maid_dob) as Date;
  const no_claim = watch(MAID_QUOTE.owner_no_of_claims) as string;
  const drvExp = watch(MAID_QUOTE.owner_drv_exp) as string;
  const nationality = watch(MAID_QUOTE.nationality) as string;
  const helperType = watch(MAID_QUOTE.maid_type) as string;
  const policyDuration = watch(MAID_QUOTE.plan_period) as string;

  const { data: nationalOptions } = useGetNationality();

  const nationalOptionsFormatted: DropdownOption[] = useMemo(() => {
    if (!nationalOptions) return [];
    return nationalOptions?.map((item: any) => ({
      text: item.name,
      value: item.name,
    }));
  }, [nationalOptions]);

  useEffect(() => {
    if (helperType === 'New Maid') {
      methods.setValue(MAID_QUOTE.plan_period, '26', { shouldValidate: true });
    }
  }, [helperType, methods]);

  useEffect(() => {
    setApplyPromoCode(initPromoCode);
  }, [initPromoCode]);

  // to open CustoHelper Type*
  // useEffect(() => {
  //   if (drvExp === NumberDriverExperience.LESS_THAN_2_YEARS) {
  //     setShowCSModal(true);
  //   }
  // }, [drvExp]);

  // useEffect(() => {
  //   if (no_claim === NumberClaim.TWO_MANY_CLAIMS) {
  //     setShowCSModal(true);
  //   }
  // }, [no_claim]);

  // Register onSave callback to collect current form values
  useEffect(() => {
    onSaveRegister(() => {
      const value = methods.getValues();
      let vehicle_info_selected;
      let personal_info;

      if (!isSingpassFlow) {
        vehicle_info_selected = {
          vehicle_make: value[MAID_QUOTE.vehicle_make],
          vehicle_model: value[MAID_QUOTE.vehicle_model],
          first_registered_year: value[MAID_QUOTE.reg_yyyy] as string,
        };

        personal_info = {
          date_of_birth: dayjs(value[MAID_QUOTE.owner_dob] as Date).format(
            'DD/MM/YYYY',
          ),
          driving_experience: value[MAID_QUOTE.owner_drv_exp],
          phone: value[MAID_QUOTE.mobile],
          email: value[MAID_QUOTE.email],
        };
      }

      const payload = {
        key: key,
        partner_code: partnerCode,
        promo_code: applyPromoCode,
        company_id: value[MAID_QUOTE.hire_purchase],
        company_name_other: value[MAID_QUOTE.other_hire_purchase] || '',
        personal_info: personal_info,
        vehicle_info_selected: vehicle_info_selected,
        insurance_additional_info: {
          no_claim_discount: value[MAID_QUOTE.owner_ncd],
          no_of_claim: value[MAID_QUOTE.owner_no_of_claims],
          start_date: dayjs(value[MAID_QUOTE.start_date] as Date).format(
            'DD/MM/YYYY',
          ),
          end_date: dayjs(value[MAID_QUOTE.end_date] as Date).format(
            'DD/MM/YYYY',
          ),
          last_claim_amount: value[MAID_QUOTE.owner_claim_amount],
        },
      };
      return payload;
    });
  }, [methods, onSaveRegister]);

  useEffect(() => {
    if (!start_date || !policyDuration) return;
    const months = Number(policyDuration);
    const endDate = dayjs(start_date).add(months, 'month').toDate();
    methods.setValue(MAID_QUOTE.end_date, endDate, { shouldValidate: true });
  }, [start_date, policyDuration, methods]);

  const handleChangeStartDate = (date: any) => {
    const startDate = dateToDayjs(date?.toDate());
    const defaultEndDate = adjustDateInDayjs(startDate, 1, 0, -1);
    if (!defaultEndDate) {
      methods.setValue(MAID_QUOTE.end_date, null as any);
      return;
    }
    methods.setValue(MAID_QUOTE.end_date, defaultEndDate.toDate());
    methods.trigger([MAID_QUOTE.end_date], { shouldFocus: false });
  };

  const handleSubmit = (value: FormData) => {
    let vehicle_info_selected;
    let personal_info;
    const planPeriodText =
      POLICY_DURATION_OPTIONS.find((opt) => opt.value === policyDuration)
        ?.text || policyDuration;
    if (!isSingpassFlow) {
      // vehicle_info_selected = {
      //   vehicle_make: value[MAID_QUOTE.vehicle_make],
      //   vehicle_model: value[MAID_QUOTE.vehicle_model],
      //   first_registered_year: value[MAID_QUOTE.reg_yyyy] as string,
      // };

      personal_info = {
        phone: value[MAID_QUOTE.mobile],
        email: value[MAID_QUOTE.email],
      };
    }
    const noOfClaim = value[MAID_QUOTE.owner_no_of_claims];
    const promoCode =
      noOfClaim === NumberClaim.NEVER ? formatPromoCode(applyPromoCode) : '';
    const payload = {
      key: key,
      maid_type: helperType,
      plan_period: planPeriodText,
      start_date: dayjs(value[MAID_QUOTE.start_date] as Date).format(
        'DD/MM/YYYY',
      ),
      partner_code: partnerCode,
      promo_code: promoCode,
      personal_info: personal_info,
      maid_info: {
        nationality: nationality,
        date_of_birth: dayjs(maid_dob).format('DD/MM/YYYY'),
      },
    };
    onSubmit(payload);
    console.log(payload, 'chinh123');
  };

  const isEnablePromoCode = no_claim === NumberClaim.NEVER || !no_claim;

  const minPolicyStartDate = useMemo(() => {
    return dayjs().add(6, 'day');
  }, []);

  const maxPolicyStartDate = useMemo(() => {
    return dayjs().add(90, 'day');
  }, []);

  const minDob = useMemo(() => {
    if (!start_date) return undefined;
    return dayjs(start_date).subtract(23, 'year');
  }, [start_date]);

  const maxDob = useMemo(() => {
    if (!start_date) return undefined;
    return dayjs(start_date).subtract(60, 'year').add(1, 'day');
  }, [start_date]);

  useEffect(() => {
    if (!start_date || !maid_dob) return;
    const dob = dayjs(maid_dob);
    if (dob.isAfter(minDob, 'day') || dob.isBefore(maxDob, 'day')) {
      methods.setValue(MAID_QUOTE.maid_dob, undefined, {
        shouldValidate: true,
      });
    }
  }, [start_date, maid_dob, minDob, maxDob, methods]);

  return (
    <>
      <FormProvider {...methods}>
        <Form
          form={form}
          scrollToFirstError={{
            behavior: 'smooth',
            block: 'center',
          }}
          onFinish={methods.handleSubmit(handleSubmit)}
          disabled={isLoading}
          className=' mb-16 flex w-full flex-col items-center px-4'
          {...props}
        >
          <div className='max-w-[1200px]'>
            {!isSingpassFlow && (
              <>
                <div className='relative w-full' style={{ zIndex: '99' }}>
                  <div className='flex flex-col'>
                    <div className='text-base font-bold leading-[35px] underline decoration-gray-400 decoration-1'>
                      Your Contact Details
                    </div>
                    <div className='mb-6 flex flex-col gap-6'>
                      <Form.Item
                        name={MAID_QUOTE.email}
                        validateStatus={errors[MAID_QUOTE.email] ? 'error' : ''}
                      >
                        <InputField
                          name={MAID_QUOTE.email}
                          label='Email Address'
                          placeholder='Enter Your Email Address'
                          isRequired={true}
                        />
                      </Form.Item>

                      <Form.Item
                        name={MAID_QUOTE.mobile}
                        validateStatus={
                          errors[MAID_QUOTE.mobile] ? 'error' : ''
                        }
                      >
                        <InputField
                          name={MAID_QUOTE.mobile}
                          label='Mobile Number'
                          placeholder='Enter Your Mobile Number'
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const onlyNums = e.target.value.replace(/\D/g, '');
                            methods.setValue(MAID_QUOTE.mobile, onlyNums, {
                              shouldValidate: true,
                            });
                          }}
                          value={String(watch(MAID_QUOTE.mobile) ?? '')}
                          isRequired={true}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div>
                    <div className='text-base font-bold leading-[35px] underline decoration-gray-400 decoration-1'>
                      Helper’s Information
                    </div>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                      <Form.Item
                        name={MAID_QUOTE.email}
                        validateStatus={errors[MAID_QUOTE.email] ? 'error' : ''}
                      >
                        <RadioField
                          name={MAID_QUOTE.maid_type}
                          label='Helper Type'
                          options={HELPER_TYPE_OPTIONS}
                          className='flex flex-col'
                          // noBorder
                          isRequired={true}
                        />
                      </Form.Item>

                      <Form.Item
                        name={MAID_QUOTE.email}
                        validateStatus={errors[MAID_QUOTE.email] ? 'error' : ''}
                      >
                        <RadioField
                          name={MAID_QUOTE.plan_period}
                          label='Policy Duration'
                          options={POLICY_DURATION_OPTIONS}
                          isRequired={true}
                          disabled={helperType === 'New Maid'}
                        />
                      </Form.Item>

                      <Form.Item
                        name={MAID_QUOTE.start_date}
                        validateStatus={
                          errors[MAID_QUOTE.start_date] ? 'error' : ''
                        }
                      >
                        <DatePickerField
                          name={MAID_QUOTE.start_date}
                          label='Policy Start Date'
                          minDate={minPolicyStartDate}
                          maxDate={maxPolicyStartDate}
                          onChange={handleChangeStartDate}
                          disabledDate={(current) => {
                            return current && current < dayjs().startOf('day');
                          }}
                          isRequired={true}
                        />
                      </Form.Item>
                      <Form.Item
                        name={MAID_QUOTE.end_date}
                        validateStatus={
                          errors[MAID_QUOTE.end_date] ? 'error' : ''
                        }
                      >
                        <DatePickerField
                          label='Policy End Date'
                          name={MAID_QUOTE.end_date}
                          disabled
                          isRequired={true}
                        />
                      </Form.Item>

                      <Form.Item name={MAID_QUOTE.nationality}>
                        <LongOptionDropdownField
                          name={MAID_QUOTE.nationality}
                          label='Nationality'
                          placeholder='Select Helpers Nationality'
                          options={nationalOptionsFormatted}
                          onChange={() => {
                            // Reset model when make changes
                            methods.setValue(
                              MAID_QUOTE.vehicle_model,
                              null as any,
                            );
                          }}
                          showSearch
                          isRequired={true}
                        />
                      </Form.Item>
                      <Form.Item
                        name={MAID_QUOTE.maid_dob}
                        validateStatus={
                          errors[MAID_QUOTE.maid_dob] ? 'error' : ''
                        }
                      >
                        <DatePickerField
                          name={MAID_QUOTE.maid_dob}
                          label='Date of birth'
                          minDate={maxDob}
                          maxDate={minDob}
                          isRequired={true}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className='mt-6 w-full justify-items-center'>
              <div className='w-[90vw] md:w-96'>
                <PromoCodeField
                  placeholder='Enter promo code'
                  applyPromoCode={applyPromoCode}
                  setApplyPromoCode={setApplyPromoCode}
                  isDisablePromoCode={!isEnablePromoCode}
                />
              </div>
            </div>
          </div>
        </Form>
      </FormProvider>
      <div
        className={`fixed bottom-0 w-full bg-white px-2`}
        style={{ zIndex: 100 }}
      >
        <div className='mx-auto w-full max-w-[1200px]'>
          <div className='flex w-full items-center justify-between py-3'>
            <Button
              color='cyan'
              icon={<ArrowBackIcon size={16} />}
              shape='circle'
              className='border-none bg-gray-200 pt-[6px]'
              onClick={(e) => {
                e.stopPropagation();
                // handleBack?.();
              }}
            />
            <PrimaryButton
              loading={isLoading}
              className='ml-[6px] w-[90vw] bg-[#52C41A] md:w-40'
              onClick={() => {
                form.submit();
              }}
            >
              Generate Quote
            </PrimaryButton>
          </div>
        </div>
      </div>
      <UnableQuote
        onClick={() => setShowCSModal(false)}
        visible={showCSModal}
      />
    </>
  );
};

export default PolicyDetailForm;
