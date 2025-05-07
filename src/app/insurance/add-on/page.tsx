'use client';

import { Modal } from 'antd';
import { useState } from 'react';

import EnhancedAccidentIcon from '@/components/icons/EnhancedAccidentIcon';
import KeyIcon from '@/components/icons/KeyIcon';
import NewOldReplacementIcon from '@/components/icons/NewOldReplacementIcon';
import PersonalAccidentIcon from '@/components/icons/PersonalAccidentIcon';
import RepairIcon from '@/components/icons/RepairIcon';
import RoadSideIcon from '@/components/icons/RoadSideIcon';

import AddOnPricingSummary from '@/app/insurance/add-on/AddOnPricingSummary';

import AddOnRowDetail from './AddOnRowDetail';
import HeaderAddOn from './HeaderAddOn';

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
      <AddOnPricingSummary />
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
