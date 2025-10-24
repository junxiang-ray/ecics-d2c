///This file contains all the route constants used in the application.

///this function creates the steps for insurance purchase process
const createInsuranceRoutes = (basePath: string) => ({
  BASIC_DETAIL: `${basePath}/basic-detail`,
  BASIC_DETAIL_SINGPASS: `${basePath}/basic-detail?manual=false`,
  BASIC_DETAIL_MANUAL: `${basePath}/basic-detail?manual=true`,
  PLAN: `${basePath}/plan`,
  ADD_ON: `${basePath}/add-on`,
  PERSONAL_DETAIL: `${basePath}/personal-detail`,
  COMPLETE_PURCHASE: `${basePath}/complete-purchase`,
  HELPER_DETAIL: `${basePath}/helpers-detail`,
  QUOTE_DETAILS: `${basePath}/quote-detail`,
});

///Base Routes
export const ROUTES = {
  INSURANCE: createInsuranceRoutes('/motor/insurance'),
  INSURANCE_MAID: createInsuranceRoutes('/maid/insurance'),
  INSURANCE_MOTORCYCLE: createInsuranceRoutes('/motorcycle/insurance'),
  INSURANCE_HOMECONTENTS: createInsuranceRoutes('/home-contents/insurance'),
  API_ERROR: '/error-page',
  MOTOR: {
    LOGIN: '/motor',
    REVIEW_INFO_DETAIL: '/motor/review-info-detail',
  },
  MAID: {
    LOGIN: '/maid',
    REVIEW_INFO_DETAIL: '/maid/review-info-detail',
  },
  MOTORCYCLE: {
    LOGIN: '/motorcycle',
    REVIEW_INFO_DETAIL: '/motorcycle/review-info-detail',
  },
  RENEWAL: {
    LOGIN: '/renewal/login',
    RENEWAL: '/renewal',
    RENEWAL_DASHBOARD: '/renewal',
    PROFILE: '/renewal/profile',
    SETTINGS: '/renewal/settings',
    RENEWAL_NOTICE: '/renewal/notice',
    RENEWAL_DETAIL: '/renewal/detail',
    RENEWAL_REVIEW: '/renewal/review',
    RENEWAL_ACCOUNT_SETUP: '/renewal/account-setup',
  },
  HOMECONTENT: {
    LOGIN: '/home-contents/insurance/',
    REVIEW_INFO_DETAIL: '/home-contents/review-info-detail',
  },
};

export const STEP_TO_ROUTE: Record<number, string> = {
  0: ROUTES.MOTOR.REVIEW_INFO_DETAIL,
  1: ROUTES.INSURANCE.BASIC_DETAIL,
  2: ROUTES.INSURANCE.PLAN,
  3: ROUTES.INSURANCE.ADD_ON,
  4: ROUTES.INSURANCE.PERSONAL_DETAIL,
  5: ROUTES.INSURANCE.COMPLETE_PURCHASE,
};
