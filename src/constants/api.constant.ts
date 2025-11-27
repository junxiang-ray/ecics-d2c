import { ProductTypeWeb } from '@/app/api/constants/product';

export const API_LOGIN = '/singpass/login';

export const API_GET_USER_INFO = '/singpass/user-info';

export const API_POST_PERSONAL_INFO_SAVE = '/personal-info/save';

export const API_GET_LIST_VEHICLE_MAKES = '/vehicle-makes/car';

export const API_GET_LIST_MOTORCYCLE_VEHICLE_MAKES =
  '/vehicle-makes/motorcycle';

export const API_GET_LIST_VEHICLE_MODELS = '/vehicle-models/car/';

export const API_GET_LIST_MOTORCYCLE_VEHICLE_MODELS =
  '/vehicle-models/motorcycle/';

export const API_POST_CHECK_VEHICLE = '/check-vehicle';

export const API_GET_QUOTE_BY_KEY = '/quote/';

export const API_SAVE_QUOTE = '/quote/save';

export const API_GET_LIST_NATIONAL = '/nationalities';

export const API_POST_VERIFY_RESTRICTED_USER = '/customer-info';

export const API_GET_PAYMENT_SUMMARY_DATA = '/payment-summary';

export const API_POST_ZIP_FILES_DOWNLOAD = '/zip-files';

export const API_GET_REQUEST_LOG = '/request-log/';

export const API_GET_HIRE_PURCHASE_LIST = '/companies/';

export const API_POST_PAYMENT = '/payment';

export const API_CHECK_AI_MAKE_MODEL = '/check-vehicle';

// renewal
export const API_LOGIN_RENEWAL = '/singpass/login/renewal';

export const API_RETRIEVE_POLICY = '/renewal/motor/retrieve-policy';

export const API_CHECK_POLICY = '/renewal/motor/check-policy';

export const API_RENEWAL_PAYMENT = '/renewal/motor/get-policy';

export const API_EDIT_RENEWAL = (productType: ProductTypeWeb) =>
  `/renewal/${productType}/edit-policy`;

export const API_GET_RENEWAL_CONTENT = '/renewal-content';

export const API_RENEWAL_PROCESS_PAYMENT = (productType: ProductTypeWeb) =>
  `/renewal/${productType}/payment`;

export const API_POST_SAVE_POLICY = (productType: ProductTypeWeb) =>
  `/renewal/${productType}/save-policy`;

export const API_GET_SESSION_TIMEOUT = '/renewal-section-timeout';

export const API_RETRIVE_NRIC_SINGPASS_RENEWAL =
  '/renewal/motor/retrieve-nric-singpass';

export const API_POST_CMS_CHECK_POLICIES = '/check-policies';

export const API_ANNOUNCEMENT_GET = '/announcements';

export const API_PROMOTION_GET = '/current-promotions';

export const API_POLICY_GET = '/policies';

export const API_CLAIM_GET = '/claims';

export const API_PRIVACY_POLICY_GET = '/privacy-policy';

export const API_TERM_GET = '/term-and-condition';
