import React from 'react';

import { Dropdown } from 'antd';

import BoxIcon from '@/components/ui/BoxIcon';

import Card from './QuickActionCard';
import CarOutlined from '@/assets/icons/add-on/car-outlined.svg';
import DocumentOulined from '@/assets/icons/document-oulined.svg';
import UserGroupOulined from '@/assets/icons/add-on/user-group-outlined.svg';
import HomeOutlined from '@/assets/icons/add-on/home-outlined.svg';

interface ActionCardItem {
  key: string;
  icon: JSX.Element;
  className: string;
  title: string;
  subTitle: string;
}

const QUICK_ACTION_ITEMS: ActionCardItem[] = [
  {
    key: 'motor_car',
    icon: <CarOutlined />,
    className: 'text-primary',
    title: 'Private Motor Car',
    subTitle: 'Comprehensive coverage for your vehicle',
  },
  {
    key: 'maid',
    icon: <UserGroupOulined />,
    className: 'text-purple-500',
    title: 'Maid Insurance',
    subTitle: 'Protection for your domestic helper',
  },
  {
    key: 'home_content',
    icon: <HomeOutlined />,
    className: 'text-green-500',
    title: 'Home Content',
    subTitle: 'Coverage for your household items',
  },
];

const QuickActions = (): React.ReactNode => {
  const overlayPanel = (
    <>
      <div className='w-[65%] rounded-lg border border-gray-200 bg-white p-6 shadow-md'>
        <h4 className='mb-4 font-heading text-lg font-semibold text-gray-900'>
          Choose Insurance Type
        </h4>
        <div className='flex flex-col gap-3'>
          {QUICK_ACTION_ITEMS.map((item) => (
            <a
              key={item.key}
              className='group flex w-full cursor-pointer items-center gap-4 rounded-xl p-4 text-left transition-colors duration-200 hover:bg-gray-50'
            >
              <BoxIcon icon={item.icon} size='sm' className={item.className} />
              <div>
                <p className='font-heading text-sm font-semibold text-gray-900'>
                  {item.title}
                </p>
                <p className='font-body text-xs text-gray-600'>
                  {item.subTitle}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className='mb-8'>
      <h2 className='mb-5 font-heading text-xl font-semibold text-gray-900'>
        Quick Actions
      </h2>
      <div className='grid grid-cols-3 gap-6'>
        <Dropdown overlay={overlayPanel} trigger={['click']}>
          <Card
            className='text-primary'
            icon={<CarOutlined width='21' height='21' />}
            title='Get Quote'
            subTitle='New policy'
          />
        </Dropdown>

        <Card
          className='text-purple-500'
          icon={<DocumentOulined width='21' height='21' />}
          title='Claims'
          subTitle='Submit claim'
        />

        <Card
          className='text-green-500'
          icon={<UserGroupOulined width='21' height='21' />}
          title='Support'
          subTitle='Get help'
        />
      </div>
    </div>
  );
};
export default QuickActions;
