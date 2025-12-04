import ShieldOutlined from '@/assets/icons/renewal/shield.svg';

const SercurityNotice = (): JSX.Element => {
  return (
    <>
      <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 pt-3'>
        <div className='grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-1'>
          <div className='mr-2 flex items-center'>
            <ShieldOutlined className='h-4 w-4 text-blue-600' />
          </div>
          <div className='text-base font-medium text-blue-900'>
            Security Notice
          </div>
          <p className='col-start-2 col-end-3 text-sm text-blue-700'>
            Changes to your email address or phone number require SMS
            verification for security purposes. You will receive a 6-digit
            verification code to confirm the changes.
          </p>
        </div>
      </div>
    </>
  );
};
export default SercurityNotice;
