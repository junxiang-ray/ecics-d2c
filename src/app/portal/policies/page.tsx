import PolicyProvider from './layout';

import TabBars from '@/components/page/policy/TabBars';
import FilterBar from '@/components/page/policy/FilterBar';
import Table from '@/components/page/policy/Table';

const Policies = (): React.ReactNode => {
  return (
    <PolicyProvider>
      <div className='mb-5'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='mb-1 font-heading text-[1.64rem] font-bold text-gray-900'>
              My Policies
            </h1>
            <p className='font-body text-sm text-gray-600'>
              View and manage your insurance policies
            </p>
          </div>
        </div>
      </div>
      <div className='text-card-foreground flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white pt-1'>
        <TabBars />
        <FilterBar />
        <Table />
      </div>
    </PolicyProvider>
  );
};
export default Policies;
