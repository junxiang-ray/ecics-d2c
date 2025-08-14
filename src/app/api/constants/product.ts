export const PRODUCT_NAME = {
  CAR: 'car',
  MAID: 'maid',
  MOTOR: 'motor',
  RENEWAL: 'renewal',
} as const;

export type ProductTypeWeb = (typeof PRODUCT_NAME)[keyof typeof PRODUCT_NAME];

export type PlanGroupType = Exclude<
  ProductTypeWeb,
  typeof PRODUCT_NAME.MOTOR | typeof PRODUCT_NAME.RENEWAL
>;
