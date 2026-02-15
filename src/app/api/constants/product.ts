export const PRODUCT_NAME = {
  CAR: 'car',
  MAID: 'maid',
  MOTOR: 'motor',
  MOTORCYCLE: 'b2c_motorcycle2',
  RENEWAL: 'renewal',
  PORTAL: 'portal',
  HOME_CONTENT: 'home_contents', /// <- change this when API ready
  // HOME_CONTENT_SINGPASS: 'home_contents'
} as const;

export type ProductTypeWeb = (typeof PRODUCT_NAME)[keyof typeof PRODUCT_NAME];

export type PlanGroupType = Exclude<
  ProductTypeWeb,
  typeof PRODUCT_NAME.MOTOR | typeof PRODUCT_NAME.RENEWAL
>;
