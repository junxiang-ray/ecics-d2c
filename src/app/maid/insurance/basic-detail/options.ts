import { CardOptions } from '@/components/ui/form/radiocardfield';

export enum HelperTypeValue {
  NEW_MAID = 'New Maid',
  RENEWAL_MAID = 'Renewal Maid',
  TRANSFER_MAID = 'Transfer Maid',
}

type HelperTypeInfo = {
  title: string;
  description: string;
};

export const HELPER_TYPE_CARD_OPTIONS: CardOptions[] = [
  {
    value: HelperTypeValue.NEW_MAID,
    label: 'New Maid',
    description: 'A helper without any existing contract/work permit',
  },
  {
    value: HelperTypeValue.RENEWAL_MAID,
    label: 'Renewal Maid',
    description: 'Extending your current helper’s work permit with you',
  },
  {
    value: HelperTypeValue.TRANSFER_MAID,
    label: 'Transfer Maid',
    description:
      'Helper is already in Singapore but moving from another employer to you',
  },
];

export const HELPER_VALUE_INFO: Record<string, HelperTypeInfo> = {
  [HelperTypeValue.NEW_MAID]: {
    title: 'Set the Right Start Date for Your Maid Insurance',
    description:
      'Set the Policy Start Date as your helper’s arrival in Singapore',
  },
  [HelperTypeValue.RENEWAL_MAID]: {
    title: 'Align Insurance Start Date with MOM Application',
    description:
      'Set the start date as the work permit application date at MOM',
  },
  [HelperTypeValue.TRANSFER_MAID]: {
    title: 'Start Date Should Match Current Work Permit Expiry',
    description: 'Set the start date as the current work permit’s expiry date',
  },
};
