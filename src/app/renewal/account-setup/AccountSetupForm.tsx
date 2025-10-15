'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'antd';
import { FormProps } from 'antd/es/form';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ShieldIcon } from '@/components/icons/renewal-icons';
import { LinkButton, PrimaryButton } from '@/components/ui/buttons';
import { InputFieldWithIcon } from '@/components/ui/form/inputfield';

import { emailRegex, phoneRegex } from '@/constants/validation.constant';
import { useDeviceDetection } from '@/hook/useDeviceDetection';

const schema = z.object({
  email_address: z
    .string({
      required_error: 'Email address is required',
      invalid_type_error: 'Please enter a valid email address.',
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
});

type FormData = z.infer<typeof schema>;

interface AccountSetupProps extends FormProps {
  onSubmit?: (value: any) => void;
  onSaveRegister?: (fn: () => any) => void;
  isLoading?: boolean;
}

const AccountSetupForm = ({
  onSubmit,
  onSaveRegister,
  initialValues,
  isLoading = false,
  ...props
}: AccountSetupProps) => {
  const [form] = Form.useForm();
  const { isMobile } = useDeviceDetection();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    // values: initialValues,
  });

  const handleSubmit = (value: FormData) => {
    return;
  };

  return (
    <div className='mb-[40px] mt-[20px] flex min-h-screen flex-col items-center bg-gray-50'>
      <FormProvider {...methods}>
        <Form
          form={form}
          scrollToFirstError={{
            behavior: 'smooth',
            block: 'center',
          }}
          onFinish={methods.handleSubmit(handleSubmit)}
          // disabled={isLoading}
          className='w-full max-w-md rounded-lg border border-gray-300 bg-white p-6'
          {...props}
        >
          <div className='mb-6 flex justify-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
              <ShieldIcon className='text-[#155DFC]' size={24} />
            </div>
          </div>
          <h2 className='mb-2 text-center text-2xl font-bold'>
            Update Contact Information
            {/*Secure Your Account*/}
          </h2>
          <div className='mb-6 space-y-2 text-justify text-sm text-gray-600'>
            <div>
              To comply with the Monetary Authority of Singapore (MAS)
              regulations, we require all customer to provide accurate and
              up-to-date contact details during the renewal process.
            </div>
            <div>Please ensure the following information is correct:</div>
            {/*Please confirm your contact details and create a secure password to complete your policy*/}
            {/*renewal.*/}
          </div>

          <InputFieldWithIcon
            name='email_address'
            label='Email Address'
            isRequired
            type='email'
            placeholder='Enter your email address'
          />
          <InputFieldWithIcon
            name='phone_number'
            label='Phone Number'
            type='tel'
            isRequired
            placeholder='Enter your phone number'
          />
          {/*DAY1.5*/}
          {/*<InputFieldWithIcon*/}
          {/*    name="password"*/}
          {/*    label="New Password"*/}
          {/*    isRequired*/}
          {/*    type="password"*/}
          {/*    placeholder="Enter your password"*/}
          {/*    helperText="Password must be at least 8 characters with uppercase, lowercase, and numbers"*/}
          {/*/>*/}

          {/*<InputFieldWithIcon*/}
          {/*    name="confirm_password"*/}
          {/*    label="Confirm Password"*/}
          {/*    isRequired*/}
          {/*    type="password"*/}
          {/*    placeholder="Confirm your password"*/}
          {/*/>*/}

          <div className='mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-justify text-xs font-semibold text-blue-700'>
            This helps us maintain secure communication and ensures your
            insurance coverage remains valid and compliant.
            {/*DAY1.5*/}
            {/*<strong>Security Notice:</strong> Your password is encrypted and securely stored. This will be*/}
            {/*used*/}
            {/*for future logins to manage your policies.*/}
          </div>
          <div className='mb-6 space-y-2 text-left text-sm text-gray-600'>
            <div>
              If your details have changed, please update them before
              proceeding.
            </div>
            <div>Thank you for your cooperation.</div>
          </div>
          <PrimaryButton
            // loading={isPending}
            onClick={() => {
              form.submit();
            }}
            className='w-full items-center bg-green-promo'
          >
            Continue to Payment
          </PrimaryButton>
        </Form>
      </FormProvider>
      <div
        className={`mt-6 text-center ${isMobile ? 'text-xs font-normal' : 'text-xs'}`}
        style={{ maxWidth: '350px' }}
      >
        <span>
          By continuing, you agree to our <br className='block md:hidden' />
          <LinkButton
            type='link'
            className='h-0 text-wrap px-0 text-xs'
            href='https://www.ecics.com/documents/website-use-terms-and-conditions.pdf'
            target='_blank'
          >
            Terms of Use
          </LinkButton>
          {' and '}
          <LinkButton
            type='link'
            className='h-0 text-wrap px-0 text-xs'
            href='https://www.ecics.com/privacy-policy'
            target='_blank'
          >
            Privacy Policy
          </LinkButton>
        </span>
      </div>
    </div>
  );
};

export default AccountSetupForm;
