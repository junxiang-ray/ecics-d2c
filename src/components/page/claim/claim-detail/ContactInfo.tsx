'use client';

import { UserProfile } from '@/libs/types/user-profile';

import { useAppSelector } from '@/redux/store';

import UserOutlined from '@/assets/icons/renewal/policy-holder.svg';
import PhoneOutlined from '@/assets/icons/basic-detail/phone.svg';
import MailOutlined from '@/assets/icons/basic-detail/mail.svg';

const ContactInfo = (): JSX.Element => {
  const user: UserProfile | null = useAppSelector(
    (state) => state.portalUserInfo.user,
  );

  return (
    <>
      <div className='text-card-foreground flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 pb-4'>
        <h4 className='font-heading font-medium leading-none'>
          Contact Information
        </h4>
        <div className='grid grid-cols-[auto_1fr] gap-2.5'>
          <div className='flex items-center'>
            <UserOutlined className='h-4 w-4 text-gray-400' />
          </div>
          <div>
            <label className='font-body text-sm text-gray-500'>Name</label>
            <p className='font-body font-medium'>{user?.name}</p>
          </div>
          <div className='flex items-center'>
            <PhoneOutlined className='h-3.5 w-3.5 text-gray-400' />
          </div>
          <div>
            <label className='font-body text-sm text-gray-500'>Phone</label>
            <p className='font-body font-medium'>{user?.phone}</p>
          </div>
          <div className='flex items-center'>
            <MailOutlined className='h-3.5 w-3.5 text-gray-400' />
          </div>
          <div>
            <label className='font-body text-sm text-gray-500'>Email</label>
            <p className='font-body font-medium'>{user?.email}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default ContactInfo;
