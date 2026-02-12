//src\components\page\login\portal\LoginPage.tsx
'use client';

import { ROUTES } from '@/constants/routes';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/redux/store';
import { useRequestSignInSingpass } from '@/hook/auth/login-portal';

import { Button, Divider, Form, Spin, notification } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import MailOutlined from '@/components/icons/MailIcon';
import { PrimaryButton } from '@/components/ui/buttons';
import { InputField } from '@/components/ui/form/inputfield';
import { SingpassDownModal } from '@/components/page/login/SingpassDownModal';
import { clearUser } from '@/redux/slices/portalUser.slice';
import { useGetUserProfile } from '@/hook/user-profile/user-profile';
import Image from 'next/image';

// ✅ MFA modal (logic only – no layout impact)
import ModalVerify from '@/app/renewal/profile/ModalVerify';

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

type FormValues = Record<(typeof FORM_ITEM)[keyof typeof FORM_ITEM], string>;

const LoginPage = (): JSX.Element => {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const signoutFlg = useRef(searchParams.get('signout')).current;

  const dispatch = useAppDispatch();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors },
    getValues,
  } = methods;

  const [isVerifying, setIsVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [singpassMaintain, setSingpassMaintain] = useState(false);

  // 🔐 MFA state
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [mfaSession, setMfaSession] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState<string | null>(null);

  // ⏱️ Resend cooldown state
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const isSignOut = signoutFlg === 'true';

  const singpassLoginMutation = useRequestSignInSingpass({
    onError: () => setSingpassMaintain(true),
  });

  const userProfileQuery = useGetUserProfile(!isSignOut);

  /* ---------------- lifecycle (unchanged) ---------------- */

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (signoutFlg != null) {
      timeout = setTimeout(() => {
        router.push(ROUTES.PORTAL.LOGIN);
        setIsVerifying(false);
      }, 1500);

      if (!isSignOut) return;
      dispatch(clearUser());
    }
    return () => clearTimeout(timeout);
  }, [signoutFlg, router, isSignOut, dispatch]);

  useEffect(() => {
    if (userProfileQuery.isSuccess) {
      router.push(ROUTES.PORTAL.HOME.ROOT);
    }
  }, [userProfileQuery.isSuccess, router]);

  useEffect(() => {
    if (!userProfileQuery.isError) return;
    dispatch(clearUser());
    setIsVerifying(false);
  }, [userProfileQuery.isError, dispatch]);

  // ⏱️ Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  /* ---------------- login step 1 ---------------- */

  const onSubmitSigninRenewal = async (values: FormValues) => {
    try {
      setErrMsg(null);

      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      // 🔐 MFA required
      if (data.status === 'MFA_REQUIRED') {
        setMfaSession(data.session);
        setLoginEmail(values.email);
        setIsOtpOpen(true);
        // Start cooldown immediately when MFA modal opens
        setResendCooldown(60);
        return;
      }

      router.push(ROUTES.PORTAL.HOME.ROOT);
    } catch (err: any) {
      setErrMsg(err.message || 'Login failed');
    }
  };

  /* ---------------- login step 2 (OTP) ---------------- */

  const handleVerifyOtp = async (code: string) => {
    try {
      if (!mfaSession || !loginEmail) {
        throw new Error('Missing MFA session');
      }

      const res = await fetch('/api/v1/auth/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: loginEmail,
          code,
          session: mfaSession,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Invalid verification code');
      }

      setIsOtpOpen(false);
      router.push(ROUTES.PORTAL.HOME.ROOT);
    } catch (err: any) {
      setErrMsg(err.message || 'OTP verification failed');
    }
  };

  /* ---------------- resend OTP ---------------- */

  const handleResendOtp = async () => {
    // Get email from form if not set in state, or use loginEmail
    const emailToUse = loginEmail || getValues(FORM_ITEM.EMAIL);

    if (!emailToUse) {
      notification.error({
        message: 'Error',
        description: 'Email not found. Please try logging in again.',
      });
      return;
    }

    if (resendCooldown > 0) return; // Still in cooldown

    try {
      setIsResending(true);

      const res = await fetch('/api/v1/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to resend code');
      }

      notification.success({
        message: 'Code resent',
        description: 'Please check your email for the new verification code.',
      });

      // Reset cooldown to 60 seconds
      setResendCooldown(60);
    } catch (err: any) {
      notification.error({
        message: 'Failed to resend',
        description: err.message || 'Please try again later.',
      });
    } finally {
      setIsResending(false);
    }
  };

  const hideModalSingpassDown = useCallback(
    () => setSingpassMaintain(false),
    [],
  );

  const isShowBtnLoading = singpassLoginMutation.isPending;

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <div
        className='flex h-screen w-full flex-row items-center justify-center bg-white bg-contain bg-no-repeat px-4 [background-position:bottom_right]'
        style={{ backgroundImage: "url('/img-error.png')" }}
      >
        <div className='z-2 relative flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-6 shadow-lg md:max-w-[480px]'>
          <Image src='/ecics.svg' alt='ecics' width={120} height={40} />

          <p className='font-heading text-foreground mb-0 mt-6 text-4xl font-bold'>
            Client Portal
          </p>

          <p className='mb-5 text-xl text-[#717182]'>
            Local & Homegrown since 1975
          </p>

          <Button
            className='w-full rounded-lg bg-[#F4333D] py-5 text-center font-semibold text-white'
            onClick={() => singpassLoginMutation.mutate()}
            loading={isShowBtnLoading}
          >
            Log in with Singpass
          </Button>

          <Divider>or continue with email</Divider>

          <FormProvider {...methods}>
            <Form
              form={form}
              layout='vertical'
              className='flex w-full flex-col gap-4'
              autoComplete='off'
              disabled={isShowBtnLoading}
              onFinish={handleSubmit(onSubmitSigninRenewal)}
            >
              <Form.Item
                name={FORM_ITEM.EMAIL}
                validateStatus={errors.email ? 'error' : ''}
              >
                <InputField
                  name={FORM_ITEM.EMAIL}
                  label='Email address'
                  placeholder='Enter your email address'
                  autoComplete='email'
                  isRequired
                  prefix={<MailOutlined className='mr-2 text-gray-400' />}
                />
                <p className='text-xs text-gray-400'>
                  We'll use this to send you important updates
                </p>
              </Form.Item>

              <Form.Item
                name={FORM_ITEM.PASSWORD}
                validateStatus={errors.password ? 'error' : ''}
              >
                <InputField
                  type={showPassword ? 'text' : 'password'}
                  name={FORM_ITEM.PASSWORD}
                  label='Password'
                  isRequired
                  placeholder='Enter your password'
                  autoComplete='new-password'
                  prefix={<LockOutlined className='mr-2 text-gray-400' />}
                  suffix={
                    showPassword ? (
                      <EyeInvisibleOutlined
                        className='cursor-pointer'
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <EyeOutlined
                        className='cursor-pointer'
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                />
                <p className='text-xs text-gray-400'>
                  Your password is encrypted and stored securely
                </p>
              </Form.Item>

              {errMsg && (
                <div className='mt-2 flex gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-red-600'>
                  <InfoCircleOutlined />
                  <p>{errMsg}</p>
                </div>
              )}

              <PrimaryButton
                htmlType='submit'
                className='w-full bg-[#02ADEF]'
                loading={isShowBtnLoading}
              >
                Sign in
              </PrimaryButton>
            </Form>
          </FormProvider>
        </div>
      </div>

      {/* 🔐 MFA Modal with resend functionality */}
      <ModalVerify
        isOpen={isOtpOpen}
        onClose={setIsOtpOpen}
        title='Verify your login'
        destinationLabel={loginEmail || 'your email'}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        resendCooldown={resendCooldown}
        isResending={isResending}
      />

      <SingpassDownModal
        visible={singpassMaintain}
        onExit={hideModalSingpassDown}
      />

      {(isVerifying || userProfileQuery.isFetching) && (
        <Spin fullscreen delay={150} />
      )}
    </>
  );
};

export default LoginPage;
