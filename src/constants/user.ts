import { LabeledValue as SelectionOption } from '@/antd/es/select/index.d';
import {
  Gender as TGender,
  MaritalStatus as TMaritalStatus,
} from '@/libs/types/common';
import { Gender, MaritalStatus } from '@/libs/enums/user';

export const GENDER_OPTIONS: SelectionOption<TGender>[] = [
  { value: Gender.Male, text: 'Male' },
  { value: Gender.Female, text: 'Female' },
];

export const MARITAL_STATUS: Record<TMaritalStatus, string> = {
  [MaritalStatus.Married]: 'Married',
  [MaritalStatus.Single]: 'Single',
  [MaritalStatus.Widowed]: 'Widowed',
  [MaritalStatus.Divorced]: 'Divorced',
};

export const MARITAL_STATUS_OPTIONS: SelectionOption<TMaritalStatus> = [
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
