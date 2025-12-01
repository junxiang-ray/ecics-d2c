'use client';

import { phoneRegex } from '@/constants/validation.constant';
import { MARITAL_STATUS, MARITAL_STATUS_OPTIONS } from '@/constants/user';

import type { AxiosResponse, AxiosError } from 'axios';
import { MaritalStatus, Gender, Address } from '@/libs/types/common';
import { UserProfile } from '@/libs/types/user-profile';

import { Observable, timer, map, catchError, of } from 'rxjs';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { updateUser } from '@/redux/slices/portalUser.slice';
import {
  updateMaritalStatus,
  updateEmail,
  updatePhone,
  updateAddress,
} from '@/hook/user-profile/user-profile';

import { Input, Divider, Form, Select, notification } from 'antd';
import { CheckCircleOutlined, MehOutlined } from '@ant-design/icons';

import FormItem from './components/FormItem';
import FormItemGroup from './components/FormItemGroup';
import BtnEdit from './components/BtnEdit';
import MailOutlined from '@/assets/icons/basic-detail/mail.svg';
import PhoneOutlined from '@/assets/icons/basic-detail/phone.svg';
import ShieldOutlined from '@/assets/icons/renewal/shield.svg';

const FORM_ITEM = {
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

type FormValues = Omit<
  Record<(typeof FORM_ITEM)[keyof typeof FORM_ITEM], string>,
  'marital_status'
> & {
  [FORM_ITEM.MARITAL_STATUS]: MaritalStatus;
};

type AddressGroupValues = Pick<
  FormValues,
  'address_1' | 'address_2' | 'address_3' | 'postal_code'
>;

const schema = z.object({
  [FORM_ITEM.MARITAL_STATUS]: z.string().min(1, 'Marital Status is required'),
  [FORM_ITEM.EMAIL]: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Please enter a valid email address' }),
  [FORM_ITEM.PHONE]: z
    .string()
    .min(1, 'Phone is required')
    .regex(phoneRegex, { message: 'Please enter a valid phone number' }),
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
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      [FORM_ITEM.MARITAL_STATUS]: user?.marital_status,
      [FORM_ITEM.EMAIL]: user?.email,
      [FORM_ITEM.PHONE]: user?.phone,
      [FORM_ITEM.ADDRESS_1]: user?.address?.address_line_1,
      [FORM_ITEM.ADDRESS_2]: user?.address?.address_line_2,
      [FORM_ITEM.ADDRESS_3]: user?.address?.address_line_3,
      [FORM_ITEM.POSTAL_CODE]: user?.address?.postal_code,
    },
  });

  const showErrorNoti = (message: string): void => {
    api.error({ message, icon: <MehOutlined className='text-red-400' /> });
  };

  const handleRespErr =
    <T,>() =>
    (err: AxiosError): Observable<UserUpdateResponse<T>> => {
      showErrorNoti('Update failed!');
      return of({} as UserUpdateResponse<T>);
    };

  const saveMaritalStatus = (
    value: MaritalStatus,
  ): Observable<UserUpdateResponse<MaritalStatus>> => {
    return updateMaritalStatus(value).pipe(
      map(() => {
        dispatch(updateUser({ marital_status: value }));
        return {
          success: true,
          data: value,
        } as UserUpdateResponse<MaritalStatus>;
      }),
      catchError(handleRespErr<MaritalStatus>()),
    );
  };

  const saveEmail = (value: string): Observable<UserUpdateResponse<string>> => {
    return updateEmail(value).pipe(
      map(() => {
        dispatch(updateUser({ email: value }));
        return { success: true, data: value } as UserUpdateResponse<string>;
      }),
      catchError(handleRespErr<string>()),
    );
  };

  const savePhone = (value: string): Observable<UserUpdateResponse<string>> => {
    return updatePhone(value).pipe(
      map(() => {
        dispatch(updateUser({ phone: value }));
        return { success: true, data: value } as UserUpdateResponse<string>;
      }),
      catchError(handleRespErr<string>()),
    );
  };

  const saveAddress = (
    value: Address,
  ): Observable<UserUpdateResponse<Address>> => {
    return updateAddress(value).pipe(
      map(() => {
        dispatch(updateUser({ address: value }));
        return { success: true, data: value } as UserUpdateResponse<Address>;
      }),
      catchError(handleRespErr<Address>()),
    );
  };

  return (
    <>
      <div>
        <div className='mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <FormProvider {...methods}>
            <Form
              form={form}
              layout='vertical'
              className='[&>:not(:last-child)]:mb-8'
            >
              <div>
                <h3 className='pb-2 font-heading text-base font-semibold text-gray-900'>
                  Personal Info
                </h3>
                <Divider className='m-0 mb-4' />
                <div className='grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2'>
                  <div className=''>
                    <label className='block font-body text-sm font-medium text-gray-700'>
                      Full Name
                    </label>
                    <div className='flex h-12 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 opacity-75'>
                      <span className='font-body text-base text-gray-900'>
                        {user?.name}&nbsp;
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className='block font-body text-sm font-medium text-gray-700'>
                      Gender
                    </label>
                    <div className='flex h-12 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 opacity-75'>
                      <span className='font-body text-base capitalize text-gray-900'>
                        {user?.gender?.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <FormItem<FormValues>
                    className='md:col-span-2'
                    label='Marital Status'
                    name={FORM_ITEM.MARITAL_STATUS}
                    parser={(value) =>
                      MARITAL_STATUS[value as unknown as MaritalStatus]
                    }
                    onSubmit={(value) =>
                      saveMaritalStatus(value as unknown as MaritalStatus)
                    }
                  >
                    {({ field, fieldState }) => (
                      <Select
                        {...field}
                        className='[&_.ant-select-arrow_svg]:fill-gray-500 [&_.ant-select-selection-item]:text-base '
                        size='large'
                        options={MARITAL_STATUS_OPTIONS}
                      />
                    )}
                  </FormItem>
                </div>
              </div>
              <div>
                <h3 className='pb-2 font-heading text-base font-semibold text-gray-900'>
                  Contact Info
                </h3>
                <Divider className='m-0 mb-4' />
                <div className='grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2'>
                  <FormItem<FormValues>
                    label='Email Address'
                    name={FORM_ITEM.EMAIL}
                    prefix={<MailOutlined className='text-gray-500' />}
                    onSubmit={saveEmail}
                  >
                    {({ field, fieldState }) => (
                      <Input {...field} size='large' />
                    )}
                  </FormItem>
                  <FormItem<FormValues>
                    label='Phone Number'
                    name={FORM_ITEM.PHONE}
                    prefix={<PhoneOutlined className='text-gray-500' />}
                    onSubmit={savePhone}
                  >
                    {({ field, fieldState }) => (
                      <Input {...field} size='large' />
                    )}
                  </FormItem>
                </div>
              </div>
              <div>
                <h3 className='pb-2 font-heading text-base font-semibold text-gray-900'>
                  Registered Address
                </h3>
                <Divider className='m-0 mb-4' />
                <FormItemGroup<AddressGroupValues>
                  className='grid-row-2 grid grid-cols-2 gap-5 [&_.form-item-no-edit]:col-span-2'
                  items={[
                    {
                      label: 'Address Line 1',
                      name: FORM_ITEM.ADDRESS_1,
                      render: ({ field }) => <Input {...field} size='large' />,
                    },
                    {
                      label: 'Address Line 2',
                      name: FORM_ITEM.ADDRESS_2,
                      render: ({ field }) => <Input {...field} size='large' />,
                    },
                    {
                      label: 'Address Line 3',
                      name: FORM_ITEM.ADDRESS_3,
                      render: ({ field }) => <Input {...field} size='large' />,
                    },
                    {
                      label: 'Postal Code',
                      name: FORM_ITEM.POSTAL_CODE,
                      parser: (_, values) =>
                        `${values[FORM_ITEM.ADDRESS_3]} ${values[FORM_ITEM.POSTAL_CODE]}`,
                      render: ({ field }) => <Input {...field} size='large' />,
                    },
                  ]}
                  onSubmit={saveAddress}
                />
              </div>
            </Form>
          </FormProvider>
        </div>
        <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 pt-3'>
          <div className='grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-1'>
            <div className='mr-2 flex items-center'>
              <ShieldOutlined className='h-4 w-4 text-blue-600' />
            </div>
            <h3 className='text-base font-medium text-blue-900'>
              Security Notice
            </h3>
            <p className='col-start-2 col-end-3 text-sm text-blue-700'>
              Changes to your email address or phone number require SMS
              verification for security purposes. You will receive a 6-digit
              verification code to confirm the changes.
            </p>
          </div>
        </div>
      </div>
      {contextHolder}
    </>
  );
};
export default PersonalInfo;
