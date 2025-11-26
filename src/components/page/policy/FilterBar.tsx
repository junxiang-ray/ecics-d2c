'use client';

import { PolicyType } from '@/libs/types/policy';
import {
  useContext,
  useEffect,
  useMemo,
  useState,
  FormEventHandler,
} from 'react';
import { useDebounce } from '@/hook/useDebounce';
import {
  PolicyContext,
  QueryValues,
} from '@/components/contexts/PolicyLayoutContext';

import { Input } from 'antd';
import InputDropdown, { ItemType } from '@/components/ui/form/inputdropdown';
import SearchOutlined from '@/assets/icons/add-on/search-outlined.svg';

const FilterBar = (): JSX.Element => {
  const { selPolicyType, pushQuery } = useContext(PolicyContext);

  const [inputSearch, setInputSearch] = useState<string>();
  const inputSearchDebounce = useDebounce(inputSearch, 300);

  useEffect(() => {
    pushQuery([{ key: 'query', value: inputSearchDebounce as QueryValues }]);
  }, [inputSearchDebounce]);

  const dropdownItemPolicyTypes = useMemo<ItemType<PolicyType>[]>(
    () => [
      {
        key: 'all',
        value: 'all',
        label: 'All Types',
      },
      {
        key: 'car',
        value: 'car',
        label: 'Motor Vehicle - Car',
      },
      {
        key: 'motorcycle',
        value: 'motorcycle',
        label: 'Motor Vehicle - Motocycle',
      },
      {
        key: 'maid',
        value: 'maid',
        label: 'Maid',
      },
      {
        key: 'home',
        value: 'home',
        label: 'Home Content',
      },
      {
        key: 'travel',
        value: 'travel',
        label: 'Traval Insuarance',
      },
    ],
    [],
  );

  const onPolicyTypeChange = (item: ItemType<PolicyType>): void => {
    if (item) pushQuery([{ key: 'type', value: item.value }]);
  };

  const onInputChange = (inputEl?: HTMLInputElement): void => {
    setInputSearch(inputEl?.value as string);
  };

  return (
    <div className='flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:gap-4'>
      <InputDropdown<PolicyType>
        value={selPolicyType}
        items={dropdownItemPolicyTypes}
        onChange={onPolicyTypeChange}
      />
      <Input
        prefix={
          <SearchOutlined
            className='mr-2 text-[#000]/30'
            width='14'
            height='14'
          />
        }
        maxLength={150}
        className='h-[31.5px] border-0 bg-[#f3f3f5] text-[12.25px] leading-none focus-visible:ring-[3px] focus-visible:ring-red-400 [&_input::placeholder]:text-gray-500'
        placeholder='Search by policy number, type or verhicle number '
        onInput={(evt: unknown) =>
          onInputChange((evt as KeyboardEvent)?.target as HTMLInputElement)
        }
      />
    </div>
  );
};
export default FilterBar;
