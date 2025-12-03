import DocumentOutlined from '@/assets/icons/document-oulined.svg';
import PhoneOutlined from '@/assets/icons/basic-detail/phone.svg';

const QuickActions = (): JSX.Element => {
  return (
    <>
      <div className='text-card-foreground flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6'>
        <div className='font-heading text-lg font-semibold leading-none'>
          Quick Actions
        </div>
        <div className='flex flex-col gap-2'>
          <button className='flex h-9 flex-nowrap items-center gap-2 rounded-md border px-4 py-2 outline-none transition-all hover:bg-gray-100'>
            <DocumentOutlined className='h-4 w-4' />
            <span className='font-body whitespace-nowrap text-sm font-medium leading-none'>
              Download Claim Summary
            </span>
          </button>
          <button className='flex h-9 flex-nowrap items-center gap-2 rounded-md border px-4 py-2 outline-none transition-all hover:bg-gray-100'>
            <PhoneOutlined className='h-3.5 w-3.5' />
            <span className='font-body whitespace-nowrap text-sm font-medium leading-none'>
              Contact Claims Team
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
export default QuickActions;
