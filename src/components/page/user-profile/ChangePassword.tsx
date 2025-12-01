'use client';

import { REGEX } from '@/constants/validation.constant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import {
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MehOutlined,
} from '@ant-design/icons';
import { Button, Divider, Form, Input, notification } from 'antd';
import PasswordRequirements from './components/PasswordRequirements';
import { useChangePassword } from '@/hook/user-profile/user-profile';

export const FORM_ITEM = {
  PASSWORD_NEW: 'password_new',
  PASSWORD_CONFIRM: 'password_confirm',
} as const;

type FormData = Record<(typeof FORM_ITEM)[keyof typeof FORM_ITEM], string>;

const schema = z
  .object({
    [FORM_ITEM.PASSWORD_NEW]: z
      .string()
      .min(8, { message: 'ERR_MIN_LENGTH' })
      .regex(REGEX.UPPERCASE, { message: 'ERR_UPPER_CASE' })
      .regex(REGEX.LOWERCASE, { message: 'ERR_LOWER_CASE' })
      .regex(REGEX.DIGITS, { message: 'ERR_DIGITS' })
      .regex(REGEX.SPECIAL_CHARACTER, { message: 'ERR_SPECIAL_CHAR' }),
    [FORM_ITEM.PASSWORD_CONFIRM]: z.string(),
  })
  .refine((data: FormData) => data.password_new === data.password_confirm, {
    message: 'ERR_NOT_MATCH',
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
    control,
    getValues,
    reset,
    formState: { isValid },
  } = methods;
  const { mutate: sendChangePassword, isPending } = useChangePassword();

  const onSubmit = (): void => {
    const formData: FormData = getValues();
    sendChangePassword(formData[FORM_ITEM.PASSWORD_NEW], {
      onSuccess: () => {
        api.error({
          message: 'Change password success',
          icon: <CheckCircleOutlined className='text-green-400' />,
        });
        reset();
      },
      onError: () => {
        api.error({
          message: 'Change password failed!',
          icon: <MehOutlined className='text-red-400' />,
        });
      },
    });
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
              className='[&>:not(:last-child)]:mb-8 [&_.ant-form-item-label_label]:font-normal'
              onFinish={handleSubmit(onSubmit)}
            >
              <Controller
                name={FORM_ITEM.PASSWORD_NEW}
                render={({ field, fieldState }) => (
                  <Form.Item label='Change Password'>
                    <Input.Password
                      placeholder='Enter new password'
                      size='large'
                      iconRender={iconRender}
                      {...field}
                    />
                  </Form.Item>
                )}
              />
              <Controller
                name={FORM_ITEM.PASSWORD_CONFIRM}
                render={({ field, fieldState }) => (
                  <Form.Item label='Confirm New Password'>
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
              <Button
                className='w-full bg-[#52c41a] text-base text-white transition-colors hover:bg-[#52c41a]/90 disabled:cursor-not-allowed disabled:opacity-50'
                color='green'
                variant='filled'
                size='large'
                disabled={!isValid}
                loading={isPending}
                onClick={onSubmit}
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
