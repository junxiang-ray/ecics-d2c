'use client';

import { Select as AntdSelect } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { cn } from '@/libs/utils/utils';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const { Option } = AntdSelect;

export function Select({
  options,
  placeholder = 'Select an option',
  className,
  onChange,
  defaultValue,
  disabled = false,
}: {
  options: readonly string[];
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}) {
  return (
    <AntdSelect
      value={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={twMerge(
        clsx(
          'h-14 w-full rounded-xl border-2 text-base transition-all duration-200',
          'bg-white hover:border-[#02ADEF]/60 hover:shadow-sm',
          'focus:border-[#02ADEF] focus:outline-none focus:ring-0', // remove ant design focus outline/ring
          'placeholder:text-gray-500',
          disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          'appearance-none',
          className,
        ),
      )}
      suffixIcon={<CheckOutlined />}
      optionLabelProp='label'
      size='large' // matches h-14
      variant='borderless'
    >
      {options.map((opt) => (
        <Option key={opt} value={opt} label={opt} className='p-3 text-xl'>
          {opt}
        </Option>
      ))}
    </AntdSelect>
  );
}
