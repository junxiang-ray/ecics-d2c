'use client';

import { useMemo } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Divider, Form, Input, notification } from 'antd';

import { useChangePassword } from '@/hook/user-profile/user-profile';
import PasswordRequirements, {
  validatePasswordRequirements,
} from './components/PasswordRequirements';

const ENABLE_CHANGE_PASSWORD =
  process.env.NEXT_PUBLIC_ENABLE_CHANGE_PASSWORD === 'true';

export const FORM_ITEM = {
  PASSWORD_OLD: 'password_old',
  PASSWORD_NEW: 'password_new',
  PASSWORD_CONFIRM: 'password_confirm',
} as const;

type FormData = Record<(typeof FORM_ITEM)[keyof typeof FORM_ITEM], string>;

const schema = z
  .object({
    [FORM_ITEM.PASSWORD_OLD]: z.string().min(1, 'Current password is required'),
    [FORM_ITEM.PASSWORD_NEW]: z.string().min(1, 'New password is required'),
    [FORM_ITEM.PASSWORD_CONFIRM]: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data: FormData) => data.password_new === data.password_confirm, {
    message: 'Passwords do not match',
    path: [FORM_ITEM.PASSWORD_CONFIRM],
  });

const ChangePassword = (): JSX.Element => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = methods;

  // ⭐ Watch passwords for validation
  const newPassword = watch(FORM_ITEM.PASSWORD_NEW);
  const confirmPassword = watch(FORM_ITEM.PASSWORD_CONFIRM);

  // ⭐ Check if all requirements are met
  const allRequirementsMet = useMemo(() => {
    const { isValid } = validatePasswordRequirements(
      newPassword,
      confirmPassword,
    );
    return isValid;
  }, [newPassword, confirmPassword]);

  const { mutate: sendChangePassword, isPending } = useChangePassword();

  const onSubmit = (): void => {
    const formData: FormData = getValues();

    sendChangePassword(
      {
        oldPassword: formData[FORM_ITEM.PASSWORD_OLD],
        newPassword: formData[FORM_ITEM.PASSWORD_NEW],
      },
      {
        onSuccess: () => {
          api.success({ message: 'Password changed successfully' });
          reset();
        },
        onError: (error: any) => {
          const message = error?.message || 'Failed to change password';
          api.error({ message });
        },
      },
    );
  };

  const iconRender = (visible: boolean): JSX.Element =>
    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />;

  return (
    <>
      <div>
        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='font-heading text-base font-semibold'>
            Change Password
          </h3>
          <Divider className='mb-4 mt-2' />
          <FormProvider {...methods}>
            <Form
              form={form}
              layout='vertical'
              className='[&>:not(:last-child)]:mb-6 [&_.ant-form-item-label_label]:font-normal'
              onFinish={handleSubmit(onSubmit)}
            >
              <Controller
                name={FORM_ITEM.PASSWORD_OLD}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label='Current Password'
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                  >
                    <Input.Password
                      placeholder='Enter current password'
                      size='large'
                      iconRender={iconRender}
                      {...field}
                    />
                  </Form.Item>
                )}
              />

              <Controller
                name={FORM_ITEM.PASSWORD_NEW}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label='New Password'
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                  >
                    <Input.Password
                      placeholder='Enter new password'
                      size='large'
                      iconRender={iconRender}
                      {...field}
                    />
                  </Form.Item>
                )}
              />

              <PasswordRequirements />

              <Controller
                name={FORM_ITEM.PASSWORD_CONFIRM}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label='Confirm New Password'
                    validateStatus={
                      fieldState.error
                        ? 'error'
                        : errors.password_confirm
                          ? 'error'
                          : ''
                    }
                    help={
                      fieldState.error?.message ||
                      errors.password_confirm?.message
                    }
                  >
                    <Input.Password
                      placeholder='Confirm new password'
                      size='large'
                      iconRender={iconRender}
                      {...field}
                    />
                  </Form.Item>
                )}
              />

              <Button
                className='w-full bg-[#52c41a] text-base text-white transition-colors hover:bg-[#52c41a]/90 disabled:cursor-not-allowed disabled:opacity-50 [&_.ant-btn-loading-icon]:pb-1 [&_.ant-btn-loading-icon]:leading-none'
                color='green'
                variant='filled'
                size='large'
                disabled={!allRequirementsMet || isPending}
                loading={isPending}
                htmlType='submit'
              >
                Change Password
              </Button>
            </Form>
          </FormProvider>
        </div>
      </div>
      {contextHolder}
    </>
  );
};

export default ChangePassword;
