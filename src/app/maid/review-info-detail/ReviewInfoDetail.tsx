'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { saveToSessionStorage } from '@/libs/utils/utils';

import { PrimaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';

import {
  MARITAL_STATUS_OPTIONS,
  ProductType,
} from '@/app/motor/insurance/basic-detail/options';
import { MAID_QUOTE } from '@/constants';
import { ECICS_USER_INFO } from '@/constants/general.constant';
import { ROUTES } from '@/constants/routes';
import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import { usePostPersonalInfoMaid } from '@/hook/auth/login-maid';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';
import { updateMaidQuote } from '@/redux/slices/maidQuote.slice';
import { useAppDispatch } from '@/redux/store';
import { ModalAge } from './ModalAge';
import { v4 as uuid } from 'uuid';
import { DropdownField } from '@/components/ui/form/dropdownfield';

const schema = z.object({
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
  [MAID_QUOTE.marital_status]: z.string({
    required_error: 'This field is required',
  }),
});

type FormData = z.infer<typeof schema>;

export const ReviewInfoDetailMaid = () => {
  const [form] = Form.useForm();
  const router = useRouterWithQuery();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const partnerCode = searchParams.get('partner_code') || '';
  const promoDefault = searchParams.get('promo_code') || '';
  const code = searchParams.get('code');
  if (code) {
    saveToSessionStorage({ code });
  }
  const [isShowModalAge, setIsShowModalAge] = useState(false);

  const maidUserInfo = sessionStorage.getItem(ECICS_USER_INFO);
  const personalInfo = maidUserInfo ? JSON.parse(maidUserInfo) : null;

  const initialValues = {
    [MAID_QUOTE.email]: personalInfo?.email?.value || '',
    [MAID_QUOTE.mobile]: personalInfo?.mobileno?.nbr?.value || '',
    [MAID_QUOTE.name]: personalInfo?.name?.value || '',
    [MAID_QUOTE.nationality]: personalInfo?.nationality?.desc || '',
    dob: personalInfo?.dob?.value || '',
    uinfin: personalInfo?.uinfin?.value || '',
    address1:
      personalInfo?.regadd?.block?.value && personalInfo?.regadd?.street?.value
        ? `${personalInfo.regadd.block.value} ${personalInfo.regadd.street.value}`
        : '',
    address2: personalInfo?.regadd?.building?.value || '',
    address3:
      personalInfo?.regadd?.floor?.value && personalInfo?.regadd?.unit?.value
        ? `${personalInfo.regadd.floor.value}-${personalInfo.regadd.unit.value}`
        : '',
    postal: personalInfo?.regadd?.postal?.value || '',
    gender: personalInfo?.sex?.desc || '',
    [MAID_QUOTE.marital_status]: personalInfo?.marital?.desc || '',
  };

  const {
    mutate: savePersonalInfoMaid,
    isSuccess,
    isError,
    isPending,
  } = usePostPersonalInfoMaid();

  useEffect(() => {
    if (personalInfo?.dob?.value) {
      const age = dayjs().diff(dayjs(personalInfo.dob.value), 'year');
      if (age < 21) {
        setIsShowModalAge(true);
      }
    }
  }, [personalInfo]);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    values: initialValues,
  });

  const {
    watch,
    setValue,
    formState: { errors, isDirty },
  } = methods;

  const handleSubmit = async (values: FormData) => {
    const data = {
      key: `${uuid()}`,
      partner_code: partnerCode,
      promo_code: promoDefault,
      is_sending_email: false,
      product_type: ProductType.MAID,
      personal_info: {
        name: personalInfo?.name?.value ?? '',
        nationality: personalInfo?.nationality?.desc ?? '',
        date_of_birth: dayjs(personalInfo?.dob?.value as Date).format(
          'DD/MM/YYYY',
        ),
        nric: personalInfo?.uinfin?.value ?? '',
        address: [
          personalInfo?.regadd?.block?.value &&
          personalInfo?.regadd?.street?.value
            ? `${personalInfo.regadd.block.value} ${personalInfo.regadd.street.value}`
            : '',
          personalInfo?.regadd?.building?.value || '',
          personalInfo?.regadd?.floor?.value &&
          personalInfo?.regadd?.unit?.value
            ? `${personalInfo.regadd.floor.value}-${personalInfo.regadd.unit.value}`
            : '',
        ],
        post_code: personalInfo?.regadd?.postal?.value ?? '',
        email: values[MAID_QUOTE.email],
        phone: values[MAID_QUOTE.mobile],
        gender: personalInfo?.sex?.desc,
        marital_status: values[MAID_QUOTE.marital_status],
      },
      data_from_singpass: personalInfo,
    };
    savePersonalInfoMaid(data, {
      onSuccess: () => {
        dispatch(updateMaidQuote(data));
      },
    });
  };

  const personalInfoFields = [
    {
      label: 'Name as per NRIC',
      value: personalInfo?.name?.value,
    },
    {
      label: 'Gender',
      value: personalInfo?.sex?.desc,
    },
    {
      label: 'Date of Birth',
      value: dayjs(personalInfo?.dob?.value).format('DD/MM/YYYY'),
    },
    {
      label: 'NRIC / FIN',
      value: personalInfo?.uinfin?.value,
    },
    {
      label: 'Marital Status',
      value: personalInfo?.marital?.desc,
    },
    {
      label: 'Address Line 1',
      value:
        personalInfo?.regadd?.block?.value &&
        personalInfo?.regadd?.street?.value
          ? `${personalInfo.regadd.block.value} ${personalInfo.regadd.street.value}`
          : undefined,
    },
    {
      label: 'Address Line 2',
      value: personalInfo?.regadd?.building?.value,
    },
    {
      label: 'Address Line 3',
      value:
        personalInfo?.regadd?.floor?.value && personalInfo?.regadd?.unit?.value
          ? `${personalInfo.regadd.floor.value}-${personalInfo.regadd.unit.value}`
          : undefined,
    },
    {
      label: 'Postal Code',
      value: personalInfo?.regadd?.postal?.value,
    },
    {
      label: 'Nationality',
      value: personalInfo?.nationality?.desc,
    },
  ];

  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <div className='flex w-full max-w-[1280px] flex-col gap-8 bg-white py-4'>
        <div className='fixed left-0 top-0 z-50 w-full bg-white'>
          <div className='mx-auto flex w-full max-w-[1280px] flex-row items-center justify-between px-4 py-8 sm:px-10 lg:px-0'>
            <img src='../singpass.svg' alt='Logo' className='h-8' />
            <img src='../ecics.svg' alt='Logo' className='h-8' />
          </div>
        </div>

        <div className='mt-16 h-screen overflow-y-auto pb-44 md:mt-20 md:pb-0'>
          <p className='mb-4 text-[22px] font-bold leading-[35px] text-[#080808] md:text-[32px]'>
            Review your Myinfo details
          </p>
          <div className='flex flex-col gap-6'>
            <FormProvider {...methods}>
              <Form
                form={form}
                scrollToFirstError={{
                  behavior: 'smooth',
                  block: 'center',
                }}
                onFinish={methods.handleSubmit(handleSubmit)}
                disabled={isPending}
                className='flex flex-col gap-2'
              >
                <div className='flex flex-col gap-3'>
                  <div className='text-base font-bold underline decoration-gray-400'>
                    Contact Info
                  </div>
                  <div className='mb-4 grid w-full grid-cols-1 gap-4 md:mb-8 md:grid-cols-3 md:gap-6'>
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
                      validateStatus={errors[MAID_QUOTE.mobile] ? 'error' : ''}
                    >
                      <InputField
                        name={MAID_QUOTE.mobile}
                        label='Mobile Number'
                        placeholder='Enter Your Mobile Number'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const onlyNums = e.target.value.replace(/\D/g, '');
                          methods.setValue(MAID_QUOTE.mobile, onlyNums, {
                            shouldValidate: true,
                          });
                        }}
                        value={String(watch(MAID_QUOTE.mobile) ?? '')}
                        isRequired={true}
                      />
                    </Form.Item>
                    <div></div>
                  </div>
                </div>

                <div className='flex flex-col gap-3'>
                  <div className='text-base font-bold underline decoration-gray-400'>
                    Personal Info
                  </div>
                  <div className='grid grid-cols-1 justify-between gap-4 md:grid-cols-4 md:gap-10'>
                    {personalInfoFields.map((item, index) => {
                      if (item.label === 'Marital Status') {
                        return (
                          <div className='flex flex-col gap-1' key={index}>
                            <Form.Item
                              name={MAID_QUOTE.marital_status}
                              validateStatus={
                                errors[MAID_QUOTE.marital_status] ? 'error' : ''
                              }
                            >
                              <DropdownField
                                name={MAID_QUOTE.marital_status}
                                label='Marital Status'
                                placeholder='Select Marital Status'
                                options={MARITAL_STATUS_OPTIONS}
                                isRequired
                              />
                            </Form.Item>
                          </div>
                        );
                      }

                      return (
                        <div className='flex flex-col gap-1' key={index}>
                          <p className='text-sm text-gray-600'>{item.label}</p>
                          <p className='text-base font-semibold'>
                            {item.value ? item.value : 'N/A'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Form>
            </FormProvider>
          </div>
        </div>
      </div>

      <div className='fixed bottom-0 left-0 flex w-full justify-center bg-[#FAFAFA] px-6 py-4 md:py-6'>
        <div className='flex w-full max-w-[1280px] flex-row items-center justify-between gap-6'>
          <Button
            onClick={() => {
              router.push(ROUTES.MAID.LOGIN);
            }}
            disabled={isPending}
            className='h-[40px] w-[90vw] rounded-none border border-[#FF3B30] bg-white text-center text-base font-bold leading-[21px] !text-[#FF3B30] md:w-40'
          >
            Cancel
          </Button>
          <PrimaryButton
            loading={isPending}
            onClick={() => {
              form.submit();
            }}
            className='w-[90vw] bg-green-promo md:w-40'
          >
            Next
          </PrimaryButton>
        </div>
      </div>

      <ModalAge
        isShowModal={isShowModalAge}
        setIsShowModal={setIsShowModalAge}
      />
    </div>
  );
};
