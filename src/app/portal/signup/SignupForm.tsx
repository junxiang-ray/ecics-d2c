'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, notification } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { PrimaryButton, LinkButton } from '@/components/ui/buttons';
import { InputFieldWithIcon } from '@/components/ui/form/inputfield';
import { ShieldIcon } from '@/components/icons/renewal-icons';

import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { ROUTES } from '@/constants/routes';
import ModalVerify from '@/app/renewal/profile/ModalVerify';

type SignupFormProps = {
  nric: string;
};

/* ----------------------------------
 * Validation schema
 * ---------------------------------- */
const schema = z.object({
  email_address: z
    .string({
      required_error: 'Email address is required',
    })
    .regex(emailRegex, 'Please enter a valid email address.'),

  phone_number: z
    .string({
      required_error: 'Phone number is required',
    })
    .length(8, "Please enter an 8-digit number starting with '8' or '9'.")
    .regex(
      phoneRegex,
      "Please enter an 8-digit number starting with '8' or '9'.",
    ),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters'),

  // 🔒 Auth-derived, hidden
  nric: z.string(),
});

type FormData = z.infer<typeof schema>;

const SignupForm = ({ nric }: SignupFormProps) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { isMobile } = useDeviceDetection();

  // 🔐 OTP state
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState<string | null>(null);
  const [signupNric, setSignupNric] = useState<string | null>(null);
  const [signupPhone, setsignupPhone] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      nric,
    },
  });

  /* ----------------------------------
   * Step 1: Submit signup form
   * ---------------------------------- */
  const handleSubmit = async (value: FormData) => {
    try {
      setIsSubmitting(true);

      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(value),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Signup failed');
      }

      // 🔐 OTP required → open modal
      if (data.status === 'OTP_REQUIRED') {
        setSignupEmail(data.email);
        setsignupPhone(data.phone);
        setSignupNric(data.nric);
        setIsOtpOpen(true);
        notification.success({
          message: 'Verification code sent',
          description: `Please check your email (${data.email}) for the OTP.`,
        });
        return;
      }

      // If no OTP required (fallback), redirect to login
      router.push(ROUTES.PORTAL.LOGIN);
    } catch (err: any) {
      console.error('Signup error:', err);
      notification.error({
        message: 'Signup failed',
        description: err.message || 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ----------------------------------
   * Step 2: Verify OTP
   * ---------------------------------- */
  // SignupForm.tsx - Update handleVerifyOtp
  const handleVerifyOtp = async (code: string) => {
    try {
      if (!signupEmail || !signupNric) {
        // Need both email and NRIC
        throw new Error('Missing signup session');
      }

      // Step 1: Verify OTP
      const verifyRes = await fetch('/api/v1/auth/signup/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: signupEmail,
          code,
        }),
      });

      let verifyData;
      try {
        verifyData = await verifyRes.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      if (!verifyRes.ok) {
        const errorMessage =
          verifyData?.message ||
          verifyData?.error ||
          `Error ${verifyRes.status}`;
        throw new Error(errorMessage);
      }

      // Step 2: OTP verified - now do custom auth to get tokens
      notification.success({
        message: 'Account verified!',
        description: 'Logging you in...',
      });

      // Call custom auth endpoint with NRIC
      const authRes = await fetch('/api/v1/auth/cognito-custom-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: signupEmail,
          nric: signupNric, // Pass NRIC from state
          phone: signupPhone, // Add this
        }),
      });

      const authData = await authRes.json();

      if (!authRes.ok || !authData.success) {
        throw new Error(authData?.message || 'Login failed after verification');
      }

      // Success - cookie is set by API route, redirect to portal
      setIsOtpOpen(false);
      router.push(ROUTES.PORTAL.HOME.ROOT);
    } catch (err: any) {
      console.error('OTP verification error:', err);
      notification.error({
        message: 'Verification failed',
        description: err.message || 'Invalid code. Please try again.',
      });
    }
  };

  /* ----------------------------------
   * Resend OTP
   * ---------------------------------- */
  const handleResendOtp = async () => {
    try {
      // TODO: Implement resend OTP endpoint
      notification.info({
        message: 'Code resent',
        description: 'Please check your email for the new code.',
      });
    } catch (err) {
      notification.error({
        message: 'Failed to resend code',
        description: 'Please try again later.',
      });
    }
  };

  return (
    <>
      <div className='mb-[40px] mt-[20px] flex min-h-screen flex-col items-center bg-gray-50'>
        <FormProvider {...methods}>
          <Form
            form={form}
            onFinish={methods.handleSubmit(handleSubmit)}
            scrollToFirstError={{
              behavior: 'smooth',
              block: 'center',
            }}
            className='w-full max-w-md rounded-lg border border-gray-300 bg-white p-6'
          >
            {/* Icon */}
            <div className='mb-6 flex justify-center'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                <ShieldIcon className='text-[#155DFC]' size={24} />
              </div>
            </div>

            {/* Title */}
            <h2 className='mb-2 text-center text-2xl font-bold'>
              Create Your Account
            </h2>

            <p className='mb-6 text-center text-sm text-gray-600'>
              Complete your account setup to access the Client Portal.
            </p>

            {/* Email */}
            <InputFieldWithIcon
              name='email_address'
              label='Email Address'
              isRequired
              type='email'
              placeholder='Enter your email address'
            />

            {/* Phone */}
            <InputFieldWithIcon
              name='phone_number'
              label='Phone Number'
              type='tel'
              isRequired
              placeholder='Enter your phone number'
            />

            {/* Password */}
            <InputFieldWithIcon
              name='password'
              label='Password'
              isRequired
              type='password'
              placeholder='Create a password'
              helperText='Password must be at least 8 characters'
            />

            {/* 🔒 Hidden NRIC */}
            <input type='hidden' {...methods.register('nric')} />

            {/* Info box */}
            <div className='mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs font-semibold text-blue-700'>
              Your identity has been verified via Singpass. NRIC is securely
              linked to your account and cannot be changed.
            </div>

            {/* Submit */}
            <PrimaryButton
              onClick={() => form.submit()}
              className='w-full bg-green-promo'
              loading={isSubmitting}
            >
              Create Account
            </PrimaryButton>
          </Form>
        </FormProvider>

        {/* Footer */}
        <div
          className={`mt-6 text-center ${
            isMobile ? 'text-xs font-normal' : 'text-xs'
          }`}
          style={{ maxWidth: '350px' }}
        >
          <span>
            By continuing, you agree to our{' '}
            <LinkButton
              type='link'
              className='h-0 px-0 text-xs'
              href='https://www.ecics.com/documents/website-use-terms-and-conditions.pdf '
              target='_blank'
            >
              Terms of Use
            </LinkButton>
            {' and '}
            <LinkButton
              type='link'
              className='h-0 px-0 text-xs'
              href='https://www.ecics.com/privacy-policy '
              target='_blank'
            >
              Privacy Policy
            </LinkButton>
          </span>
        </div>
      </div>

      {/* 🔐 OTP Verification Modal */}
      <ModalVerify
        isOpen={isOtpOpen}
        onClose={setIsOtpOpen}
        title='Verify your email'
        destinationLabel={signupEmail || 'your email'}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </>
  );
};

export default SignupForm;
