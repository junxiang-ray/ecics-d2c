import { Button } from 'antd';
import TabBars from '@/components/page/claim/TabBars';
import FilterBar from '@/components/page/claim/FilterBar';
import Table from '@/components/page/claim/Table';
import PlusOutlined from '@/assets/icons/renewal/plus-small.svg';

const Claims = (): React.ReactNode => {
  return (
    <>
      <div className='mb-5'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='font-heading mb-1 text-2xl font-bold text-gray-900'>
              My Claims
            </div>
            <p className='font-body text-sm text-gray-600'>
              Track and manage your insurance claims
            </p>
          </div>
          <Button
            className='font-body flex flex-nowrap items-center justify-center gap-2 border-transparent bg-[#52c41a] ps-2 text-sm font-medium leading-none outline-none transition-all hover:bg-[#52c41a]/90'
            type='primary'
          >
            <PlusOutlined className='h-4 w-4' />
            New Claim
          </Button>
        </div>
      </div>
      <div className='text-card-foreground flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white pt-1'>
        <TabBars />
        <FilterBar />
        <Table />
      </div>
    </>
  );
};
export default Claims;
