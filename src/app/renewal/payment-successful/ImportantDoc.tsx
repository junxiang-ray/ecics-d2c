import React from 'react';

import {
  DownloadIcon,
  PolicyDetailsIcon,
} from '@/components/icons/renewal-icons';

interface ImportantDocProps {
  title: string;
  url: string;
}

const ImportantDoc: React.FC<ImportantDocProps> = ({ title, url }) => {
  return (
    <div
      className='flex cursor-pointer items-center justify-between rounded-lg border border-[#BEDBFF] bg-[#EFF6FF] p-3'
      onClick={() => {
        window.open(url, '_blank');
      }}
    >
      <div className='flex items-center gap-2'>
        <PolicyDetailsIcon
          className='h-8 w-8 rounded-lg bg-[#D1FAE5] text-[#155DFC]'
          size={18}
        />
        <div>
          <div className='text-sm font-medium'>{title}</div>
          <div className='text-xs font-normal'>
            Download your official policy document
          </div>
        </div>
      </div>
      <DownloadIcon className='h-4 w-4 text-gray-500' />
    </div>
  );
};

export default ImportantDoc;
