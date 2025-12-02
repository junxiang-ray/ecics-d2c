'use client';

import { UserUpdateResponse } from '../PersonalInfo';

import {
  Subscription,
  Observable,
  take,
  tap,
  filter,
  debounceTime,
} from 'rxjs';

import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Input, Select, Button, Form } from 'antd';
import BtnEdit from './BtnEdit';

interface Props<FormValues> {
  label: string;
  name: keyof FormValues;
  className?: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  parser?: (
    value: FormValues[Props<FormValues>['name']],
  ) => FormValues[Props<FormValues>['name']];
  children: ({
    field,
    fieldState,
  }: {
    field?: any;
    fieldState?: any;
  }) => JSX.Element;
  onSubmit?: (
    value: FormValues[Props<FormValues>['name']],
  ) => Observable<UserUpdateResponse<FormValues[Props<FormValues>['name']]>>;
}

type FormItemName<FormValues> = Props<FormValues>['name'];
type UpdateResp<FormValues> = UserUpdateResponse<
  FormValues[FormItemName<FormValues>]
>;

const FormItem = <FormValues,>({
  name,
  label,
  className,
  prefix,
  suffix,
  children: Children,
  parser,
  onSubmit,
}: Props<FormValues>): JSX.Element => {
  const subscriptionRef = useRef<Subscription | null>();

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { control, setValue, getValues, trigger } = useFormContext();
  const formItemName = name as string;

  const itemValueRef = useRef<FormValues[FormItemName<FormValues>]>(
    getValues(formItemName) as FormValues[FormItemName<FormValues>],
  );

  const onCancel = (): void => {
    setValue(formItemName, itemValueRef.current);
    trigger(formItemName);
    setIsEdit(false);
  };

  const onEdit = (): void => {
    setIsEdit(true);
  };

  const requestSubmit = (): void => {
    if (!onSubmit) return;

    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();

    setLoading(true);
    subscriptionRef.current = onSubmit(getValues(formItemName))
      .pipe(
        take(1),
        tap((resp: UpdateResp<FormValues>) => {
          setLoading(false);
          if (!resp.success) return;

          itemValueRef.current =
            resp.data as unknown as FormValues[FormItemName<FormValues>];
          setIsEdit(false);
        }),
        filter((resp: UpdateResp<FormValues>) => resp?.success),
        debounceTime(50),
      )
      .subscribe((resp: UpdateResp<FormValues>) => {
        setValue(formItemName, resp.data);
      });
  };

  return (
    <>
      <div className={`[&>.form-label+div]:max-w-full ${className ?? ''}`}>
        <label className='form-label mb-2 inline-block font-body text-sm font-medium text-gray-700'>
          {label}&nbsp;
        </label>
        <Controller
          name={formItemName}
          control={control}
          render={({ field, fieldState }) =>
            isEdit ? (
              <>
                {Children && <Children {...{ field, fieldState }} />}
                {fieldState.invalid && (
                  <span className='text-sm text-red-400'>
                    {fieldState.error?.message}
                  </span>
                )}
                <div className='mt-3 grid grid-cols-2 gap-3'>
                  <Button
                    color='default'
                    variant='filled'
                    disabled={loading}
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    className='bg-[#52c41a] text-white transition-colors hover:bg-[#52c41a]/90 disabled:cursor-not-allowed disabled:opacity-50'
                    color='green'
                    variant='filled'
                    disabled={fieldState.invalid || loading}
                    loading={loading}
                    onClick={requestSubmit}
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <div className='flex h-[2.86rem] items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3'>
                <div className='flex flex-nowrap items-center gap-3'>
                  {prefix}
                  <span className='block font-body text-base text-gray-900'>
                    <>
                      {parser
                        ? parser(itemValueRef.current)
                        : itemValueRef.current}
                    </>
                  </span>
                  {suffix}
                </div>
                <BtnEdit onClick={onEdit} />
              </div>
            )
          }
        />
      </div>
    </>
  );
};
export default FormItem;
