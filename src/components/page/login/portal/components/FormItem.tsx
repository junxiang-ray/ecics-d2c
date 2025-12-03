'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Form, Input } from 'antd';

interface Props<FormValues> {
  name: string;
  label: string;
  required?: boolean;
  children: (args: any) => JSX.Element;
}

const FormItem = <FormValues,>({
  name,
  label,
  required,
  children: Children,
}: Props<FormValues>): JSX.Element => {
  const { control, setValue, getValues, trigger } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Form.Item
            label={
              <label className='flex flex-nowrap'>
                {label}
                {required && <span className='ml-1 text-red-500'>*</span>}
              </label>
            }
            validateStatus={fieldState.invalid ? 'error' : ''}
          >
            <Children {...{ field, fieldState }} />
          </Form.Item>
        )}
      />
    </>
  );
};
export default FormItem;
