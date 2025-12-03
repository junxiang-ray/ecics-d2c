'use client';

import { ROUTES } from '@/constants/routes';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/redux/store';

import { Button, Divider, Form, Spin } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import MailOutlined from '@/components/icons/MailIcon';
import { PrimaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';

const FORM_ITEM = {
  EMAIL: 'email',
  PASSWORD: 'password',
} as const;

const schema = z.object({
  [FORM_ITEM.EMAIL]: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  [FORM_ITEM.PASSWORD]: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
});

type FormValues = Record<keyof typeof FORM_ITEM, string>;

const LoginPage = (): JSX.Element => {
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [systemMaintain, setSystemMaintain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitSigninRenewal = (values: FormData): void => {
    // todo: Impl logic call Api login by email
  };

  const onRequestSignSingpass = (): void => {
    // todo: Impl logic call Api singpass
    // Temporary bypass the login and go straight into the home page.
    setIsLoading(true);
    setTimeout(() => {
      router.push(ROUTES.PORTAL.HOME.ROOT);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div
      className='flex h-screen w-full flex-row items-center justify-center bg-white bg-contain bg-no-repeat px-4 [background-position:bottom_right]'
      style={{ backgroundImage: "url('/img-error.png')" }}
    >
      <div className='z-2 relative flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-6 shadow-lg md:max-w-[480px]'>
        <img src='/ecics.svg' alt='ecics' />
        <p className='font-heading text-foreground mb-0 mt-6 text-4xl font-bold'>
          Client Portal
        </p>
        <p className='mb-5 text-xl text-[#717182]'>
          Local & Homegrown since 1975
        </p>
        <Button
          className='shadow- w-full rounded-lg bg-[#F4333D] py-5 text-center font-semibold text-white'
          onClick={onRequestSignSingpass}
        >
          Log in with Singpass
        </Button>
        {systemMaintain && (
          <div className='mt-2 flex w-full flex-row items-start gap-2 rounded-lg border border-[#FFC9C9] bg-[#FEF2F2] p-2 font-normal text-[#E7000B]'>
            <InfoCircleOutlined className='mt-1' />
            <p>
              SingPass is currently under maintenance. Please try again later or
              use your Vehicle Registration Number and Password to login.
            </p>
          </div>
        )}
        <div className='flex w-full flex-row items-center justify-center gap-6'>
          <Divider className='font-body my-2 border-gray-200 text-gray-500'>
            or continue with email
          </Divider>
        </div>
        <FormProvider {...methods}>
          <Form
            form={form}
            layout='vertical'
            className='flex w-full flex-col gap-4'
            autoComplete='off'
            onFinish={handleSubmit(onSubmitSigninRenewal)}
          >
            <Form.Item
              name={FORM_ITEM.EMAIL}
              validateStatus={errors[FORM_ITEM.EMAIL] ? 'error' : ''}
            >
              <InputField
                name={FORM_ITEM.EMAIL}
                label='Email address'
                placeholder='Enter your email address'
                autoComplete='email'
                isRequired
                prefix={
                  <MailOutlined size={16} className='mr-2 text-gray-400' />
                }
                autoFocus
              />
              <p id='email-help' className='font-body text-xs text-gray-400'>
                We'll use this to send you important updates
              </p>
            </Form.Item>
            <Form.Item
              name={FORM_ITEM.PASSWORD}
              validateStatus={errors[FORM_ITEM.PASSWORD] ? 'error' : ''}
            >
              <InputField
                type={showPassword ? 'text' : 'password'}
                name={FORM_ITEM.PASSWORD}
                label='Password'
                isRequired
                placeholder='Enter your password'
                autoComplete='new-password'
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
              <p id='password-help' className='font-body text-xs text-gray-400'>
                Your password is encrypted and stored securely
              </p>
            </Form.Item>
            {errMsg && (
              <div className='mt-2 flex w-full flex-row items-start gap-2 rounded-lg border border-[#FFC9C9] bg-[#FEF2F2] p-2 font-normal text-[#E7000B]'>
                <InfoCircleOutlined className='mt-1' />
                <p>{errMsg}</p>
              </div>
            )}
            <PrimaryButton
              htmlType='submit'
              className='w-full bg-[#02ADEF] px-1 py-2 font-normal leading-4 text-white'
            >
              Sign in
            </PrimaryButton>
          </Form>
        </FormProvider>
      </div>
      {isLoading && <Spin fullscreen />}
    </div>
  );
};
export default LoginPage;
