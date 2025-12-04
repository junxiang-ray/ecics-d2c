'use client';

import { MaritalStatus } from '@/libs/types/common';
import {
  UserProfile,
  UserProfileUpdatePayload,
} from '@/libs/types/user-profile';
import { useUpdateUserInfo } from '@/hook/user-profile/user-profile';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { updateUser } from '@/redux/slices/portalUser.slice';

import { Divider, Form, notification } from 'antd';
import { MehOutlined } from '@ant-design/icons';
import BtnEdit from './components/BtnEdit';
import BtnGroup from './components/ButtonGroups';
import PersonalInfoForm from './components/PersonalInfoForm';
import ContactForm from './components/ContactForm';
import RegisteredAddressForm from './components/RegisteredAddressForm';
import SecurityNotice from './components/SercurityNotice';

export const FORM_ITEM = {
  NAME: 'name',
  GENDER: 'gender',
  MARITAL_STATUS: 'marital_status',
  EMAIL: 'email',
  PHONE: 'phone',
  ADDRESS_1: 'address_1',
  ADDRESS_2: 'address_2',
  ADDRESS_3: 'address_3',
  POSTAL_CODE: 'postal_code',
} as const;

export type UserUpdateResponse<T> = {
  success: boolean;
  data?: T;
};

export type FormValues = Omit<
  Record<(typeof FORM_ITEM)[keyof typeof FORM_ITEM], string>,
  'marital_status'
> & {
  [FORM_ITEM.MARITAL_STATUS]: MaritalStatus;
};

const schema = z.object({
  [FORM_ITEM.NAME]: z.string(),
  [FORM_ITEM.GENDER]: z.string(),
  [FORM_ITEM.MARITAL_STATUS]: z.string().min(1, 'Marital Status is required'),
  [FORM_ITEM.EMAIL]: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Please enter a valid email address' }),
  [FORM_ITEM.PHONE]: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^\+\d{1,3} [89]\d{3} \d{4}$/, {
      message: 'Please enter a valid phone number',
    }),
  [FORM_ITEM.ADDRESS_1]: z.string().min(1, 'Field is required'),
  [FORM_ITEM.ADDRESS_2]: z.string().min(1, 'Field is required'),
  [FORM_ITEM.ADDRESS_3]: z.string().min(1, 'Field is required'),
  [FORM_ITEM.POSTAL_CODE]: z.string().min(1, 'Field is required'),
});

const PersonalInfo = (): JSX.Element => {
  const user: UserProfile | null = useAppSelector(
    (state) => state.portalUserInfo.user,
  );
  const dispatch = useAppDispatch();
  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      [FORM_ITEM.NAME]: user?.name,
      [FORM_ITEM.GENDER]: user?.gender,
      [FORM_ITEM.MARITAL_STATUS]: user?.marital_status,
      [FORM_ITEM.EMAIL]: user?.email,
      [FORM_ITEM.PHONE]: user?.phone,
      [FORM_ITEM.ADDRESS_1]: user?.address?.address_line_1,
      [FORM_ITEM.ADDRESS_2]: user?.address?.address_line_2,
      [FORM_ITEM.ADDRESS_3]: user?.address?.address_line_3,
      [FORM_ITEM.POSTAL_CODE]: user?.address?.postal_code,
    },
  });
  const {
    formState: { isValid },
    getValues,
    reset,
    handleSubmit,
  } = methods;

  const { mutate, isPending } = useUpdateUserInfo();

  const showErrorNoti = (message: string): void => {
    api.error({ message, icon: <MehOutlined className='text-red-400' /> });
  };

  const onSubmnit = (): Promise<void> => {
    const formValues: FormValues = getValues() as unknown as FormValues;
    const payload: UserProfileUpdatePayload = {
      marital_status: formValues[FORM_ITEM.MARITAL_STATUS],
      email: formValues[FORM_ITEM.EMAIL],
      phone: formValues[FORM_ITEM.PHONE],
      address: {
        address_line_1: formValues[FORM_ITEM.ADDRESS_1],
        address_line_2: formValues[FORM_ITEM.ADDRESS_2],
        address_line_3: formValues[FORM_ITEM.ADDRESS_3],
        postal_code: formValues[FORM_ITEM.POSTAL_CODE],
      },
    };

    return new Promise<void>((resolve, reject) => {
      mutate(payload, {
        onSuccess: () => {
          api.success({ message: 'Success' });
          disableEdit();
          reset({
            [FORM_ITEM.NAME]: formValues[FORM_ITEM.NAME],
            [FORM_ITEM.GENDER]: formValues[FORM_ITEM.GENDER],
            [FORM_ITEM.MARITAL_STATUS]: payload.marital_status,
            [FORM_ITEM.EMAIL]: payload.email,
            [FORM_ITEM.PHONE]: payload.phone,
            [FORM_ITEM.ADDRESS_1]: payload.address.address_line_1,
            [FORM_ITEM.ADDRESS_2]: payload.address.address_line_2,
            [FORM_ITEM.ADDRESS_3]: payload.address.address_line_3,
            [FORM_ITEM.POSTAL_CODE]: payload.address.postal_code,
          });

          dispatch(
            updateUser({
              name: formValues[FORM_ITEM.NAME],
              gender: formValues[FORM_ITEM.GENDER],
              phone: payload.phone,
              email: payload.email,
              marital_status: payload.marital_status,
              address: {
                address_line_1: payload.address.address_line_1,
                address_line_2: payload.address.address_line_2,
                address_line_3: payload.address.address_line_3,
                postal_code: payload.address.postal_code,
              },
            }),
          );
        },
        onError: () => {
          api.error({ message: 'Failed!' });
        },
      });
    });
  };

  const enableEdit = useCallback<() => void>((): void => setIsEdit(true), []);
  const disableEdit = useCallback<() => void>(() => setIsEdit(false), []);

  return (
    <>
      <div>
        <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 pt-5 shadow-sm'>
          <FormProvider {...methods}>
            <Form
              form={form}
              layout='vertical'
              className='[&>:not(:last-child)]:mb-6'
              disabled={isPending}
              onFinish={handleSubmit(onSubmnit)}
            >
              <div>
                <div className='flex items-center justify-between gap-2'>
                  <div className='font-heading pb-2 text-base font-semibold text-gray-900'>
                    Personal Info
                  </div>
                  <BtnEdit hidden={isEdit} onClick={enableEdit} />
                </div>
                <Divider className='m-0 mb-4' />
                <PersonalInfoForm isEdit={isEdit} />
              </div>
              <div>
                <div className='font-heading pb-2 text-base font-semibold text-gray-900'>
                  Contact Info
                </div>
                <Divider className='m-0 mb-4' />
                <ContactForm isEdit={isEdit} />
              </div>
              <div>
                <div className='font-heading pb-2 text-base font-semibold text-gray-900'>
                  Registered Address
                </div>
                <Divider className='m-0 mb-4' />
                <RegisteredAddressForm isEdit={isEdit} />
              </div>
              <BtnGroup
                hidden={!isEdit}
                loading={isPending}
                onCancel={disableEdit}
              />
            </Form>
          </FormProvider>
        </div>
        <SecurityNotice />
      </div>
      {contextHolder}
    </>
  );
};
export default PersonalInfo;
