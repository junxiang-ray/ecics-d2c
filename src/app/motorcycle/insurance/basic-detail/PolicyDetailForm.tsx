'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Spin } from 'antd';
import { FormProps } from 'antd/es/form';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { adjustDateInDayjs, dateToDayjs } from '@/libs/utils/date-utils';
import { calculateAge, formatPromoCode } from '@/libs/utils/utils';

import { PricingSummary } from '@/components/page/FeeBar';
import { DatePickerField } from '@/components/ui//form/datepicker';
import {
  DropdownField,
  DropdownOption,
  LongOptionDropdownField,
} from '@/components/ui//form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';
import { InputNumberField } from '@/components/ui/form/inputnumberfield';

import { MOTOR_QUOTE, MOTORCYCLE_QUOTE } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import {
  useGetVehicleMakes,
  useGetVehicleModels,
} from '@/hook/insurance/common';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

// import { QuoteModal } from './modal/QuoteModal'; // old
import { QuoteModal } from '@/app/motorcycle/insurance/basic-detail/modal/QuoteModal';

import {
  NCD_OPTIONS_MOTORCYCLE,
  NO_CLAIM_OPTIONS,
  NumberClaim,
  NumberDriverExperience,
  ProductType,
  REG_YEAR_OPTIONS,
} from '@/app/motorcycle/insurance/basic-detail/options';
// import { PromoCodeField } from '../components/PromoCode'; // old
import { PromoCodeField } from '@/app/motorcycle/insurance/components/PromoCode';
import { DatePickerFieldWheel } from '@/components/ui/form/datepickerfieldwheel';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const sryMsg =
  'Please contact us for assistance at +65 6206 5588 or customerservice@ecics.com.sg';

const singpassFlowFields = {
  [MOTORCYCLE_QUOTE.hire_purchase]: z.number({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required',
  }),
  [MOTORCYCLE_QUOTE.other_hire_purchase]: z.string().optional(),
  [MOTORCYCLE_QUOTE.start_date]: z
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
  [MOTORCYCLE_QUOTE.end_date]: z.date({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required',
  }),
  [MOTORCYCLE_QUOTE.owner_ncd]: z.number({
    required_error: 'This field is required',
  }),
  [MOTORCYCLE_QUOTE.owner_no_of_claims]: z
    .string({
      required_error: 'This field is required',
    })
    .refine((val) => val !== NumberClaim.TWO_MANY_CLAIMS, {
      message: sryMsg,
    }),
  [MOTORCYCLE_QUOTE.promo_code]: z.string().optional(),
};

