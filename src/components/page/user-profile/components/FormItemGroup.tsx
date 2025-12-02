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

import { useEffect, useRef, useState, Fragment } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Input, Select, Button, Form } from 'antd';
import BtnEdit from './BtnEdit';

type Item<GroupValues> = {
  label?: string;
  name: keyof GroupValues;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  parser?: (
    value: GroupValues[Item<GroupValues>['name']],
    values: GroupValues,
  ) => GroupValues[Item<GroupValues>['name']];
  render: ({
    field,
    fieldState,
  }: {
    field?: any;
    fieldState?: any;
  }) => JSX.Element;
};

interface Props<GroupValues> {
  items: Item<GroupValues>[];
  className?: string;
  onSubmit?: (values: GroupValues) => Observable<any>;
}

type UpdateResp<GroupValues> = UserUpdateResponse<
  GroupValues[Item<GroupValues>['name']]
>;

const FormItemGroup = <GroupValues,>({
  items,
  className,
  onSubmit,
}: Props<GroupValues>): JSX.Element => {
  const subscriptionRef = useRef<Subscription | null>();

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { control, setValue, getValues, trigger, getFieldState, watch } =
    useFormContext();

  const validFieldsRef = useRef<Partial<Record<keyof GroupValues, boolean>>>(
    {},
  );
  const itemValueRef = useRef<GroupValues>(
    Object.fromEntries(
      items.map((item) => [item.name, getValues(item.name as string) ?? null]),
    ) as GroupValues,
  );

  useEffect(() => {
    let subscription: Subscription | undefined;
    if (isEdit) {
      validFieldsRef.current = Object.fromEntries(
        items.map((item) => [
          item.name,
          !getFieldState(item.name as string)?.invalid,
        ]),
      ) as Record<keyof GroupValues, boolean>;
      setIsValid(Object.values(validFieldsRef.current).every(Boolean));
      subscription = watch((_, { values, name, type }) => {
        // PURPOSE: Ignore the value change event, or other field validation changes.
        if (
          type ||
          itemValueRef.current[name as keyof GroupValues] === undefined
        )
          return;

        const fieldState = getFieldState(name as string);
        validFieldsRef.current[name as keyof GroupValues] = !fieldState.invalid;
        setIsValid(Object.values(validFieldsRef.current).every(Boolean));
      }) as unknown as Subscription;
    }

    return () => subscription?.unsubscribe();
  }, [isEdit]);

  const onCancel = (): void => {
    items.forEach(({ name }, idx) => {
      setValue(name as string, itemValueRef.current[name]);
      trigger(name as string);
    });
    setIsEdit(false);
  };

  const onEdit = (): void => {
    setIsEdit(true);
  };

  const requestSubmit = (): void => {
    if (!onSubmit) return;

    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();

    setLoading(true);
    subscriptionRef.current = onSubmit(
      Object.fromEntries(
        items.map(({ name }) => [name, getValues(name as string)]),
      ) as GroupValues,
    )
      .pipe(
        take(1),
        tap((resp: UpdateResp<GroupValues>) => {
          setLoading(false);
          if (!resp.success) return;

          itemValueRef.current = resp.data as unknown as GroupValues;
          setIsEdit(false);
        }),
        filter((resp: UpdateResp<GroupValues>) => resp?.success),
        debounceTime(50),
      )
      .subscribe((resp: UpdateResp<GroupValues>) => {
        itemValueRef.current = resp.data as unknown as GroupValues;
        items.forEach(({ name }, idx) => {
          setValue(name as string, itemValueRef.current[name]);
          trigger(name as string);
        });
      });
  };

  return (
    <>
      <div className={`${className ?? ''}`}>
        {isEdit ? (
          <>
            {items.map(({ name, label, render }, idx) => (
              <div key={idx}>
                <label className='form-label mb-2 inline-block font-body text-sm font-medium text-gray-700'>
                  {label}&nbsp;
                </label>
                <Controller
                  name={name as string}
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      {!!render && render({ field, fieldState })}
                      {fieldState.invalid ? (
                        <span className='text-sm text-red-400'>
                          {fieldState?.error?.message}
                        </span>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                />
              </div>
            ))}
          </>
        ) : (
          <div className='form-item-no-edit flex items-start justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3'>
            <div className='font-body text-base leading-relaxed text-gray-900'>
              {items.map(({ name, parser }, idx) => (
                <Fragment key={idx}>
                  <>
                    {parser
                      ? parser(itemValueRef.current[name], itemValueRef.current)
                      : itemValueRef.current[name]}
                    <br />
                  </>
                </Fragment>
              ))}
            </div>
            <BtnEdit onClick={onEdit} />
          </div>
        )}
      </div>
      {isEdit && (
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
            disabled={!isValid || loading}
            loading={loading}
            onClick={requestSubmit}
          >
            Save Changes
          </Button>
        </div>
      )}
    </>
  );
};
export default FormItemGroup;
