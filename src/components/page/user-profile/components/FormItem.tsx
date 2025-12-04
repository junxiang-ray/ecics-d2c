'use client';

import type { LabeledValue } from 'antd/es/select';

import { UserUpdateResponse } from '../PersonalInfo';
import { Controller, useFormContext } from 'react-hook-form';

import { Input, Select } from 'antd';

interface Props<FormValues> {
  type?: 'select' | 'input';
  label: string;
  name: keyof FormValues;
  className?: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  enabled?: boolean;
  options?: LabeledValue[];
  placeholder?: boolean | string;
  parser?: (
    value: FormValues[Props<FormValues>['name']],
  ) => FormValues[Props<FormValues>['name']];
  formatter?: (
    value: FormValues[Props<FormValues>['name']],
  ) => FormValues[Props<FormValues>['name']];
}

type FormItemName<FormValues> = Props<FormValues>['name'];
type UpdateResp<FormValues> = UserUpdateResponse<
  FormValues[FormItemName<FormValues>]
>;

const FormItem = <FormValues,>({
  name,
  label,
  type,
  options,
  placeholder,
  className,
  enabled,
  prefix,
  suffix,
  parser,
  formatter,
}: Props<FormValues>): JSX.Element => {
  const ctx = useFormContext();
  const formItemName = name as string;

  return (
    <>
      <div className={`[&>.form-label+div]:max-w-full ${className ?? ''}`}>
        <label className='form-label font-body mb-2 inline-block text-sm font-medium text-gray-700'>
          {label}&nbsp;
        </label>
        <Controller
          name={formItemName}
          control={ctx.control}
          render={({ field, fieldState }) =>
            enabled ? (
              <>
                {type === 'select' ? (
                  <Select
                    {...field}
                    className='[&_.ant-select-arrow_svg]:fill-gray-500 [&_.ant-select-selection-item]:text-base '
                    size='large'
                    options={options}
                  />
                ) : (
                  <Input
                    {...field}
                    placeholder={
                      placeholder === true
                        ? parser
                          ? parser(field.value)
                          : field.value
                        : placeholder
                    }
                    size='large'
                    onChange={(event) => {
                      const value = event.target
                        .value as unknown as FormValues[Props<FormValues>['name']];
                      const formatted = formatter ? formatter(value) : value;
                      field.onChange(formatted);
                    }}
                  />
                )}
                {fieldState.invalid && (
                  <span className='text-sm text-red-400'>
                    {fieldState.error?.message}
                  </span>
                )}
              </>
            ) : (
              <div className='flex h-[2.5rem] items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3'>
                <div className='flex flex-nowrap items-center gap-3'>
                  {prefix}
                  <span className='font-body block text-base text-gray-900'>
                    <>{parser ? parser(field.value) : field.value}</>
                  </span>
                  {suffix}
                </div>
              </div>
            )
          }
        />
      </div>
    </>
  );
};
export default FormItem;
