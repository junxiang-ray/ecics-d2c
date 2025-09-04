import React, { useState } from 'react';

import { RenewalQuote } from '@/libs/types/renewalQuote';

import PromoTickIcon from '@/components/icons/PromoTickIcon';

interface Props {
  renewalQuote: RenewalQuote;
}

const AddOnsContent = ({ renewalQuote }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: number;
  }>(() => {
    const defaultOptions: { [key: number]: number } = {};
    renewalQuote.add_on_optional_benefits?.forEach((addon) => {
      if (addon.sub_options && addon.sub_options.length > 0) {
        defaultOptions[addon.id] = addon.sub_options[0].id;
      }
    });
    return defaultOptions;
  });

  const handleSelectOption = (addonId: number, subOptionId: number) => {
    setSelectedOptions((prev) => ({ ...prev, [addonId]: subOptionId }));
  };

  const handleClickAddon = (
    addon: (typeof renewalQuote.add_on_optional_benefits)[0],
  ) => {
    const isAddonSelected = !!selectedOptions[addon.id];

    if (isAddonSelected) {
      setSelectedOptions((prev) => {
        const newState = { ...prev };
        delete newState[addon.id];
        return newState;
      });
    } else {
      if (addon.sub_options && addon.sub_options.length > 0) {
        handleSelectOption(addon.id, addon.sub_options[0].id);
      } else {
        setSelectedOptions((prev) => ({ ...prev, [addon.id]: -1 }));
      }
    }
  };

  return (
    <div className='space-y-4'>
      {/* Optional benefits already included */}
      {renewalQuote.renewal_info?.optional_benefits?.map((benefit) => (
        <div
          key={benefit.id}
          className='flex items-center justify-between rounded-lg border-2 border-green-300 bg-white p-4'
        >
          <div>
            <div className='font-semibold text-gray-900'>{benefit.name}</div>
            <div className='mt-1 text-sm text-gray-600'>
              {benefit.sub_option}
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='rounded-full bg-green-100 px-3 py-1'>
              <span className='font-medium text-green-600'>Included</span>
            </div>
            <PromoTickIcon className='text-[#00C950]' size={28} />
          </div>
        </div>
      ))}
      {renewalQuote.add_on_optional_benefits?.map((addon) => {
        const isAddonSelected = !!selectedOptions[addon.id];

        return (
          <div
            key={addon.id}
            className={`cursor-pointer rounded-lg border-2 p-4 ${
              isAddonSelected ? 'border-blue-500' : 'border-gray-200'
            }`}
            onClick={() => handleClickAddon(addon)}
          >
            <div className='flex justify-between font-medium'>
              <div>{addon.name}</div>
              <div className='flex space-x-2'>
                <div className='justify-end'>
                  <div className='mb-2'>
                    SGD{' '}
                    {addon.sub_options
                      ? (addon.sub_options.find(
                          (sub) => sub.id === selectedOptions[addon.id],
                        )?.prem ?? addon.sub_options[0].prem)
                      : addon.prem || 0}
                  </div>
                  {isAddonSelected && (
                    <div className='rounded-full bg-green-100 px-3'>
                      <span className='font-medium text-green-600'>Added</span>
                    </div>
                  )}
                </div>
                <div className='flex h-7 w-7 items-center justify-center'>
                  {isAddonSelected ? (
                    <PromoTickIcon className='text-[#02ADEF]' size={28} />
                  ) : (
                    <div className='h-7 w-7 rounded-full border-2 border-gray-200' />
                  )}
                </div>
              </div>
            </div>

            {addon.sub_options && isAddonSelected && (
              <div className='mt-2 space-y-2'>
                <div className='mb-1 font-medium'>Select Coverage Amount:</div>
                {addon.sub_options.map((sub) => (
                  <div
                    key={sub.id}
                    className='flex cursor-pointer items-center justify-between'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className='flex cursor-pointer items-center space-x-1'>
                      <input
                        type='radio'
                        name={`addon-${addon.id}`}
                        value={sub.id}
                        className='form-radio h-5 w-5 text-blue-600'
                        checked={selectedOptions[addon.id] === sub.id}
                        onChange={() => handleSelectOption(addon.id, sub.id)}
                      />
                      <span>
                        + SGD {sub.name.replace(/\[\+?\$([\d,]+)\]/, '$1')}
                      </span>
                      <span>-</span>
                      <span className='text-[#02ADEF]'>SGD {sub.prem}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AddOnsContent;
