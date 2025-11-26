'use client';

import { useState } from 'react';

import { Dropdown } from 'antd';
import DownOutlined from '@/assets/icons/add-on/down-outlined.svg';
import TickOutlined from '@/assets/icons/renewal/tick.svg';

export interface ItemType<T = string> {
  danger?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  key: string;
  label?: React.ReactNode | string;
  title?: React.ReactNode | string;
  value: T;
  onClick?: (item: ItemType<T>) => void;
}

export interface Props<T = string> {
  value: T;
  items: ItemType<T>[];
  onChange?: (item: ItemType<T>) => void;
}

const InputDropdown = <T,>({
  value,
  items,
  onChange,
}: Props<T>): JSX.Element => {
  const [open, setOpen] = useState(false);

  const selected: ItemType<T> = (items?.find((item) => item.value === value) ??
    {}) as unknown as ItemType<T>;

  const overlayPane: React.ReactNode = (
    <>
      <div className='text-popover-foreground w-56 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-white p-1 font-body shadow-md'>
        {items.map((item, idx) => (
          <button
            key={`dropdown_item_${item.key}`}
            className={`transition-bg text-dark-500 flex w-full cursor-pointer flex-nowrap items-center justify-between gap-3.5 rounded-md py-2 pl-3.5 pr-6 text-sm opacity-90 duration-150 hover:bg-gray-200 ${item.className ?? ''}`}
            onClick={(evt) => {
              evt?.preventDefault();
              if (onChange) onChange(item);
              if (item.onClick) item.onClick(item);
              setOpen(false);
            }}
          >
            <span className='text-nowrap leading-none'>{item.label}</span>
            {selected.key === item.key && (
              <TickOutlined className='mr-[-1rem]' />
            )}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <Dropdown
      overlay={overlayPane}
      open={open}
      trigger={['click']}
      onOpenChange={(isOpen: boolean) => setOpen(isOpen)}
    >
      {/*w-full sm:w-64*/}
      <button
        className='line-clamp-1 flex h-9 min-w-[14em] flex-nowrap items-center justify-between gap-2 rounded-md bg-[#f3f3f5] px-3 py-2 outline-none data-[size=sm]:h-8'
        type='button'
        onClick={() => setOpen(!open)}
      >
        <span className='text-[12.25px] leading-tight text-[#000]/90'>
          {selected?.label ?? '-'}
        </span>
        <DownOutlined className='text-[#000]/30' />
      </button>
    </Dropdown>
  );
};
export default InputDropdown;
