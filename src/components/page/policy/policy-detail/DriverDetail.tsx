import { DriverInfo } from '@/libs/types/policy';

import Card from './PolicyCard';
import UserOutlined from '@/assets/icons/renewal/policy-holder.svg';
import DownOutlined from '@/assets/icons/add-on/down-outlined.svg';

interface Props {
  data?: DriverInfo[];
}

const DriverDetail = ({ data }: Props): JSX.Element | null => {
  if (!data) return null;

  return (
    <Card
      title='Named Driver'
      subTitle='Additional drivers covered under this policy (1)'
      icon={<UserOutlined width='21' height='21' />}
    >
      <div className='space-y-4'>
        {data.map((driver, idx) => (
          <div
            key={idx}
            className='overflow-hidden rounded-lg border border-gray-200 bg-white'
          >
            <div className='flex items-center justify-between bg-gray-50 px-6 py-4'>
              <div className='flex items-center gap-3'>
                <span className='font-body text-sm text-gray-700'>
                  {driver.name ?? '-'}
                </span>
                {driver.is_main_driver && (
                  <span className='inline-flex items-center rounded-full bg-[#02ADEF] px-2 py-1 text-xs font-medium text-white'>
                    Main Driver
                  </span>
                )}
              </div>
              <button
                className='rounded p-1 transition-colors hover:bg-gray-200'
                aria-label='Expand driver details'
              >
                <DownOutlined className='h-4 w-4 text-gray-600' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default DriverDetail;