const nonSingpassFlowFields = {
  ...singpassFlowFields,
  [MOTORCYCLE_QUOTE.email]: z
    .string({
      required_error: 'This field is required',
    })
    .regex(emailRegex, 'Please enter a valid email address.'),
  [MOTORCYCLE_QUOTE.mobile]: z
    .string({
      required_error: 'This field is required',
    })
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),
  [MOTORCYCLE_QUOTE.owner_dob]: z.date({
    required_error: 'This field is required',
    invalid_type_error: 'This field is required',
  }),
  [MOTORCYCLE_QUOTE.owner_drv_exp]: z.coerce
    .number({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    })
    .min(2, { message: sryMsg }),
  [MOTORCYCLE_QUOTE.vehicle_make]: z
    .string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    })
    .nonempty('This field is required'),
  [MOTORCYCLE_QUOTE.vehicle_model]: z
    .string({
      required_error: 'This field is required',
      invalid_type_error: 'This field is required',
    })
    .nonempty('This field is required'),
  [MOTORCYCLE_QUOTE.reg_yyyy]: z.string({
    required_error: 'This field is required',
  }),
};
const ID_OPTION_OTHER = 2; //-- Others (Not Available in this list) --
const createSchema = (isSingpassFlow: boolean) => {
  const baseSchema = z.object(
    isSingpassFlow ? singpassFlowFields : nonSingpassFlowFields,
  );

  return baseSchema
    .refine(
      (data) => {
        const startDate = data[MOTORCYCLE_QUOTE.start_date];
        const endDate = data[MOTORCYCLE_QUOTE.end_date];
        if (!startDate || !endDate) {
          return false;
        }
        const minEndDate = adjustDateInDayjs(
          dateToDayjs(startDate as Date),
          0,
          10,
          -1,
        );
        return dayjs(endDate as Date).isSameOrAfter(minEndDate);
      },
      {
        message:
          'Policy end date must be at least 10 months after the start date',
        path: [MOTORCYCLE_QUOTE.end_date],
      },
    )
    .refine(
      (data) => {
        const startDate = data[MOTORCYCLE_QUOTE.start_date];
        const endDate = data[MOTORCYCLE_QUOTE.end_date];
        if (!startDate || !endDate) {
          return false;
        }
        const maxEndDate = adjustDateInDayjs(
          dateToDayjs(startDate as Date),
          0,
          18,
          -1,
        );
        return dayjs(endDate as Date).isSameOrBefore(maxEndDate);
      },
      {
        message:
          'Policy end date cannot be more than 18 months after the start date',
        path: [MOTORCYCLE_QUOTE.end_date],
      },
    )
    .superRefine((data, ctx) => {
      if (data[MOTORCYCLE_QUOTE.hire_purchase] === ID_OPTION_OTHER) {
        const value = data[MOTORCYCLE_QUOTE.other_hire_purchase];

        if (typeof value !== 'string' || !value.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'This field is required',
            path: [MOTORCYCLE_QUOTE.other_hire_purchase],
          });
        }
      }

      // driver experience validation based on age at policy start date
      if (
        data[MOTORCYCLE_QUOTE.owner_dob] &&
        data[MOTORCYCLE_QUOTE.owner_drv_exp] &&
        data[MOTORCYCLE_QUOTE.start_date]
      ) {
        const age = calculateAge(
          data[MOTORCYCLE_QUOTE.owner_dob] as string,
          data[MOTORCYCLE_QUOTE.start_date] as Date,
        );
        const drvExp = Number(data[MOTORCYCLE_QUOTE.owner_drv_exp]);
        const maxDrvExp = age - 18;

        if (drvExp > maxDrvExp) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Please provide driving experience suitable for the driver's age.",
            path: [MOTORCYCLE_QUOTE.owner_drv_exp],
          });
        }
      }
    });
};

const nonSingpassSchema = z.object(nonSingpassFlowFields);
const singpassSchema = z.object(singpassFlowFields);
type NonSingpassFlowFields = z.infer<typeof nonSingpassSchema>;
type SingpassFlowFields = z.infer<typeof singpassSchema>;
type FormData = NonSingpassFlowFields | SingpassFlowFields;

interface PolicyDetailProps extends FormProps {
  onSubmit: (value: any) => void;
  onSaveRegister: (fn: () => any) => void;
  hirePurchaseOptions: DropdownOption[];
  isSingpassFlow: boolean;
  isLoading?: boolean;
}

