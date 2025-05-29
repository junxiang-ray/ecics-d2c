import { Radio, RadioProps } from 'antd';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { DropdownOption } from './dropdownfield';

interface RadioFieldProps extends RadioProps {
  name: string;
  label?: string;
  requiredMark?: boolean;
  options: DropdownOption[];
}

const RadioField = ({
  name,
  label,
  requiredMark,
  options,
  className,
  ...props
}: RadioFieldProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <span className='text-base font-semibold'>
              {label}
              {requiredMark && <span className='text-red-500'>*</span>}
            </span>
            <Radio.Group
              {...props}
              {...field}
              className={`grid w-full grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:gap-4 ${className}`}
            >
              {options.map((option) => (
                <Radio
                  key={option.value}
                  value={option.value}
                  className={`mr-0 flex-grow rounded-lg border py-2 ps-2 text-[13px] transition-colors ${
                    field.value === option.value
                      ? 'border-blue-400'
                      : 'border-gray-300'
                  }`}
                >
                  {option.text}
                </Radio>
              ))}
            </Radio.Group>
            {fieldState.error && (
              <span className='block text-sm text-red-500'>
                {fieldState.error.message}
              </span>
            )}
          </>
        )}
      />
    </>
  );
};

export default RadioField;
