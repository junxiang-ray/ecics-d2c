import type { LabeledValue } from 'antd/es/select';
import { MaritalStatus as TMaritalStatus } from '@/libs/types/common';
import { MaritalStatus, Gender } from '@/libs/enums/user';

export const GENDER_OPTIONS: LabeledValue[] = [
  {
    value: Gender.Male,
    label: 'Male',
  },
  {
    value: Gender.Female,
    label: 'Female',
  },
];

export const MARITAL_STATUS: Record<TMaritalStatus, string> = {
  [MaritalStatus.Married]: 'Married',
  [MaritalStatus.Single]: 'Single',
  [MaritalStatus.Widowed]: 'Widowed',
  [MaritalStatus.Divorced]: 'Divorced',
};

export const MARITAL_STATUS_OPTIONS: LabeledValue[] = [
  {
    value: MaritalStatus.Married,
    label: MARITAL_STATUS[MaritalStatus.Married],
  },
  { value: MaritalStatus.Single, label: MARITAL_STATUS[MaritalStatus.Single] },
  {
    value: MaritalStatus.Widowed,
    label: MARITAL_STATUS[MaritalStatus.Widowed],
  },
  {
    value: MaritalStatus.Divorced,
    label: MARITAL_STATUS[MaritalStatus.Divorced],
  },
];
