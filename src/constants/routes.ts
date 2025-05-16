export const ROUTES = {
  INSURANCE: {
    BASIC_DETAIL: '/insurance/basic-detail',
    BASIC_DETAIL_SINGPASS: '/insurance/basic-detail?manual=false',
    BASIC_DETAIL_MANUAL: '/insurance/basic-detail?manual=true',
    PLAN: '/insurance/plan',
    ADD_ON: '/insurance/add-on',
    COMPLETE_PURCHASE: '/insurance/complete-purchase',
  },
  AUTH: {
    LOGIN: '/login',
    REVIEW_INFO_DETAIL: '/review-info-detail',
  },
};

export const STEP_TO_ROUTE: Record<number, string> = {
  0: ROUTES.AUTH.REVIEW_INFO_DETAIL,
  1: ROUTES.INSURANCE.BASIC_DETAIL,
  2: ROUTES.INSURANCE.PLAN,
  3: ROUTES.INSURANCE.ADD_ON,
  4: ROUTES.INSURANCE.COMPLETE_PURCHASE,
};
