import { RadioProps, Card } from 'antd';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type CardOptions = {
  label: string;
  value: string;
  description: string;
};

interface RadioFieldProps extends RadioProps {
  name: string;
  label?: string;
  options: CardOptions[];
  isRequired?: boolean;
}

export const RadioCardField = ({
  name,
  label,
  options,
  className,
  isRequired,
  ...props
}: RadioFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={options?.[0]?.value}
      render={({ field, fieldState }) => (
        <div className='flex flex-col gap-2'>
          {label && (
            <span className='text-base font-semibold'>
              {label}
              {isRequired && (
                <span className='font-semibold text-[#C80F1E]'> *</span>
              )}
            </span>
          )}

          <div
            className={`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 ${className}`}
          >
            {options.map((option) => {
              const isSelected = field.value === option.value;
              return (
                <Card
                  key={option.value}
                  onClick={() => field.onChange(option.value)}
                  bordered
                  className={`cursor-pointer text-left transition ${
                    isSelected
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <strong className='text-sm md:text-base'>
                    {option.label}
                  </strong>
                  {option.description && (
                    <p className='mt-1 text-xs text-gray-600 md:text-sm'>
                      {option.description}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>

          {fieldState.error && (
            <span className='block text-sm text-red-500'>
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};
