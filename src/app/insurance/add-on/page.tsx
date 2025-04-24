'use client';
import { SecondaryButton } from '@/components/ui/buttons';
import { Select } from 'antd';
import { useState } from 'react';
import AddOnRow, { Status } from './AddOnRow';
import AddOnRowDetail from './AddOnRowDetail';
const mapIconToTypeAddOn = [
  {
    type: 'key',
    iconLink: '/icons/add-on/key.svg',
    isRecommended: true,
    title: 'Key Replacement Cover',
  },
  {
    type: 'repair',
    iconLink: '/icons/add-on/repair.svg',
    title: 'Repair at Any Workshop',
  },
  {
    type: 'roadside',
    iconLink: '/icons/add-on/road-side.svg',
    title: '24/7 Road side assistance',
  },
  {
    type: 'enhanced-accident',
    iconLink: '/icons/add-on/enhanced-accident.svg',
    title: 'Enhanced Accident Coverage',
  },
  {
    type: 'personal-accident',
    iconLink: '/icons/add-on/personal-accident.svg',
    title: 'Personal Accident +',
  },
  {
    type: 'new-old-replacement',
    iconLink: '/icons/add-on/new-old-replacement.svg',
    title: 'New for Old Replacement',
  },
];
function AddOnPage() {
  return (
    <div>
      <div className='text-xl font-bold'>Select Add On</div>
      <div className='mt-4 flex flex-col gap-4'>
        {mapIconToTypeAddOn.map((item) => (
          <AddOnRowDetail
            key={item.type}
            title={item.title}
            iconLink={item.iconLink}
            isRecommended={item.isRecommended}
          />
        ))}
      </div>
    </div>
  );
}

export default AddOnPage;
