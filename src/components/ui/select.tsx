'use client';

import { CheckOutlined } from '@ant-design/icons';
import { Select as AntdSelect } from 'antd';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const { Option } = AntdSelect;

export function Select({
  options,
  placeholder = 'Select an option',
  className,
  onChange,
  value,
  defaultValue,
  disabled = false,
}: {
  options: readonly string[];
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
}) {
  return (
    <AntdSelect
      value={value ?? defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={twMerge(
        clsx(
          'h-14 w-full rounded-xl border-2 text-base transition-all duration-200',
          'bg-white hover:border-[#02ADEF]/60 hover:shadow-sm',
          'focus:border-[#02ADEF] focus:outline-none focus:ring-0',
          'placeholder:text-gray-500',
          disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          'appearance-none',
          className,
        ),
      )}
      suffixIcon={<ChevronDown className='size-4 text-gray-500' />}
      menuItemSelectedIcon={<CheckOutlined style={{ color: '#02ADEF' }} />}
      optionLabelProp='label'
      size='large'
      variant='borderless'
    >
      {options.map((opt) => (
        <Option key={opt} value={opt} label={opt} className='p-3 text-sm'>
          {opt}
        </Option>
      ))}
    </AntdSelect>
  );
}
