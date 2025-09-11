import { CardOptions } from '@/components/ui/form/radiocardfield';

export enum HelperTypeValue {
  NEW_MAID = 'New Maid',
  RENEWAL_MAID = 'Renewal Maid',
  TRANSFER_MAID = 'Transfer Maid',
}

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
