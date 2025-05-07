'use client';

import EnhancedAccidentIcon from '@/components/icons/EnhancedAccidentIcon';
import KeyIcon from '@/components/icons/KeyIcon';
import NewOldReplacementIcon from '@/components/icons/NewOldReplacementIcon';
import PersonalAccidentIcon from '@/components/icons/PersonalAccidentIcon';
import RepairIcon from '@/components/icons/RepairIcon';
import RoadSideIcon from '@/components/icons/RoadSideIcon';
import AddOnRowDetail from './AddOnRowDetail';
import { SecondaryButton } from '@/components/ui/buttons';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import HeaderAddOn from './HeaderAddOn';
import AdditionDriver from '../components/AdditionDriver';

const mapIconToTypeAddOn = [
  {
    type: 'key',
    icon: <KeyIcon className='text-brand-blue' />,
    isRecommended: true,
    title: 'Key Replacement Cover',
  },
  {
    type: 'repair',
    icon: <RepairIcon className='text-brand-blue' />,
    title: 'Repair at Any Workshop',
  },
  {
    type: 'roadside',
    icon: <RoadSideIcon className='text-brand-blue' />,
    title: '24/7 Road side assistance',
  },
  {
    type: 'enhanced-accident',
    icon: <EnhancedAccidentIcon className='text-brand-blue' />,
    title: 'Enhanced Accident Coverage',
  },
  {
    type: 'personal-accident',
    icon: <PersonalAccidentIcon className='text-brand-blue' />,
    title: 'Personal Accident +',
  },
  {
    type: 'new-old-replacement',
    icon: <NewOldReplacementIcon className='text-brand-blue' />,
    title: 'New for Old Replacement',
  },
];

function AddOnPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowAdditionDriver, setIsShowAdditionDriver] = useState(false);
  const [dataDrivers, setDataDrivers] = useState<any[]>([]);
  console.log(dataDrivers, 'test');
  return (
    <div className='w-full'>
      <div className='mt-2 flex flex-col gap-4 px-4'>
        <div className='hidden items-center justify-between md:flex md:flex-col md:gap-4 xl:flex-row xl:gap-6'>
          <HeaderAddOn setIsModalVisible={setIsModalVisible} />
        </div>

        <div className='mt-4 flex flex-col gap-2 md:grid md:grid-cols-2 xl:grid-cols-3'>
          {mapIconToTypeAddOn.map((item) => (
            <AddOnRowDetail
              key={item.type}
              title={item.title}
              icon={item.icon}
              isRecommended={item.isRecommended}
            />
          ))}
        </div>
      </div>

      <div className='mt-2 md:px-44'>
        <div className='mt-2 flex w-full flex-row items-center justify-between rounded-t-md border border-[#DEE1E6] px-4 py-3 shadow-lg'>
          <div className='flex flex-col gap-2'>
            <p className='text-[18px] font-semibold leading-6 md:text-[28px] md:font-bold'>
              S$ 2700{' '}
              <span className='text-[15px] text-[#FF0004] line-through md:text-[20px] md:font-normal'>
                $3200
              </span>
            </p>
            <p className='text-[12px] font-semibold text-[#0096D8] md:text-[16px]'>
              Premium breakdown
            </p>
          </div>
          <SecondaryButton className='rounded-xl bg-[#00ADEF] px-6 leading-4 text-white'>
            Continue
          </SecondaryButton>
          <SecondaryButton
            className='rounded-xl bg-[#00ADEF] px-6 leading-4 text-white'
            onClick={() => setIsShowAdditionDriver(true)}
          >
            Add Driver(s)
          </SecondaryButton>
        </div>
      </div>
      <AdditionDriver
        isShowAdditionDriver={isShowAdditionDriver}
        setIsShowAdditionDriver={setIsShowAdditionDriver}
        setDataDrivers={setDataDrivers}
      />
      <Modal
        title='Edit Information'
        open={isModalVisible}
        footer={[]}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Here you can edit the car info or insurance details.</p>
      </Modal>
    </div>
  );
}

export default AddOnPage;
