'use client';

import {
  EyeInvisibleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { sgCarRegNoValidator } from '@/libs/utils/validation-utils';

import { CarIcon } from '@/components/icons/add-on-icons';
import { PrimaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';

import { PRODUCT_NAME } from '@/app/api/constants/product';
import { ROUTES } from '@/constants/routes';
import { useRequestSignInSingpass } from '@/hook/auth/login-renewal';
import { useCheckPolicyRenewal } from '@/hook/insurance/renewal';
import {
  useGetTimeoutRenewal,
  usePostCheckPolicies,
  usePostRenewalProcessPayment,
} from '@/hook/renewal/renewalQuote';
import {
  resetRenewalQuote,
  setEditRenewal,
  setProductType,
  setTimeoutValue,
  updateRenewalQuote,
} from '@/redux/slices/renewalQuote.slice';
import { useAppDispatch } from '@/redux/store';

const schema = z.object({
  veh_reg_no: z
    .string({
      required_error: 'Vehicle number is required',
      invalid_type_error: 'Vehicle number is required',
    })
    .min(1, 'Vehicle number is required')
    .refine((val) => sgCarRegNoValidator(val), {
      message: 'Please enter a valid vehicle registration no. (e.g. SBA123A).',
    }),
  passphrase: z.string().min(6, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

const LoginRenewalPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetRenewalQuote());
    sessionStorage.clear();
    localStorage.clear();
  }, [dispatch]);

  const [showPassword, setShowPassword] = useState(false);
  const [messageError, setMessageError] = useState('');
  const {
    mutate: requestSignInSingpass,
    error: errorLoginRenewal,
    isPending: isPendingSignIn,
  } = useRequestSignInSingpass(PRODUCT_NAME.RENEWAL);
  const {
    mutateAsync: checkPolicyRenewal,
    isPending,
    error,
  } = useCheckPolicyRenewal();
  const { mutate: getTimeoutRenewal, isPending: isPendingTimeout } =
    useGetTimeoutRenewal();
  const { mutate: checkPolicies } = usePostCheckPolicies();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      veh_reg_no: '',
      passphrase: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmitSigninRenewal = (values: FormData) => {
    checkPolicies(
      {
        policies: [
          {
            veh_reg_no: values.veh_reg_no,
          },
        ],
      },
      {
        onSuccess: (res) => {
          if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            const vehRegNo = res.data[0].veh_reg_no;
            checkPolicyRenewal(
              {
                veh_reg_no: vehRegNo,
                passphrase: values.passphrase,
              },
              {
                onSuccess: (res) => {
                  if (res) {
                    dispatch(updateRenewalQuote(res));
                    dispatch(setEditRenewal(res.edit_renewal));
                    dispatch(setProductType(res.product));

                    getTimeoutRenewal(undefined, {
                      onSuccess: (timeoutRes) => {
                        const minutes =
                          timeoutRes?.data?.attributes
                            ?.session_timeout_minutes ?? 0;
                        const timeoutMs = Number(minutes) * 60 * 1000;
                        dispatch(setTimeoutValue(timeoutMs));
                        router.push(ROUTES.RENEWAL.RENEWAL_NOTICE);
                      },
                    });
                  }
                },
                onError: (err: any) => {
                  setMessageError(
                    err?.response?.data?.message ?? 'Something went wrong',
                  );
                },
              },
            );
          } else {
            setMessageError(
              'Policy has been renewed already. Please contact ECICS for further information',
            );
          }
        },
        onError: (err: any) => {
          setMessageError(
            err?.response?.data?.message ?? 'Something went wrong',
          );
        },
      },
    );
  };

  return (
    <div
      className='flex h-screen w-full flex-row items-center justify-center bg-white px-4'
      style={{
        backgroundImage: "url('/img-error.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom right',
        backgroundSize: 'contain',
      }}
    >
      <div className='flex flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-lg md:max-w-[480px]'>
        <img src='/ecics.svg' alt='ecics' />
        <p className='text-2xl font-bold text-[#0A0A0A]'>View Renewal Notice</p>
        <p className='text-lg text-[#717182]'>Securely with Singpass</p>
        <Button
          onClick={() => {
            requestSignInSingpass();
          }}
          className='shadow- w-full rounded-lg bg-[#F4333D] py-5 text-center font-semibold text-white'
        >
          Log in with Singpass
        </Button>
        {errorLoginRenewal && (
          <div className='mt-2 flex w-full flex-row items-start gap-2 rounded-lg border border-[#FFC9C9] bg-[#FEF2F2] p-2 font-normal text-[#E7000B]'>
            <InfoCircleOutlined className='mt-1' />
            <p>
              SingPass is currently under maintenance. Please try again later or
              use your Vehicle Registration Number and Password to login.
            </p>
          </div>
        )}
        <div className='flex w-full flex-row items-center justify-center gap-6'>
          <div className='h-[2px] min-w-[75px] bg-gray-200 md:min-w-[120px]'></div>
          <p className='text-[#717182]'>or continue with</p>
          <div className='h-[2px] min-w-[75px] bg-gray-200 md:min-w-[120px]'></div>
        </div>
        <FormProvider {...methods}>
          <Form
            form={form}
            layout='vertical'
            className='flex w-full flex-col gap-4'
            onFinish={handleSubmit(onSubmitSigninRenewal)}
          >
            <Form.Item
              name='onSubmit'
              validateStatus={errors['veh_reg_no'] ? 'error' : ''}
            >
              <InputField
                name='veh_reg_no'
                label='Vehicle Registration No'
                placeholder='Example: SBA123A'
                isRequired
                prefix={<CarIcon size={16} className='mr-2 text-gray-400' />}
                autoFocus
              />
              <p className='mt-2 text-sm text-gray-400'>
                Enter your vehicle registration number as shown on your policy
              </p>
            </Form.Item>
            <Form.Item
              name='passphrase'
              validateStatus={errors['passphrase'] ? 'error' : ''}
            >
              <InputField
                type={showPassword ? 'text' : 'password'}
                name='passphrase'
                label='Password *'
                placeholder='Enter your password'
                prefix={
                  <LockOutlined size={18} className='mr-2 text-gray-400' />
                }
                suffix={
                  showPassword ? (
                    <EyeInvisibleOutlined
                      size={18}
                      className='mr-2 cursor-pointer text-gray-400'
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <EyeOutlined
                      size={18}
                      className='mr-2 cursor-pointer text-gray-400'
                      onClick={() => setShowPassword(true)}
                    />
                  )
                }
              />
              <p className='mt-2 text-sm text-gray-400'>
                *Please enter your password with a combination of{' '}
                <span className='font-semibold'>
                  your date of birth and last 5 characters of NRIC.
                </span>
              </p>
              <p className='mt-2 text-sm text-gray-400'>
                {' '}
                E.g <span className='font-semibold'>300619701234J</span>
              </p>
            </Form.Item>
            {(error || messageError !== '') && (
              <div className='mt-2 flex w-full flex-row items-start gap-2 rounded-lg border border-[#FFC9C9] bg-[#FEF2F2] p-2 font-normal text-[#E7000B]'>
                <InfoCircleOutlined className='mt-1' />
                <p>{messageError}</p>
              </div>
            )}
            <PrimaryButton
              htmlType='submit'
              loading={isPendingSignIn || isPendingTimeout}
              disabled={isPending || isPendingSignIn || isPendingTimeout}
              className='w-full bg-[#02ADEF] px-1 py-2 font-normal leading-4 text-white'
            >
              Sign in
            </PrimaryButton>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
};

export default LoginRenewalPage;
