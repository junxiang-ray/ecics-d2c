import {
  MARITAL_STATUS,
  MARITAL_STATUS_OPTIONS,
  GENDER_OPTIONS,
} from '@/constants/user';

import { MaritalStatus } from '@/libs/types/common';
import { FORM_ITEM, FormValues } from '../PersonalInfo';

import { useCallback } from 'react';

import FormItem from './FormItem';

interface Props {
  isEdit: boolean;
}

const PersonalInfoForm = ({ isEdit }: Props): JSX.Element => {
  const parseGender = useCallback<(value: string) => string>(
    (value) =>
      (GENDER_OPTIONS.find((option) => value === option.value)
        ?.label as unknown as string) ?? '',
    [],
  );
  const parseMaritalStatus = useCallback<(value: string) => string>(
    (value) => MARITAL_STATUS[value as unknown as MaritalStatus],
    [],
  );

  return (
    <>
      <div className='grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2'>
        <FormItem<FormValues> label='Full Name' name={FORM_ITEM.NAME} />
        <FormItem<FormValues>
          label='Gender'
          name={FORM_ITEM.GENDER}
          parser={parseGender}
        />
        <FormItem<FormValues>
          className='md:col-span-2'
          label='Marital Status'
          name={FORM_ITEM.MARITAL_STATUS}
          enabled={isEdit}
          parser={parseMaritalStatus}
          type='select'
          options={MARITAL_STATUS_OPTIONS}
        />
      </div>
    </>
  );
};
export default PersonalInfoForm;
