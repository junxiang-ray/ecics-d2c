import { CardOptions } from '@/components/ui/form/radiocardfield';

export enum HelperTypeValue {
  NEW_MAID = 'New Maid',
  RENEWAL_MAID = 'Renewal Maid',
  TRANSFER_MAID = 'Transfer Maid',
}

type HelperTypeInfo = {
  title: string;
  description: string;
  cardDescription: string;
};

const HELPER_DATA: Record<HelperTypeValue, HelperTypeInfo> = {
  [HelperTypeValue.NEW_MAID]: {
    title: 'Set the Right Start Date for Your Maid Insurance',
    description:
      'Set the Policy Start Date as your helper’s arrival in Singapore',
    cardDescription: 'A helper without any existing contract/work permit',
  },
  [HelperTypeValue.RENEWAL_MAID]: {
    title: 'Align Insurance Start Date with MOM Application',
    description:
      'Set the start date as the work permit application date at MOM',
    cardDescription: 'Extending your current helper’s work permit with you',
  },
  [HelperTypeValue.TRANSFER_MAID]: {
    title: 'Start Date Should Match Current Work Permit Expiry',
    description: 'Set the start date as the current work permit’s expiry date',
    cardDescription:
      'Helper is already in Singapore but moving from another employer to you',
  },
};

export const HELPER_TYPE_CARD_OPTIONS: CardOptions[] = Object.entries(
  HELPER_DATA,
).map(([value, { cardDescription }]) => ({
  value,
  label: value,
  description: cardDescription,
}));

export const HELPER_VALUE_INFO: Record<
  HelperTypeValue,
  Omit<HelperTypeInfo, 'cardDescription'>
> = Object.fromEntries(
  Object.entries(HELPER_DATA).map(([value, { title, description }]) => [
    value,
    { title, description },
  ]),
) as Record<HelperTypeValue, Omit<HelperTypeInfo, 'cardDescription'>>;
