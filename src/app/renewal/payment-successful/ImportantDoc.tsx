import React from 'react';

import {
  DownloadIcon,
  PolicyDetailsIcon,
  ShieldIcon,
} from '@/components/icons/renewal-icons';

import { VALUE_TITLE_DOC } from '@/constants/general.constant';

interface ImportantDocProps {
  title: string;
  url: string;
}

const ImportantDoc: React.FC<ImportantDocProps> = ({ title, url }) => {
  const renderIcon = () => {
    if (title === VALUE_TITLE_DOC) {
      return (
        <ShieldIcon
          className='h-8 w-8 rounded-lg bg-[#DCFCE7] text-[#00A63E]'
          size={20}
        />
      );
    }
    return (
      <PolicyDetailsIcon
        className='h-8 w-8 rounded-lg bg-[#D9E9FE] text-[#155DFC]'
        size={18}
      />
    );
  };
  return (
    <div
      className='flex cursor-pointer items-center justify-between rounded-lg border border-[#BEDBFF] bg-[#EFF6FF] p-3'
      onClick={() => {
        window.open(url, '_blank');
      }}
    >
      <div className='flex items-center gap-2'>
        {renderIcon()}
        <div>
          <div className='text-sm font-medium'>{title}</div>
          <div className='text-xs font-normal'>
            Download your official policy document
          </div>
        </div>
      </div>
      <DownloadIcon className='h-5 w-5 text-gray-500' />
    </div>
  );
};

export default ImportantDoc;
