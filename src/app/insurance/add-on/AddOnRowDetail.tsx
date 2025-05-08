'use client';

import { SecondaryButton } from '@/components/ui/buttons';
import { Select } from 'antd';
import { memo, useEffect, useState } from 'react';
import AddOnRow from './AddOnRow';
import { AddOnFormat } from './page';

function AddOnRowDetail({
  addon,
  addonsAdded,
  setAddonsAdded,
  addonsSelected,
  setAddonsSelected,
}: {
  addon: AddOnFormat;
  addonsAdded: any;
  setAddonsAdded: (addonSelected: any) => void;
  addonsSelected: any;
  setAddonsSelected: (feeAdditions: any) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<any>(null);

  useEffect(() => {
    setSelectedOption(addonsSelected?.[addon.code]);
  }, [addonsSelected?.[addon.code]]);

  const handleAddSelectAddon = (addon: AddOnFormat) => {
    setAddonsAdded((prev: any) => ({
      ...prev,
      [addon.code]: selectedOption,
    }));
  };
  const handleSelectOption = (value: any) => {
    setSelectedOption(value);
    setAddonsSelected((prev: any) => ({
      ...prev,
      [addon.code]: value,
    }));
  };
  const handleAddCheckboxAddon = (addon: AddOnFormat) => {
    setAddonsAdded((prev: any) => ({
      ...prev,
      [addon.code]: 'YES',
    }));
  };
  const handleRemoveAddon = (addon: AddOnFormat) => {
    setAddonsAdded((prev: any) => ({
      ...prev,
      [addon.code]: 'NO',
    }));
  };

  const status = addonsAdded?.[addon.code] === 'NO' ? 'new' : 'completed';
  const options = addon.options.map((option) => ({
    value: option.value,
    label: <span className='font-semibold text-[#1E1E1E]'>{option.label}</span>,
  }));
  if (addon.is_display === false) {
    return null;
  }
  return (
    <AddOnRow
      isRecommended={addon.is_recommended}
      title={addon.title}
      icon={addon.icon}
      status={status}
    >
      {status === 'new' && (
        <>
          <p className='text-[13px] font-semibold leading-[19px] text-[#535353]'>
            {addon.description}
          </p>
          <div className='my-2 border-t border-dashed border-[#00ADEFB2]' />

          {addon.type === 'select' && (
            <>
              <div className='flex items-center justify-between text-[14px]'>
                <p className='font-semibold leading-[20px] text-[#525252]'>
                  Select Coverage Amount
                </p>
                <Select
                  style={{ width: 120 }}
                  className='[&_.ant-select-selector]:border-0.5 w-28 [&_.ant-select-selector]:border-[#00ADEF]'
                  options={options}
                  value={selectedOption}
                  placeholder='Select'
                  onChange={(value) => handleSelectOption(value)}
                />
              </div>
              <div className='flex items-center justify-between pt-2 text-[14px] font-semibold leading-5'>
                <p className='text-[#525252]'>SGD {addon.feeSelected ?? 0}</p>
                <SecondaryButton
                  className='black h-8 w-28 rounded-md !border-[#00ADEF] border-[0.5] py-0 leading-4 text-[#1E1E1E]'
                  onClick={() => handleAddSelectAddon(addon)}
                >
                  Add
                </SecondaryButton>
              </div>
            </>
          )}
          {addon.type === 'checkbox' && (
            <div className='flex items-center justify-between pt-2 text-[14px] font-semibold leading-5'>
              <p className='text-[#525252]'>SGD {addon.feeSelected ?? 0}</p>
              <SecondaryButton
                className='black h-8 w-28 rounded-md !border-[#00ADEF] border-[0.5] py-0 leading-4 text-[#1E1E1E]'
                onClick={() => handleAddCheckboxAddon(addon)}
              >
                Add
              </SecondaryButton>
            </div>
          )}
        </>
      )}
      {status === 'completed' && (
        <>
          <p className='font-semibold leading-5 text-[#333333]'>
            {addon.description}
          </p>
          <div className=' my-2 border-t border-dashed border-[#00ADEFB2]' />
          <div className='flex items-center justify-between pt-2 text-[14px]'>
            <p className='font-semibold leading-[20px] text-[#333333]'>
              <span>SGD {addon.feeAdded}</span>
            </p>
            <SecondaryButton
              className='h-8 w-28 rounded-md py-0 leading-4 text-red-500'
              onClick={() => handleRemoveAddon(addon)}
            >
              Remove
            </SecondaryButton>
          </div>
        </>
      )}
    </AddOnRow>
  );
}

export default memo(AddOnRowDetail);