const PolicyDetailForm = ({
  onSubmit,
  onSaveRegister,
  hirePurchaseOptions,
  isSingpassFlow = false,
  initialValues,
  isLoading = false,
  ...props
}: PolicyDetailProps) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const { isMobile } = useDeviceDetection();
  const promoDefault = formatPromoCode(searchParams.get('promo_code'));
  const partnerCode = searchParams.get('partner_code') || '';
  const key = searchParams.get('key') || '';
  const initPromoCode =
    initialValues?.[MOTORCYCLE_QUOTE.promo_code] ?? promoDefault;

  const schema = useMemo(() => createSchema(isSingpassFlow), [isSingpassFlow]);
  const [showCSModal, setShowCSModal] = useState<{
    visible: boolean;
    description: string;
  }>({
    visible: false,
    description: '',
  });
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
    formState: { errors, touchedFields },
  } = methods;

  // input field change
  const start_date = watch(MOTORCYCLE_QUOTE.start_date) as Date;
  const date_of_birth = watch(MOTORCYCLE_QUOTE.owner_dob) as Date;
  const hire_purchase = watch(MOTORCYCLE_QUOTE.hire_purchase);
  const no_claim = watch(MOTORCYCLE_QUOTE.owner_no_of_claims) as string;
  const drvExp = watch(MOTORCYCLE_QUOTE.owner_drv_exp) as number;
  const vehicle_make = watch(MOTORCYCLE_QUOTE.vehicle_make) as string;

  const { data: makeOptions } = useGetVehicleMakes('motorcycle'); // undo this change after testing
  // const { data: makeOptions } = useGetVehicleMakes();
  const vehicleMakeId = makeOptions?.find(
    (item: any) => item.name === vehicle_make,
  )?.id;

  const { data: modelOptions, isLoading: isLoadingModelOptions } =
    useGetVehicleModels(vehicleMakeId as string, 'motorcycle'); //undo this change after testing
  // useGetVehicleModels(vehicleMakeId as string);

  const handleBackLogin = () => {
    router.push(ROUTES.MOTORCYCLE.LOGIN);
  };

  const makeOptionsFormatted: DropdownOption[] = useMemo(() => {
    if (!makeOptions) return [];
    return makeOptions?.map((item: any) => ({
      text: item.name,
      value: item.name,
    }));
  }, [makeOptions]);

  const modelOptionsFormatted: DropdownOption[] = useMemo(() => {
    if (!modelOptions) return [];
    return modelOptions?.map((item: any) => ({
      text: item.name,
      value: item.name,
    }));
  }, [modelOptions]);

  useEffect(() => {
    setApplyPromoCode(initPromoCode);
  }, [initPromoCode]);

  useEffect(() => {
    if (hire_purchase !== ID_OPTION_OTHER) {
      methods.setValue(MOTORCYCLE_QUOTE.other_hire_purchase, '');
    }
  }, [hire_purchase]);

  // to open Customer Service Modal - Unable to provide quote online
  useEffect(() => {
    if (
      touchedFields[MOTORCYCLE_QUOTE.owner_drv_exp] &&
      drvExp !== null &&
      drvExp < NumberDriverExperience.LESS_THAN_2_YEARS
    ) {
      setShowCSModal({
        visible: true,
        description:
          'The listed driver has less than 2 years of driving experience',
      });
    }
  }, [drvExp, touchedFields[MOTORCYCLE_QUOTE.owner_drv_exp]]);

  useEffect(() => {
    if (no_claim === NumberClaim.TWO_MANY_CLAIMS) {
      setShowCSModal({
        visible: true,
        description:
          'The listed driver has reported more than 2 claims or claims exceeding SGD 20,000.',
      });
    }
  }, [no_claim]);

  // Register onSave callback to collect current form values
  useEffect(() => {
    onSaveRegister(() => {
      const value = methods.getValues();
      let vehicle_info_selected;
      let personal_info;

      if (!isSingpassFlow) {
        vehicle_info_selected = {
          vehicle_make: value[MOTORCYCLE_QUOTE.vehicle_make],
          vehicle_model: value[MOTORCYCLE_QUOTE.vehicle_model],
          first_registered_year: value[MOTORCYCLE_QUOTE.reg_yyyy] as string,
        };

        personal_info = {
          date_of_birth: dayjs(
            value[MOTORCYCLE_QUOTE.owner_dob] as Date,
          ).format('DD/MM/YYYY'),
          driving_experience: value[MOTORCYCLE_QUOTE.owner_drv_exp],
          phone: value[MOTORCYCLE_QUOTE.mobile],
          email: (value[MOTORCYCLE_QUOTE.email] as string)?.toLowerCase(),
        };
      }

      const payload = {
        key: key,
        partner_code: partnerCode,
        promo_code: applyPromoCode,
        company_id: value[MOTORCYCLE_QUOTE.hire_purchase],
        company_name_other: value[MOTORCYCLE_QUOTE.other_hire_purchase] || '',
        personal_info: personal_info,
        vehicle_info_selected: vehicle_info_selected,
        insurance_additional_info: {
          no_claim_discount: value[MOTORCYCLE_QUOTE.owner_ncd],
          no_of_claim: value[MOTORCYCLE_QUOTE.owner_no_of_claims],
          start_date: dayjs(value[MOTORCYCLE_QUOTE.start_date] as Date).format(
            'DD/MM/YYYY',
          ),
          end_date: dayjs(value[MOTORCYCLE_QUOTE.end_date] as Date).format(
            'DD/MM/YYYY',
          ),
          last_claim_amount: value[MOTORCYCLE_QUOTE.owner_claim_amount],
        },
      };
      return payload;
    });
  }, [methods, onSaveRegister]);

  const handleChangeDob = () => {
    methods.setValue(MOTORCYCLE_QUOTE.start_date, null as any);
    methods.setValue(MOTORCYCLE_QUOTE.end_date, null as any);
  };

  const handleChangeStartDate = (date: any) => {
    const startDate = dateToDayjs(date?.toDate());
    const defaultEndDate = adjustDateInDayjs(startDate, 1, 0, -1);
    if (!defaultEndDate) {
      methods.setValue(MOTORCYCLE_QUOTE.end_date, null as any);
      return;
    }
    methods.setValue(MOTORCYCLE_QUOTE.end_date, defaultEndDate.toDate());
    methods.trigger([MOTORCYCLE_QUOTE.end_date], { shouldFocus: false });
  };

  const hire_purchase_section = (
    <>
      <Form.Item
        name={MOTORCYCLE_QUOTE.hire_purchase}
        validateStatus={errors[MOTORCYCLE_QUOTE.hire_purchase] ? 'error' : ''}
        className='mb-1'
      >
        <LongOptionDropdownField
          name={MOTORCYCLE_QUOTE.hire_purchase}
          label='Vehicle Financed By'
          isRequired
          disabled={isLoading}
          placeholder='Select name of finance company'
          options={hirePurchaseOptions}
          showSearch
        />
      </Form.Item>

      {hire_purchase === ID_OPTION_OTHER && (
        <Form.Item
          name={MOTORCYCLE_QUOTE.other_hire_purchase}
          validateStatus={
            errors[MOTORCYCLE_QUOTE.other_hire_purchase] ? 'error' : ''
          }
          className='mb-1'
        >
          <InputField
            name={MOTORCYCLE_QUOTE.other_hire_purchase}
            label='Your Hire Purchase Company'
            isRequired
            placeholder='Please enter your hire purchase company'
          />
        </Form.Item>
      )}
    </>
  );

  const handleSubmit = (value: FormData) => {
    let vehicle_info_selected;
    let personal_info;

    if (!isSingpassFlow) {
      vehicle_info_selected = {
        vehicle_make: value[MOTORCYCLE_QUOTE.vehicle_make],
        vehicle_model: value[MOTORCYCLE_QUOTE.vehicle_model],
        first_registered_year: value[MOTORCYCLE_QUOTE.reg_yyyy] as string,
      };
      personal_info = {
        date_of_birth: dayjs(value[MOTORCYCLE_QUOTE.owner_dob] as Date).format(
          'DD/MM/YYYY',
        ),
        driving_experience: value[MOTORCYCLE_QUOTE.owner_drv_exp],
        phone: value[MOTORCYCLE_QUOTE.mobile],
        email: value[MOTORCYCLE_QUOTE.email],
      };
    }
    const noOfClaim = value[MOTORCYCLE_QUOTE.owner_no_of_claims];
    const promoCode =
      noOfClaim === NumberClaim.NEVER ? formatPromoCode(applyPromoCode) : '';
    const payload = {
      key: key,
      partner_code: partnerCode,
      promo_code: promoCode,
      company_id: value[MOTORCYCLE_QUOTE.hire_purchase],
      company_name_other: value[MOTORCYCLE_QUOTE.other_hire_purchase] || '',
      personal_info: personal_info,
      vehicle_info_selected: vehicle_info_selected,
      insurance_additional_info: {
        no_claim_discount: value[MOTORCYCLE_QUOTE.owner_ncd],
        no_of_claim: value[MOTORCYCLE_QUOTE.owner_no_of_claims],
        start_date: dayjs(value[MOTORCYCLE_QUOTE.start_date] as Date).format(
          'DD/MM/YYYY',
        ),
        end_date: dayjs(value[MOTORCYCLE_QUOTE.end_date] as Date).format(
          'DD/MM/YYYY',
        ),
      },
    };
    onSubmit(payload);
  };

  const isEnablePromoCode = no_claim === NumberClaim.NEVER || !no_claim;

  const minDob = useMemo(() => dayjs().subtract(100, 'year'), []);
  const maxDob = useMemo(() => dayjs(), []);
  const minPolicyStartDate = useMemo(() => dayjs(), []);
  const maxPolicyStartDate = useMemo(() => dayjs().add(90, 'day'), []);

  const minPolicyEndDate = useMemo(() => {
    const startDateDayjs = dateToDayjs(start_date);
    const minEligibleDate = adjustDateInDayjs(startDateDayjs, 0, 10, -1);
    return minEligibleDate;
  }, [start_date]);
  const maxPolicyEndDate = useMemo(() => {
    const startDateDayjs = dateToDayjs(start_date);
    const maxEligibleDate = adjustDateInDayjs(startDateDayjs, 0, 18, -1);
    return maxEligibleDate;
  }, [start_date]);

  useEffect(() => {
    if (!date_of_birth || !start_date) return;

    const policyStartDate = dayjs(start_date);
    const dobDate = dayjs(date_of_birth);
    const ageAtPolicyStart = policyStartDate.diff(dobDate, 'year');
    const isOutOfRange = ageAtPolicyStart < 26 || ageAtPolicyStart >= 71;

    if (isOutOfRange) {
      setShowCSModal({
        visible: true,
        description:
          ageAtPolicyStart < 26
            ? 'The driver is below 26 years of age.'
            : 'The driver is above 70 years of age.',
      });
      methods.setValue(MOTORCYCLE_QUOTE.owner_dob, undefined, {
        shouldValidate: true,
      });
    }
  }, [start_date, date_of_birth]);

  const DatePickerComponent = isMobile ? DatePickerFieldWheel : DatePickerField;

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
          <div className='max-w-[1200px] pb-10'>
            {!isSingpassFlow && (
              <>
                <div className='relative w-full' style={{ zIndex: '99' }}>
                  <div className='w-full'>
                    <div className='my-3 text-lg font-bold'>
                      Personal Information
                    </div>
                    <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                      <Form.Item
                        name={MOTORCYCLE_QUOTE.email}
                        validateStatus={
                          errors[MOTORCYCLE_QUOTE.email] ? 'error' : ''
                        }
                      >
                        <InputField
                          name={MOTORCYCLE_QUOTE.email}
                          label='Email Address'
                          isRequired
                          placeholder='Enter your email address'
                        />
                      </Form.Item>

                      <Form.Item
                        name={MOTORCYCLE_QUOTE.mobile}
                        validateStatus={
                          errors[MOTORCYCLE_QUOTE.mobile] ? 'error' : ''
                        }
                      >
                        <InputField
                          name={MOTORCYCLE_QUOTE.mobile}
                          label='Mobile Number'
                          isRequired
                          placeholder='Enter your phone number'
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const onlyNums = e.target.value.replace(/\D/g, '');
                            methods.setValue(
                              MOTORCYCLE_QUOTE.mobile,
                              onlyNums,
                              {
                                shouldValidate: true,
                              },
                            );
                          }}
                          value={String(watch(MOTORCYCLE_QUOTE.mobile) ?? '')}
                        />
                      </Form.Item>

                      <Form.Item
                        name={MOTORCYCLE_QUOTE.owner_dob}
                        validateStatus={
                          errors[MOTORCYCLE_QUOTE.owner_dob] ? 'error' : ''
                        }
                      >
                        <DatePickerComponent
                          name={MOTORCYCLE_QUOTE.owner_dob}
                          label='Date of birth'
                          format='DD/MM/YYYY'
                          minDate={minDob}
                          maxDate={maxDob}
                          isRequired
                          onChange={handleChangeDob}
                          defaultPickerValue={dayjs().subtract(40, 'year')}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className='my-6 mt-[32px] w-full'>
                    <div className='my-3 text-lg font-bold'>
                      Vehicle Information
                    </div>
                    <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                      <Form.Item name={MOTORCYCLE_QUOTE.vehicle_make}>
                        <LongOptionDropdownField
                          name={MOTORCYCLE_QUOTE.vehicle_make}
                          label='Vehicle Make'
                          isRequired
                          placeholder='Select vehicle make'
                          options={makeOptionsFormatted}
                          disabled={isLoading}
                          onChange={() => {
                            // Reset model when make changes
                            methods.setValue(
                              MOTORCYCLE_QUOTE.vehicle_model,
                              null as any,
                            );
                          }}
                          showSearch
                        />
                      </Form.Item>

                      <Form.Item name={MOTORCYCLE_QUOTE.vehicle_model}>
                        <LongOptionDropdownField
                          name={MOTORCYCLE_QUOTE.vehicle_model}
                          label='Vehicle Model'
                          isRequired
                          placeholder='Select vehicle model'
                          options={modelOptionsFormatted}
                          disabled={!vehicle_make || isLoading}
                          notFoundContent={
                            isLoadingModelOptions ? (
                              <Spin size='small' />
                            ) : (
                              'No results found'
                            )
                          }
                          showSearch
                        />
                      </Form.Item>

                      <Form.Item name={MOTORCYCLE_QUOTE.reg_yyyy}>
                        <DropdownField
                          name={MOTORCYCLE_QUOTE.reg_yyyy}
                          label="Vehicle's Year of Registration"
                          isRequired
                          placeholder='Select registration year'
                          options={REG_YEAR_OPTIONS}
                        />
                      </Form.Item>
                      {!isSingpassFlow ? hire_purchase_section : null}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className='mt-[32px] w-full'>
              <div className='my-3 text-lg font-bold'>
                Your Driving Experience
              </div>
              <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                <Form.Item
                  name={MOTORCYCLE_QUOTE.owner_drv_exp}
                  validateStatus={
                    errors[MOTORCYCLE_QUOTE.owner_drv_exp] ? 'error' : ''
                  }
                >
                  <InputNumberField
                    name={MOTORCYCLE_QUOTE.owner_drv_exp}
                    label='Years of Driving Experience'
                    isRequired
                    placeholder='Enter your driving experience'
                    min={0}
                    max={60}
                    suffix='year(s)'
                    precision={0}
                  />
                </Form.Item>

                <Form.Item name={MOTORCYCLE_QUOTE.owner_ncd}>
                  <DropdownField
                    name={MOTORCYCLE_QUOTE.owner_ncd}
                    label='No Claim Discount'
                    isRequired
                    placeholder='Select your current NCD'
                    options={NCD_OPTIONS_MOTORCYCLE}
                  ></DropdownField>
                </Form.Item>

                <Form.Item
                  name={MOTORCYCLE_QUOTE.owner_no_of_claims}
                  validateStatus={
                    errors[MOTORCYCLE_QUOTE.owner_no_of_claims] ? 'error' : ''
                  }
                >
                  <DropdownField
                    name={MOTORCYCLE_QUOTE.owner_no_of_claims}
                    label='Number of claims in the past 3 years'
                    isRequired
                    placeholder='Select number of claims'
                    options={NO_CLAIM_OPTIONS}
                  />
                </Form.Item>
              </div>
            </div>

            <div className='mt-[32px] w-full'>
              <div className='my-3 text-lg font-bold'>
                Policy Start & End Date
              </div>
              <div className='grid gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-4'>
                <Form.Item
                  name={MOTORCYCLE_QUOTE.start_date}
                  validateStatus={
                    errors[MOTORCYCLE_QUOTE.start_date] ? 'error' : ''
                  }
                >
                  <DatePickerComponent
                    name={MOTORCYCLE_QUOTE.start_date}
                    format='DD/MM/YYYY'
                    label='Policy Start Date'
                    isRequired
                    minDate={minPolicyStartDate}
                    maxDate={maxPolicyStartDate}
                    onChange={handleChangeStartDate}
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf('day');
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name={MOTORCYCLE_QUOTE.end_date}
                  validateStatus={
                    errors[MOTORCYCLE_QUOTE.end_date] ? 'error' : ''
                  }
                >
                  <DatePickerComponent
                    label='Policy End Date'
                    name={MOTORCYCLE_QUOTE.end_date}
                    isRequired
                    minDate={minPolicyEndDate}
                    maxDate={maxPolicyEndDate}
                    disabled={!start_date || isLoading}
                    format='DD/MM/YYYY'
                  />
                </Form.Item>
                {isSingpassFlow ? hire_purchase_section : null}
              </div>
            </div>

            <div className='mt-6 w-full justify-items-center'>
              <div className='w-[90vw] md:w-96'>
                <PromoCodeField
                  placeholder='Enter promo code'
                  applyPromoCode={applyPromoCode}
                  setApplyPromoCode={setApplyPromoCode}
                  isDisablePromoCode={!isEnablePromoCode}
                  product_type={ProductType.MOTORCYCLE}
                  isFormSubmitting={isLoading}
                />
              </div>
            </div>
          </div>
        </Form>
      </FormProvider>
      <div
        className={`fixed bottom-0 w-full bg-white px-2 ${isMobile ? 'px-2' : ''}`}
        style={{ zIndex: 100 }}
      >
        <PricingSummary
          loading={isLoading}
          isBasicDetailScreen={true}
          textButton='Generate Quote'
          handleBack={handleBackLogin}
          onClick={() => {
            form.submit();
          }}
          productType={ProductType.MOTORCYCLE}
        />
      </div>
      <QuoteModal
        onClick={() => setShowCSModal({ ...showCSModal, visible: false })}
        visible={showCSModal.visible}
        description={showCSModal.description}
      />
    </>
  );
};

export default PolicyDetailForm;
