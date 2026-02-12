'use client';

import { PolicyHolder } from '@/libs/types/policy';
import { useAppSelector } from '@/redux/store';

import Card from './PolicyCard';
import UserOutlined from '@/assets/icons/renewal/policy-holder.svg';

interface Props {
  data?: PolicyHolder;
}

const PolicyholderDetail = ({ data }: Props): JSX.Element | null => {
  const user = useAppSelector((state) => state.portalUserInfo.user);

  if (!data) return null;

  const row = (
    label: string,
    content?: JSX.Element | string | number,
    className?: string,
  ): JSX.Element => {
    return (
      <div>
        <label className='font-body mb-1.5 block text-sm font-medium text-gray-700'>
          {label}
        </label>
        <p
          className={`font-body text-base font-semibold text-gray-900 opacity-80 ${className ?? ''}`}
        >
          {content || '-'}
        </p>
      </div>
    );
  };

  return (
    <Card
      title='Policyholder'
      subTitle='Policyholder Information'
      icon={<UserOutlined width='21' height='21' />}
    >
      <>
        <div className='font-heading mb-4 font-semibold text-gray-900'>
          Personal Details
        </div>
        <div className='mb-6 grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2'>
          {row('Full Name', data.name)}
          {row('Marital Status', data.marital_status, 'capitalize')}
          {row('Mobile Number', data.mobile)}
          {row('Email', user?.email ?? data.email)}
        </div>

        <div className='font-heading mb-4 font-semibold text-gray-900'>
          Address Information
        </div>
        <div className='grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2'>
          {row('Address Line 1', data.address?.address_line_1)}
          {row('Address Line 2', data.address?.address_line_2)}
          {row('Address Line 3', data.address?.address_line_3)}
          {row('Postal Code', data.address?.postal_code)}
        </div>
      </>
    </Card>
  );
};

export default PolicyholderDetail;
