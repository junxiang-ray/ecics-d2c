import TabBars from '@/components/page/claim/TabBars';
import FilterBar from '@/components/page/claim/FilterBar';
import Table from '@/components/page/claim/Table';

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
          <button className='font-body hidden h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#52c41a] px-4 py-2 text-sm font-medium leading-none text-white outline-none transition-all hover:bg-[#52c41a]/90 sm:flex'>
            New Claim
          </button>
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
