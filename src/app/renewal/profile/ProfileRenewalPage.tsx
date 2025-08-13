'use client';

import { useState } from 'react';
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { InputField } from '@/components/ui/form/inputfield';
import IconEditDriver from '@/components/icons/EditDriver';
import { useRouter } from 'next/navigation';
import ModalVerify from './ModalVerify';

const schema = z.object({
  name: z.string(),
  email: z.string().email('Invalid email'),
  phone: z.string().nonempty('This field is required'),
});

type FormData = z.infer<typeof schema>;
type EditField = keyof FormData | null;

export default function ProfileRenewalPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [editingField, setEditingField] = useState<EditField>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const {
    reset,
    formState: { errors },
  } = methods;

  const handleCancel = () => {
    reset();
    setEditingField(null);
  };

  const handleSaveChanges = (field: EditField) => {
    if (field === 'email') {
      setIsEmailModalOpen(true);
    }
  };

  const renderActionButtons = (field: EditField) => {
    if (editingField !== field) return null;
    return (
      <div className='mt-2 flex w-full justify-between gap-3'>
        <Button
          className='w-[50%] rounded-lg border-none bg-blue-600 px-6 py-5 text-white hover:bg-blue-700'
          onClick={() => handleSaveChanges(field)}
        >
          Save Changes
        </Button>
        <Button
          className='w-[50%] rounded-lg border-none bg-gray-200 px-6 py-5 text-black'
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    );
  };

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='relative flex h-[56px] w-full flex-row items-center justify-center border-b border-gray-200'>
        <div
          className='absolute left-4 cursor-pointer md:left-14'
          onClick={() => {
            router.push('/renewal');
          }}
        >
          <ArrowLeftOutlined />
        </div>
        <p className='font-semibold'>Profile</p>
      </div>

      <div className='flex w-full flex-col justify-center p-3'>
        <div className='mx-auto w-full max-w-[550px] rounded-md border border-gray-200 bg-white p-6 shadow-md'>
          <div className='mb-6 flex items-center gap-4'>
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-500'>
              <UserOutlined />
            </div>
            <div>
              <p className='text-lg font-semibold'>John Doe</p>
              <p className='text-sm text-gray-500'>Policy Holder</p>
            </div>
          </div>

          <FormProvider {...methods}>
            <Form form={form} layout='vertical' className='flex flex-col gap-4'>
              <Form.Item
                name='name'
                validateStatus={errors['name'] ? 'error' : ''}
              >
                <InputField
                  name='name'
                  label='Full Name'
                  disabled={editingField !== 'name'}
                  suffix={
                    <span className='rounded-sm px-2 text-[12px]'>
                      Read only
                    </span>
                  }
                  defaultValue={'John Doe'}
                />
              </Form.Item>

              <Form.Item
                name='email'
                validateStatus={errors['email'] ? 'error' : ''}
              >
                <InputField
                  name='email'
                  label='Email Address'
                  disabled={editingField !== 'email'}
                  prefix={<MailOutlined className='mr-2' />}
                  placeholder='john.doe@email.com'
                  suffix={
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingField('email');
                      }}
                      className='cursor-pointer'
                    >
                      <IconEditDriver size={14} className='text-blue-600' />
                    </span>
                  }
                />
                {renderActionButtons('email')}
              </Form.Item>

              <Form.Item
                name='phone'
                validateStatus={errors['phone'] ? 'error' : ''}
              >
                <InputField
                  name='phone'
                  label='Phone Number'
                  disabled={editingField !== 'phone'}
                  prefix={<PhoneOutlined className='mr-2' />}
                  placeholder='+65 9123 4567'
                  suffix={
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingField('phone');
                      }}
                      className='cursor-pointer'
                    >
                      <IconEditDriver size={14} className='text-blue-600' />
                    </span>
                  }
                />
                {renderActionButtons('phone')}
              </Form.Item>
            </Form>
          </FormProvider>

          <div className='mt-6 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700'>
            <div className='flex items-center gap-2'>
              <SafetyOutlined className='text-[13px]' />
              Security Notice
            </div>
            <p className='text-[12px]'>
              Changes to your email address or phone number require SMS
              verification for security purposes. You will receive a 6-digit
              verification code to confirm the changes.
            </p>
          </div>
        </div>
      </div>

      <ModalVerify
        isOpen={isEmailModalOpen}
        onClose={(isOpen) => setIsEmailModalOpen(isOpen)}
      />
    </div>
  );
}
