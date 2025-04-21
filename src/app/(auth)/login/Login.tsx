'use client';

import MButton from '@/components/ui/button/MButton';
import { Checkbox } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CouponIcon from '@/components/icons/CouponIcon';

const Login = () => {
  const router = useRouter();

  const handleContinueWithoutMyinfo = () => {
    router.push('/review-info-detail');
  };

  return (
    <div
      className='absolute left-0 top-0 -z-10 h-[100vh] w-full bg-cover bg-center'
      style={{
        backgroundImage: "url('/login_backg.svg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='relative z-10 mt-[445px] p-6'>
        <div className='justify-self-center text-primaryBlue'>
          {'Get an instant quote with Myinfo login'}
        </div>

        <div className='mb-6 mt-6 rounded-lg bg-white p-4 shadow-lg shadow-black/20'>
          <div className='flex items-center justify-center'>
            <h1 className='mb-[4px] mr-[12px] font-bold'>
              {'Retrieve Myinfo with'}
            </h1>
            <Image src='/singpass.svg' alt='Logo' width={100} height={100} />
          </div>
        </div>

        <div className='flex items-center justify-center'>
          <div className='mr-[4px]'>{'or,'}</div>
          <MButton
            type='link'
            className='pl-0'
            onClick={handleContinueWithoutMyinfo}
          >
            {'continue without Myinfo login'}
          </MButton>
        </div>

        <div className='mt-4 flex items-center justify-center'>
          <Checkbox className='custom-checkbox mr-[4px]' />
          <div className='mr-[4px]'>
            {'By using this platform, you agree to our'}
          </div>
          <MButton type='link' className='pl-0'>
            Disclaimer
          </MButton>
        </div>

        <div className='mt-6 rounded-lg border-2 border-secondaryBlue bg-white p-4'>
          <div className='text-lg font-bold'>{'Limited period offer'}</div>
          <div>
            {
              'Flash Sale: Special discount available for the next 50 customers!'
            }
          </div>
          <div className='mt-2 text-base font-bold'>
            {'15% discount on Car Insurance'}
          </div>
          <div className='mt-2 flex w-2/3 items-center justify-between rounded-lg border-2 border-secondaryBlue bg-white p-2 text-left text-secondaryBlue'>
            <CouponIcon size={32} />
            <div className='text-base font-bold'>{'Coupon Code CARS15'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
