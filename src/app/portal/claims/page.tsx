import TabBars from '@/components/page/claim/TabBars';
import FilterBar from '@/components/page/claim/FilterBar';
import Table from '@/components/page/claim/Table';

const Claims = (): React.ReactNode => {
  return (
    <>
      <div className='mb-5'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='mb-1 font-heading text-[1.64rem] font-bold text-gray-900'>
              My Claims
            </h1>
            <p className='font-body text-sm text-gray-600'>
              Track and manage your insurance claims
            </p>
          </div>
          <button className='hidden h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#52c41a] px-4 py-2 font-body text-sm font-medium leading-none text-white outline-none transition-all hover:bg-[#52c41a]/90 sm:flex'>
            New Claim
          </button>
        </div>
      </div>
      <div className='text-card-foreground flex flex-col rounded-xl border border-gray-200 bg-white pt-1'>
        <TabBars />
        <FilterBar />
        <Table />
      </div>
    </>
  );
};
export default Claims;
