'use client';

import { Checkbox } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CouponIcon from '@/components/icons/CouponIcon';
import { LinkButton } from '@/components/ui/buttons';

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
          Get an instant quote with Myinfo login
        </div>

        <div className='mb-6 mt-6 rounded-lg bg-white p-4 shadow-lg shadow-black/20'>
          <div className='flex items-center justify-center'>
            <div className='flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center'>
              <h1 className='whitespace-nowrap font-bold'>
                Retrieve Myinfo with
              </h1>
              <Image src='/singpass.svg' alt='Logo' width={100} height={100} />
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center'>
          <div className='mr-[4px]'>or,</div>
          <LinkButton
            type='link'
            className='pl-0'
            onClick={handleContinueWithoutMyinfo}
          >
            continue without Myinfo login
          </LinkButton>
        </div>

        <div className='mt-4 flex items-center justify-center'>
          <Checkbox className='custom-checkbox mr-[4px]' />
          <div className='mr-[4px]'>
            By using this platform, you agree to our
          </div>
          <LinkButton type='link' className='pl-0'>
            Disclaimer
          </LinkButton>
        </div>

        <div className='mt-6 rounded-lg border-2 border-secondaryBlue bg-white p-4'>
          <div className='text-lg font-bold'>Limited period offer</div>
          <div>
            Flash Sale: Special discount available for the next 50 customers!
          </div>
          <div className='mt-2 text-base font-bold'>
            15% discount on Car Insurance
          </div>
          <div className='mt-2 flex flex-row items-center gap-2 whitespace-nowrap rounded-lg border-2 border-secondaryBlue bg-white p-2 text-secondaryBlue'>
            <CouponIcon size={32} />
            <div className='text-base font-bold'>Coupon Code CARS15</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
