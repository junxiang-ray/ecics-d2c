import PersonalInfo from '@/components/page/user-profile/PersonalInfo';
import ChangePassword from '@/components/page/user-profile/ChangePassword';

const Page = (): React.ReactNode => {
  return (
    <>
      <div className='mb-8'>
        <h1 className='mb-2 font-heading text-[32px] font-bold text-gray-900'>
          Profile
        </h1>
        <p className='font-body text-base text-gray-600'>
          Manage your personal information and account details
        </p>
      </div>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <PersonalInfo />
        <ChangePassword />
      </div>
    </>
  );
};
export default Page;
